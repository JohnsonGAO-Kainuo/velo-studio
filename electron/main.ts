import { app, BrowserWindow, Tray, Menu, nativeImage, protocol, net, systemPreferences } from 'electron'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createHudOverlayWindow, createEditorWindow, createSourceSelectorWindow, createAuthWindow } from './windows'
import { registerIpcHandlers } from './ipc/handlers'
import { initAutoUpdater } from './updater'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Register custom protocol for loading local assets
// Must be done before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'velo-asset',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      corsEnabled: true,
      stream: true
    }
  }
])

// Set app name for development mode (production uses electron-builder config)
app.setName('Velo Studio')

// Deep link protocol for OAuth callback
const DEEP_LINK_PROTOCOL = 'velostudio'

// Register as default protocol client
if (process.defaultApp && process.argv.length >= 2) {
  // Development mode: need to pass script path
  app.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
} else {
  // Production mode
  app.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL)
}

// Pending deep link URL (received before app is ready)
let pendingDeepLinkUrl: string | null = null

function handleDeepLink(url: string) {
  console.log('[Deep Link] Received:', url)
  try {
    const parsed = new URL(url)
    const code = parsed.searchParams.get('code')
    const accessToken = parsed.searchParams.get('access_token')
    const refreshToken = parsed.searchParams.get('refresh_token')
    if (code) {
      console.log('[Deep Link] Got auth code, sending to auth window')
      if (authWindow && !authWindow.isDestroyed()) {
        authWindow.webContents.send('oauth-callback', { code })
        authWindow.focus()
      } else {
        pendingDeepLinkUrl = url
      }
    } else if (accessToken && refreshToken) {
      console.log('[Deep Link] Got auth tokens, sending to auth window')
      if (authWindow && !authWindow.isDestroyed()) {
        authWindow.webContents.send('deep-link-auth', { accessToken, refreshToken })
        authWindow.focus()
      } else {
        // Auth window might not exist yet, store for later
        pendingDeepLinkUrl = url
      }
    }
  } catch (err) {
    console.error('[Deep Link] Failed to parse URL:', err)
  }
}

// macOS: handle deep link when app is already running
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleDeepLink(url)
})

export const RECORDINGS_DIR = path.join(app.getPath('userData'), 'recordings')


async function ensureRecordingsDir() {
  try {
    await fs.mkdir(RECORDINGS_DIR, { recursive: true })
    console.log('RECORDINGS_DIR:', RECORDINGS_DIR)
    console.log('User Data Path:', app.getPath('userData'))
  } catch (error) {
    console.error('Failed to create recordings directory:', error)
  }
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// Window references
let mainWindow: BrowserWindow | null = null
let authWindow: BrowserWindow | null = null
let sourceSelectorWindow: BrowserWindow | null = null
let tray: Tray | null = null
let selectedSourceName = ''
let isAuthenticated = false  // Track auth state to prevent premature HUD creation

// Tray Icons
const defaultTrayIcon = getTrayIcon('openscreen.png');
const recordingTrayIcon = getTrayIcon('rec-button.png');

function createWindow() {
  mainWindow = createHudOverlayWindow()
}

function createTray() {
  tray = new Tray(defaultTrayIcon);
}

function getTrayIcon(filename: string) {
  return nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC || RENDERER_DIST, filename)).resize({
    width: 24,
    height: 24,
    quality: 'best'
  });
}


function updateTrayMenu(recording: boolean = false) {
  if (!tray) return;
  const trayIcon = recording ? recordingTrayIcon : defaultTrayIcon;
  const trayToolTip = recording ? `Recording: ${selectedSourceName}` : "Velo Studio";
  const menuTemplate = recording
    ? [
        {
          label: "Stop Recording",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send("stop-recording-from-tray");
            }
          },
        },
      ]
    : [
        {
          label: "Open",
          click: () => {
            if (!isAuthenticated) {
              // Not authenticated yet, show/focus auth window instead
              if (authWindow && !authWindow.isDestroyed()) {
                authWindow.show();
                authWindow.focus();
              }
              return;
            }
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.isMinimized() && mainWindow.restore();
            } else {
              createWindow();
            }
          },
        },
        {
          label: "Quit",
          click: () => {
            app.quit();
          },
        },
      ];
  tray.setImage(trayIcon);
  tray.setToolTip(trayToolTip);
  tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
}

function createEditorWindowWrapper() {
  if (mainWindow) {
    mainWindow.close()
    mainWindow = null
  }
  mainWindow = createEditorWindow()
}

function createSourceSelectorWindowWrapper() {
  sourceSelectorWindow = createSourceSelectorWindow()
  sourceSelectorWindow.on('closed', () => {
    sourceSelectorWindow = null
  })
  return sourceSelectorWindow
}

// On macOS, applications and their menu bar stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // Keep app running (macOS behavior)
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



// Register all IPC handlers when app is ready
app.whenReady().then(async () => {
    // Register custom protocol handler for velo-asset://
    // This allows loading local files securely in the renderer
    protocol.handle('velo-asset', (request) => {
      // velo-asset://wallpapers/wallpaper1.jpg -> /path/to/assets/wallpapers/wallpaper1.jpg
      const url = new URL(request.url)
      const relativePath = decodeURIComponent(url.pathname).replace(/^\//, '')
      
      let basePath: string
      if (app.isPackaged) {
        basePath = path.join(process.resourcesPath, 'assets')
      } else {
        basePath = path.join(process.env.APP_ROOT || '', 'public')
      }
      
      const filePath = path.join(basePath, relativePath)
      console.log('[velo-asset protocol] Resolving:', request.url, '->', filePath)
      
      return net.fetch(pathToFileURL(filePath).href)
    })

    // Set dock icon for development mode on macOS
    if (process.platform === 'darwin' && !app.isPackaged) {
      const iconPath = path.join(process.env.APP_ROOT || '', 'icons', 'icons', 'mac', 'icon.icns')
      try {
        const dockIcon = nativeImage.createFromPath(iconPath)
        if (!dockIcon.isEmpty() && app.dock) {
          app.dock.setIcon(dockIcon)
        }
      } catch (e) {
        console.warn('Failed to set dock icon:', e)
      }
    }

    // Listen for HUD overlay quit event (macOS only)
    const { ipcMain } = await import('electron');
    ipcMain.on('hud-overlay-close', () => {
      app.quit();
    });

    // Listen for auth ready event - switch from auth window to HUD overlay
    ipcMain.on('auth-ready', () => {
      console.log('[Auth] auth-ready received, switching to HUD overlay');
      isAuthenticated = true;
      
      if (authWindow && !authWindow.isDestroyed()) {
        authWindow.close();
        authWindow = null;
      }
      
      // Small delay to ensure auth window is fully cleaned up before creating HUD
      setTimeout(() => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
        }
        updateTrayMenu();
      }, 300);
    });

    // OAuth: open Google sign-in in a dedicated BrowserWindow (replaces unreliable deep links)
    ipcMain.handle('open-oauth-window', (_, url: string) => {
      const oauthWin = new BrowserWindow({
        width: 500,
        height: 700,
        title: 'Sign in - Velo Studio',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          partition: 'oauth', // isolated session so interceptor doesn't affect main windows
        },
      })

      // Intercept the callback URL BEFORE the page loads to extract the auth code (PKCE)
      oauthWin.webContents.session.webRequest.onBeforeRequest(
        { urls: ['https://velostudio.app/auth/callback*'] },
        (details, callback) => {
          try {
            const parsed = new URL(details.url)
            const code = parsed.searchParams.get('code')
            if (code) {
              console.log('[OAuth Window] Intercepted auth code, sending to auth window')
              if (authWindow && !authWindow.isDestroyed()) {
                authWindow.webContents.send('oauth-callback', { code })
              }
              setImmediate(() => {
                if (!oauthWin.isDestroyed()) oauthWin.close()
              })
              callback({ cancel: true })
              return
            }
          } catch (err) {
            console.error('[OAuth Window] Failed to parse callback URL:', err)
          }
          callback({})
        }
      )

      // Fallback: if onBeforeRequest doesn't catch it (e.g. client-side redirect)
      oauthWin.webContents.on('did-navigate', (_event, navUrl) => {
        if (navUrl.startsWith('https://velostudio.app/auth/callback')) {
          try {
            const parsed = new URL(navUrl)
            const code = parsed.searchParams.get('code')
            if (code) {
              console.log('[OAuth Window] Fallback: caught auth code via did-navigate')
              if (authWindow && !authWindow.isDestroyed()) {
                authWindow.webContents.send('oauth-callback', { code })
              }
              if (!oauthWin.isDestroyed()) oauthWin.close()
            }
          } catch (err) {
            console.error('[OAuth Window] did-navigate error:', err)
          }
        }
      })

      oauthWin.loadURL(url)
    })

    // Permission checking (macOS)
    ipcMain.handle('check-screen-permission', () => {
      if (process.platform === 'darwin') {
        return systemPreferences.getMediaAccessStatus('screen')
      }
      return 'granted'
    })

    ipcMain.handle('check-microphone-permission', async () => {
      if (process.platform === 'darwin') {
        const status = systemPreferences.getMediaAccessStatus('microphone')
        if (status === 'not-determined') {
          const granted = await systemPreferences.askForMediaAccess('microphone')
          return granted ? 'granted' : 'denied'
        }
        return status
      }
      return 'granted'
    })

    createTray()
    updateTrayMenu()
  // Ensure recordings directory exists
  await ensureRecordingsDir()

  registerIpcHandlers(
    createEditorWindowWrapper,
    createSourceSelectorWindowWrapper,
    () => mainWindow,
    () => sourceSelectorWindow,
    (recording: boolean, sourceName: string) => {
      selectedSourceName = sourceName
      if (!tray) createTray();
      updateTrayMenu(recording);
      if (!recording) {
        if (mainWindow) mainWindow.restore();
      }
    }
  )
  // Start with auth window - will switch to HUD overlay after auth
  authWindow = createAuthWindow()
  authWindow.on('closed', () => {
    authWindow = null;
  })

  // Check for pending deep link (received before auth window was ready)
  if (pendingDeepLinkUrl) {
    setTimeout(() => {
      if (pendingDeepLinkUrl) {
        handleDeepLink(pendingDeepLinkUrl)
        pendingDeepLinkUrl = null
      }
    }, 1500)
  }

  // Initialize auto-updater (checks GitHub Releases for new versions)
  initAutoUpdater()
})
