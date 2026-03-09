import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog } from 'electron'

/**
 * Auto-updater module for Velo Studio.
 * Uses electron-updater with GitHub Releases as the update source.
 * 
 * Flow:
 * 1. App starts → checkForUpdates() silently in background
 * 2. If update found → notify user via dialog
 * 3. User confirms → download + install on quit
 */

// Configure updater
autoUpdater.autoDownload = false        // Don't download until user confirms
autoUpdater.autoInstallOnAppQuit = true  // Install when app quits
autoUpdater.autoRunAppAfterInstall = true // Relaunch after install

export function initAutoUpdater() {
  // Check for updates silently (no error dialogs for network issues)
  autoUpdater.on('error', (err) => {
    console.log('[AutoUpdater] Error:', err.message)
    // Silently fail - don't bother user with network errors
  })

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version)
    
    // Show update dialog to user
    const focusedWindow = BrowserWindow.getFocusedWindow()
    dialog.showMessageBox(focusedWindow || ({} as any), {
      type: 'info',
      title: 'Update Available',
      message: `A new version (v${info.version}) is available!`,
      detail: 'Would you like to download and install it? The update will be applied when you restart the app.',
      buttons: ['Update', 'Later'],
      defaultId: 0,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        // User chose to update - start download
        autoUpdater.downloadUpdate()
        
        // Notify renderer about download progress
        const windows = BrowserWindow.getAllWindows()
        windows.forEach(win => {
          if (!win.isDestroyed()) {
            win.webContents.send('update-downloading')
          }
        })
      }
    })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('[AutoUpdater] App is up to date.')
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log(`[AutoUpdater] Download: ${Math.round(progress.percent)}%`)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded:', info.version)
    
    // Notify user that update is ready
    const focusedWindow = BrowserWindow.getFocusedWindow()
    dialog.showMessageBox(focusedWindow || ({} as any), {
      type: 'info',
      title: 'Update Ready',
      message: 'Update has been downloaded!',
      detail: 'The update will be installed when you restart the app. Restart now?',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall(false, true)
      }
    })
  })

  // Check for updates after a short delay (let app finish loading)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.log('[AutoUpdater] Check failed (offline?):', err.message)
    })
  }, 5000)
}
