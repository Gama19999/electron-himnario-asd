/** Modules to control application life and create native browser window */
const { app, BrowserWindow, ipcMain, Menu, powerSaveBlocker, shell } = require('electron')
const path = require('node:path')


/** Number with the display sleep blocker ID  */
let appBlockerId;

/** Creates a new app window */
function createWindow() {
    const window = new BrowserWindow({
        width: 1250,
        height: 700,
        minWidth: 1250,
        minHeight: 700,
        icon: path.join(__dirname, '..', 'www', 'assets', 'icons', 'hasd.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    window.maximize()
    window.loadFile(path.join(__dirname, '..', 'www', 'index.html')) // Load the index.html of the app
    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url) // Opens in-app links on external browser
        return { action: 'deny' }
    })
    window.webContents.openDevTools();
    Menu.setApplicationMenu(null)
}

/**
 * Instructs the app to change the fullscreen mode
 * @param flag Boolean indicating whether to go fullscreen
 */
function setFullScreenAs(flag) { BrowserWindow.getAllWindows()[0].setFullScreen(flag) }

/**
 * Instructs the app to keep the screen always on
 * @returns Number with the blocker ID 
 */
function preventDisplaySleep() {
    appBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    return appBlockerId
}

/**
 * Instructs the app to restore the screen power configuration
 * @param blockerId Number with the blocker ID previously assigned
 * @returns Whether the specified powerSaveBlocker has been stopped
 */
function allowDisplaySleep(blockerId) {
    if (Number.isFinite(blockerId) && blockerId !== appBlockerId) return;
    return powerSaveBlocker.isStarted(appBlockerId) ? powerSaveBlocker.stop(blockerId) : false
}



app.commandLine.appendSwitch('lang', 'es-419'); // Sets language pack to Spanish (Latin America)
app.commandLine.appendSwitch('enable-experimental-web-platform-features') // Enables media audio tracks

app.whenReady().then(() => {
    // Renderer handlers
    ipcMain.on('set-fullscreen-as', (evt, flag) => setFullScreenAs(flag))
    ipcMain.handle('prevent-display-sleep', async (evt) => preventDisplaySleep())
    ipcMain.handle('allow-display-sleep', async (evt, blockerId) => allowDisplaySleep(blockerId))

    createWindow()
})

app.on('will-quit', () => {
    allowDisplaySleep(appBlockerId)
})

app.on('window-all-closed', () => {
    app.quit()
})