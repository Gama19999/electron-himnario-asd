/** Modules to control application life and create native browser window */
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeTheme, powerSaveBlocker, shell } = require('electron')
const path = require('node:path')
const { APP_ID, DARK_THEME_ICON, LIGHT_THEME_ICON } = require('./constants')


/** Power blocker ID @type {number | undefined} */
let appBlockerId
/** App main window @type {BrowserWindow | undefined} */
let mainWindow

/** Disables NodeJS logs and sets App User Model ID (Windows only) */
(function() {
    if (app.isPackaged) { console.log = () => {} }
    if (process.platform === 'win32') { app.setAppUserModelId(APP_ID) }
})()

/** Changes the app icon to match OS theme  */
function updateAppIcon() {
    if (mainWindow) {
        const iconPath = path.join(app.getAppPath(), 'www', 'assets', 'icons', getAppIcon())
        mainWindow.setIcon(iconPath)
    }
}

/** @returns The app icon matching the OS theme */
function getAppIcon() {
    return nativeTheme.shouldUseDarkColors ? DARK_THEME_ICON : LIGHT_THEME_ICON
}

/** 
 * Requests the Electron display config
 * @param {string | undefined} like As `asleep` or `awake`
 * @returns The current display config
 */
function requestDisplaySleep(like) {
    switch (like) {
        case 'asleep': finishPowerSaverBlocker(); break
        case 'awake': startPowerSaveBlocker(); break
    }
    return powerSaveBlocker.isStarted(appBlockerId) ? 'awake' : 'asleep'
}

/** Starts a new power saver blocker */
function startPowerSaveBlocker() {
    if (powerSaveBlocker.isStarted(appBlockerId ?? 0)) { return }
    appBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    console.log('prevent-display-sleep', `Blocker ID (${appBlockerId}) is ${powerSaveBlocker.isStarted(appBlockerId) ? 'on' : 'off'}`)
}

/** Stops the current power saver blocker */
function finishPowerSaverBlocker() {
    if (powerSaveBlocker.isStarted(appBlockerId ?? 0)) {
        powerSaveBlocker.stop(appBlockerId)
        console.log('allow-display-sleep', `Blocker ID (${appBlockerId}) is ${powerSaveBlocker.isStarted(appBlockerId) ? 'on' : 'off'}`)
    }
}

/** Registers app related keyboard shortcuts */
function registerShortcuts() {
    globalShortcut.register('F11', () => {
        mainWindow?.setFullScreen(!mainWindow?.isFullScreen())
    })
}

/** Creates a new app window */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250,
        height: 700,
        minWidth: 1250,
        minHeight: 700,
        icon: path.join(app.getAppPath(), 'www', 'assets', 'icons', getAppIcon()),
        webPreferences: {
            preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
            devTools: !app.isPackaged,
        }
    })
    mainWindow.maximize()
    mainWindow.loadFile(path.join(app.getAppPath(), 'www', 'index.html')) // Load the index.html of the app
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url) // Opens in-app links on external browser
        return { action: 'deny' }
    })
    mainWindow.webContents.openDevTools()
    Menu.setApplicationMenu(null)
}


app.commandLine.appendSwitch('lang', 'es-419'); // Sets language pack to Spanish (Latin America)
app.commandLine.appendSwitch('enable-experimental-web-platform-features') // Enables video audio tracks

app.whenReady().then(() => {
    // Renderer handlers
    ipcMain.handle('get-display-sleep', (evt, like) => requestDisplaySleep(like))

    registerShortcuts()
    startPowerSaveBlocker()
    createWindow()

    // Listen for system theme changes
    nativeTheme.on('updated', () => updateAppIcon())
})

app.on('browser-window-focus', () => registerShortcuts())

app.on('browser-window-blur', () => globalShortcut.unregisterAll())

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
    finishPowerSaverBlocker(appBlockerId)
})

app.on('window-all-closed', () => {
    app.quit()
})