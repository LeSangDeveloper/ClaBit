const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    isInstalledClamav: () => ipcRenderer.invoke('is-installed-clamav'),
    installClamav: () => ipcRenderer.invoke('install-clamav'),
    isInstalledBleachbit: () => ipcRenderer.invoke('is-installed-bleachbit'),
    installBleachbit: () => ipcRenderer.invoke('install-bleachbit'),
    checkOpenWindowNumber: () => ipcRenderer.invoke('check-open-window-number')
})