/** Script that exposes selected properties of Electron to the Renderer proces */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    /**
     * Resolves electron resources folder path
     * @returns Returns electron video sources path
     */
    getVideoSourcesPath: () => ipcRenderer.invoke('get-video-sources-path'),
})