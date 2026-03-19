import { ipcMain, desktopCapturer, BrowserWindow, shell, app, dialog, screen } from 'electron'

import fs from 'node:fs/promises'
import path from 'node:path'
import { RECORDINGS_DIR } from '../main'

let selectedSource: any = null

// Cursor tracking state
let cursorTrackingActive = false
let cursorEvents: Array<{x: number, y: number, timestamp: number, type: string, button?: number}> = []
let cursorTrackingStartTime = 0
let cursorTrackingInterval: NodeJS.Timeout | null = null
// Source bounds for window captures (null = full screen)
let cursorSourceBounds: { x: number, y: number, width: number, height: number } | null = null

export function registerIpcHandlers(
  createEditorWindow: () => void,
  createSourceSelectorWindow: () => BrowserWindow,
  getMainWindow: () => BrowserWindow | null,
  getSourceSelectorWindow: () => BrowserWindow | null,
  onRecordingStateChange?: (recording: boolean, sourceName: string) => void
) {
  ipcMain.handle('get-sources', async (_, opts) => {
    const sources = await desktopCapturer.getSources(opts)
    return sources.map(source => ({
      id: source.id,
      name: source.name,
      display_id: source.display_id,
      thumbnail: source.thumbnail ? source.thumbnail.toDataURL() : null,
      appIcon: source.appIcon ? source.appIcon.toDataURL() : null
    }))
  })

  ipcMain.handle('select-source', (_, source) => {
    selectedSource = source
    const sourceSelectorWin = getSourceSelectorWindow()
    if (sourceSelectorWin) {
      sourceSelectorWin.close()
    }
    return selectedSource
  })

  ipcMain.handle('get-selected-source', () => {
    return selectedSource
  })

  ipcMain.handle('open-source-selector', () => {
    const sourceSelectorWin = getSourceSelectorWindow()
    if (sourceSelectorWin) {
      sourceSelectorWin.focus()
      return
    }
    createSourceSelectorWindow()
  })

  ipcMain.handle('switch-to-editor', () => {
    const mainWin = getMainWindow()
    if (mainWin) {
      mainWin.close()
    }
    createEditorWindow()
  })

  // Hide/show/minimize/restore main window during recording
  ipcMain.handle('hide-main-window', () => {
    const mainWin = getMainWindow()
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.hide()
    }
  })

  ipcMain.handle('show-main-window', () => {
    const mainWin = getMainWindow()
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.show()
    }
  })

  ipcMain.handle('minimize-main-window', () => {
    const mainWin = getMainWindow()
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.minimize()
    }
  })

  ipcMain.handle('restore-main-window', () => {
    const mainWin = getMainWindow()
    if (mainWin && !mainWin.isDestroyed()) {
      if (mainWin.isMinimized()) {
        mainWin.restore()
      }
      mainWin.show()
    }
  })


  ipcMain.handle('store-recorded-video', async (_, videoData: ArrayBuffer, fileName: string) => {
    try {
      const videoPath = path.join(RECORDINGS_DIR, fileName)
      await fs.writeFile(videoPath, Buffer.from(videoData))
      currentVideoPath = videoPath;
      return {
        success: true,
        path: videoPath,
        message: 'Video stored successfully'
      }
    } catch (error) {
      console.error('Failed to store video:', error)
      return {
        success: false,
        message: 'Failed to store video',
        error: String(error)
      }
    }
  })


  ipcMain.handle('get-recorded-video-path', async () => {
    try {
      const files = await fs.readdir(RECORDINGS_DIR)
      const videoFiles = files.filter(file => file.endsWith('.webm'))
      
      if (videoFiles.length === 0) {
        return { success: false, message: 'No recorded video found' }
      }
      
      const latestVideo = videoFiles.sort().reverse()[0]
      const videoPath = path.join(RECORDINGS_DIR, latestVideo)
      
      return { success: true, path: videoPath }
    } catch (error) {
      console.error('Failed to get video path:', error)
      return { success: false, message: 'Failed to get video path', error: String(error) }
    }
  })

  ipcMain.handle('set-recording-state', (_, recording: boolean) => {
    const source = selectedSource || { name: 'Screen' }
    if (onRecordingStateChange) {
      onRecordingStateChange(recording, source.name)
    }
  })


  ipcMain.handle('open-external-url', async (_, url: string) => {
    try {
      await shell.openExternal(url)
      return { success: true }
    } catch (error) {
      console.error('Failed to open URL:', error)
      return { success: false, error: String(error) }
    }
  })

  // Return base path for assets so renderer can resolve file:// paths in production
  ipcMain.handle('get-asset-base-path', () => {
    try {
      if (app.isPackaged) {
        // In production: Resources/assets/wallpapers/...
        return path.join(process.resourcesPath, 'assets')
      }
      // In development: public/wallpapers/... (no assets subfolder)
      return path.join(app.getAppPath(), 'public')
    } catch (err) {
      console.error('Failed to resolve asset base path:', err)
      return null
    }
  })

  ipcMain.handle('save-exported-video', async (_, videoData: ArrayBuffer, fileName: string) => {
    try {
      const mainWindow = getMainWindow();
      
      // Determine file type from extension
      const isGif = fileName.toLowerCase().endsWith('.gif');
      const filters = isGif 
        ? [{ name: 'GIF Image', extensions: ['gif'] }]
        : [{ name: 'MP4 Video', extensions: ['mp4'] }];

      if (!mainWindow) {
        throw new Error('Main window not available');
      }

      const result = await dialog.showSaveDialog(mainWindow, {
        title: isGif ? 'Save Exported GIF' : 'Save Exported Video',
        defaultPath: path.join(app.getPath('downloads'), fileName),
        filters,
        properties: ['createDirectory', 'showOverwriteConfirmation']
      });

      if (result.canceled || !result.filePath) {
        return {
          success: false,
          cancelled: true,
          message: 'Export cancelled'
        };
      }

      await fs.writeFile(result.filePath, Buffer.from(videoData));

      return {
        success: true,
        path: result.filePath,
        message: 'Video exported successfully'
      };
    } catch (error) {
      console.error('Failed to save exported video:', error)
      return {
        success: false,
        message: 'Failed to save exported video',
        error: String(error)
      }
    }
  })

  ipcMain.handle('open-video-file-picker', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Select Video File',
        defaultPath: RECORDINGS_DIR,
        filters: [
          { name: 'Video Files', extensions: ['webm', 'mp4', 'mov', 'avi', 'mkv'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, cancelled: true };
      }

      return {
        success: true,
        path: result.filePaths[0]
      };
    } catch (error) {
      console.error('Failed to open file picker:', error);
      return {
        success: false,
        message: 'Failed to open file picker',
        error: String(error)
      };
    }
  });

  let currentVideoPath: string | null = null;

  ipcMain.handle('set-current-video-path', (_, path: string) => {
    currentVideoPath = path;
    return { success: true };
  });

  ipcMain.handle('get-current-video-path', () => {
    return currentVideoPath ? { success: true, path: currentVideoPath } : { success: false };
  });

  ipcMain.handle('clear-current-video-path', () => {
    currentVideoPath = null;
    return { success: true };
  });

  ipcMain.handle('get-platform', () => {
    return process.platform;
  });

  // Cursor tracking handlers
  ipcMain.handle('start-cursor-tracking', (_, sourceId?: string) => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenW, height: screenH } = primaryDisplay.size
    
    cursorEvents = []
    cursorTrackingStartTime = Date.now()
    cursorTrackingActive = true
    cursorSourceBounds = null

    // For window captures, try to find window bounds so we can normalize
    // cursor coordinates to the captured window instead of the full screen.
    if (sourceId && sourceId.startsWith('window:')) {
      try {
        const { execSync } = require('child_process')
        // Extract the numeric window ID from the Electron source id
        // Format: "window:123:0" → windowNumber = 123
        const windowIdStr = sourceId.split(':')[1]
        const windowNumber = parseInt(windowIdStr, 10)
        if (!isNaN(windowNumber)) {
          // Use CGWindowListCopyWindowInfo via Python to get window bounds
          const script = `python3 -c "
import json, subprocess, sys
import Quartz
wins = Quartz.CGWindowListCopyWindowInfo(Quartz.kCGWindowListOptionIncludingWindow, ${windowNumber})
if wins and len(wins) > 0:
    b = wins[0].get('kCGWindowBounds', {})
    print(json.dumps({'x': b.get('X',0), 'y': b.get('Y',0), 'width': b.get('Width',0), 'height': b.get('Height',0)}))
else:
    print('null')
"`
          const result = execSync(script, { timeout: 3000, encoding: 'utf-8' }).trim()
          if (result && result !== 'null') {
            const bounds = JSON.parse(result)
            if (bounds.width > 0 && bounds.height > 0) {
              cursorSourceBounds = bounds
              console.log('[Cursor Tracking] Window bounds:', cursorSourceBounds)
            }
          }
        }
      } catch (err) {
        console.warn('[Cursor Tracking] Could not get window bounds, using full screen:', err)
      }
    }

    const bounds = cursorSourceBounds
    
    // Sample cursor position at 30fps
    cursorTrackingInterval = setInterval(() => {
      if (!cursorTrackingActive) return
      
      const point = screen.getCursorScreenPoint()
      const timestamp = Date.now() - cursorTrackingStartTime
      
      // Normalize coordinates to 0-1 range relative to the capture source
      let nx: number, ny: number
      if (bounds) {
        // Window capture: normalize relative to window bounds
        nx = (point.x - bounds.x) / bounds.width
        ny = (point.y - bounds.y) / bounds.height
      } else {
        // Full screen capture: normalize relative to screen
        nx = point.x / screenW
        ny = point.y / screenH
      }
      
      cursorEvents.push({
        x: nx,
        y: ny,
        timestamp,
        type: 'move'
      })
    }, 33) // ~30fps
    
    return { success: true, screenWidth: bounds?.width || screenW, screenHeight: bounds?.height || screenH }
  })

  ipcMain.handle('stop-cursor-tracking', () => {
    cursorTrackingActive = false
    if (cursorTrackingInterval) {
      clearInterval(cursorTrackingInterval)
      cursorTrackingInterval = null
    }
    
    const duration = Date.now() - cursorTrackingStartTime
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.size
    
    const result = {
      events: cursorEvents,
      screenWidth: width,
      screenHeight: height,
      duration
    }
    
    // Clear events after returning
    cursorEvents = []
    
    return result
  })

  ipcMain.handle('record-cursor-click', (_, button: number) => {
    if (!cursorTrackingActive) return { success: false }
    
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenW, height: screenH } = primaryDisplay.size
    const point = screen.getCursorScreenPoint()
    const timestamp = Date.now() - cursorTrackingStartTime
    const bounds = cursorSourceBounds
    
    // Normalize coordinates relative to the capture source
    let nx: number, ny: number
    if (bounds) {
      nx = (point.x - bounds.x) / bounds.width
      ny = (point.y - bounds.y) / bounds.height
    } else {
      nx = point.x / screenW
      ny = point.y / screenH
    }
    
    cursorEvents.push({
      x: nx,
      y: ny,
      timestamp,
      type: 'click',
      button
    })
    
    return { success: true }
  })

  // Save cursor data alongside video
  ipcMain.handle('save-cursor-data', async (_, videoPath: string, cursorData: string) => {
    try {
      const cursorPath = videoPath.replace(/\.\w+$/, '.cursor.json')
      await fs.writeFile(cursorPath, cursorData, 'utf-8')
      return { success: true, path: cursorPath }
    } catch (err) {
      console.error('Failed to save cursor data:', err)
      return { success: false, error: String(err) }
    }
  })

  // Load cursor data for a video
  ipcMain.handle('load-cursor-data', async (_, videoPath: string) => {
    try {
      const cursorPath = videoPath.replace(/\.\w+$/, '.cursor.json')
      const data = await fs.readFile(cursorPath, 'utf-8')
      return { success: true, data }
    } catch (err) {
      // File might not exist, that's okay
      return { success: false, error: String(err) }
    }
  })
}
