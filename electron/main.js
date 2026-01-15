/** Modules to control application life and create native browser window */
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, powerSaveBlocker, shell } = require('electron')
const path = require('node:path')


/** Number with the display sleep blocker ID  */
let appBlockerId

/** Creates a new app window */
function createWindow() {
    const window = new BrowserWindow({
        width: 1250,
        height: 700,
        minWidth: 1250,
        minHeight: 700,
        icon: path.join(app.getAppPath(), 'www', 'assets', 'icons', 'hasd.png'),
        webPreferences: {
            preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
            devTools: !app.isPackaged,
        }
    })
    window.maximize()
    window.loadFile(path.join(app.getAppPath(), 'www', 'index.html')) // Load the index.html of the app
    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url) // Opens in-app links on external browser
        return { action: 'deny' }
    })
    window.webContents.openDevTools();
    Menu.setApplicationMenu(null)
}

/**
 * Instructs the app to keep the screen always on
 * @returns Number with the blocker ID 
 */
function preventDisplaySleep() {
    appBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    if (powerSaveBlocker.isStarted(appBlockerId)) console.log('preventing display sleep')
    return appBlockerId
}

/**
 * Instructs the app to restore the screen power configuration
 * @returns Whether the specified powerSaveBlocker has been stopped
 */
function allowDisplaySleep() {
    if (powerSaveBlocker.isStarted(appBlockerId)) {
        console.log('allowing display sleep')
        return powerSaveBlocker.stop(appBlockerId)
    } else return false
}

/**
 * Resolves electron resources folder path whether app is packaged
 * @returns Returns electron video sources path
 */
function getVideoSourcesPath() {
    const prefix = app.isPackaged ? process.resourcesPath : '..'
    const videoSourcesPath = path.join(prefix, 'video-sources') + path.sep
    console.log('video sources path:', videoSourcesPath)
    return videoSourcesPath
}


app.commandLine.appendSwitch('lang', 'es-419'); // Sets language pack to Spanish (Latin America)
app.commandLine.appendSwitch('enable-experimental-web-platform-features') // Enables media audio tracks

app.whenReady().then(() => {
    // Renderer handlers
    ipcMain.handle('get-video-sources-path', (evt) => getVideoSourcesPath())

    // Register shortcuts
    globalShortcut.register('F11', () => {
        const win = BrowserWindow.getAllWindows()[0]
        win.setFullScreen(!win.isFullScreen())
    })

    createWindow()
    preventDisplaySleep()
})

app.on('will-quit', () => {
    allowDisplaySleep(appBlockerId)
})

app.on('window-all-closed', () => {
    app.quit()
})