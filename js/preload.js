const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    
    isInstalledClamav: () => ipcRenderer.invoke('is-installed-clamav'),
    installClamav: () => ipcRenderer.invoke('install-clamav'),
    checkScanProgress: () => ipcRenderer.invoke('check-scan-progress'),
    doScan: () => ipcRenderer.invoke('do-scan'),

    isInstalledBleachbit: () => ipcRenderer.invoke('is-installed-bleachbit'),
    installBleachbit: () => ipcRenderer.invoke('install-bleachbit'),
    checkCleanProgress: () => ipcRenderer.invoke('check-clean-progress'),
    doClean: () => ipcRenderer.invoke('do-clean'),

    checkOpenWindowNumber: () => ipcRenderer.invoke('check-open-window-number'),
})