/** Script that exposes selected properties of Electron to the Renderer proces */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    /**
     * Toggles fullscreen mode
     * @param flag Boolean indicating whether to go fullscreen
     */
    setFullScreenAs: (flag) => ipcRenderer.send('set-fullscreen-as', flag),
    /**
     * Makes the app to keep the screen always on
     * @returns Promise\<number> with the blocker ID. Save it to turn off this function
     */
    preventDisplaySleep: () => ipcRenderer.invoke('prevent-display-sleep'),
    /**
     * Makes the app restore the screen power configuration
     * @param blockerId Number with the blocker ID previously assigned
     * @returns Promise\<boolean> with whether the specified powerSaveBlocker has been stopped
     */
    allowDisplaySleep: (blockerId) => ipcRenderer.invoke('allow-display-sleep', blockerId),
})