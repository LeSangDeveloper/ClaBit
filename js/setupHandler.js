const {BrowserWindow, ipcMain} = require('electron')
const linuxCleanModule = require('./clean/linux.js') 
const darwinCleanModule = require('./clean/darwin.js')
const windowCleanModule = require('./clean/win32.js') 
const {app} = require('electron')
const linuxScanModule = require('./scan/linux.js') 
const darwinScanModule = require('./scan/darwin.js')
const windowScanModule = require('./scan/win32.js')
const path = require('path')
const chokidar = require('chokidar')
// var watch = require('recursive-watch')
var fs = require('fs')

var fileWatcher = null;

module.exports = {} = {}
module.exports.setupScanHandler = () => {
    console.log(process.platform)
    ipcMain.handle('is-installed-clamav', async () => {
        isClamavInstalledVar = await isClamavInstalled(); 
        return isClamavInstalledVar;
    })

    ipcMain.handle('install-clamav', async () => {
        installClamav();
    })

    ipcMain.handle('init-progress-scan', async () => {
        await initProgressScan();
    })

    ipcMain.handle('do-scan', async () => {
        runClamscan();
    })

    ipcMain.handle('check-scan-progress', async () => {
        return await checkClamScanProgress()
    })

    ipcMain.handle('get-qty-quarantine-file', () => {
        return getQtyOfQuarantineFile()
    })

    ipcMain.handle('get-qty-infected-file', () => {
        return getQtyOfInfectedFile()
    })

    ipcMain.handle('get-all-quarantine-files', () => {
        return getAllQuarantineFiles()
    })

    ipcMain.handle('burn-file', (event, ...args) => {
        console.log(args)
        return burnFile(args[0])
    })

    ipcMain.handle('allow-file', (event, ...args) => {
        console.log(args)
        return allowFile(args[0], args[1])
    })
}

module.exports.setupCleanHandler = () => {
    ipcMain.handle('is-installed-bleachbit', async () => {
        isBleachbitInstalledVar = await isBleachbitInstalled(); 
        return isBleachbitInstalledVar;
    })

    ipcMain.handle('install-bleachbit', async () => {
        installBleachbit();
    })

    ipcMain.handle('init-progress-clean', async () => {
        await initProgressClean();
    })

    ipcMain.handle('do-clean', async () => {
        runBleachBit();
    })

    ipcMain.handle('check-clean-progress', () => {
        return checkCleanProgress();
    })
}

module.exports.setupCommonHandler = () => {
    ipcMain.handle('check-open-window-number', async () => {
        return BrowserWindow.getAllWindows().length;
    })

    ipcMain.handle('open-child-window', async () => {
        const win = new BrowserWindow({
            width: 1230,
            height: 600,
            minWidth: 1024,
            minHeight: 565,
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    
        win.loadFile('./html/child_window.html')
    })

    ipcMain.handle('start-scan-realtime', async () => {
        const fileWatcher = chokidar.watch(app.getPath('home'), {
            ignored: /(^|[/\\])\../,
            persistent: true,
            depth: 0,
           })
        
           fileWatcher.on('add', (path) => {
                runClamscanWithFileName(path)
           })
    })

    ipcMain.handle('stop-scan-realtime', async () => {
        if (fileWatcher != null) {
            fileWatcher.close().then(() => console.log('closed'));
        }
    })
}

async function isClamavInstalled() {
    if (process.platform == "linux") {
        await linuxScanModule.isInstallClamav()
    } else if (process.platform == "darwin") {
        result = await darwinScanModule.isInstallClamav()
        return result
    } else {
        result = await windowScanModule.isInstallClamav()
        return result
    }
}

async function installClamav() {
    if (process.platform == "linux") {
        linuxScanModule.installClamav()
    } else if (process.platform == "darwin") {
        darwinScanModule.installClamav()
    } else {
        windowScanModule.installClamav()
    }
}

async function runClamscanWithFileName(fileName) {
    if (process.platform == "linux") {
        linuxScanModule.doScanWithFileName(fileName)
    } else if (process.platform == "darwin") {
        darwinScanModule.doScanWithFileName(fileName)
    } else {
        windowScanModule.doScanWithFileName(fileName)
    }
}

async function runClamscan() {
    if (process.platform == "linux") {
        linuxScanModule.doScan()
    } else if (process.platform == "darwin") {
        darwinScanModule.doScan()
    } else {
        windowScanModule.doScan()
    }
}

async function initProgressScan() {
    if (process.platform == "linux") {
        await linuxScanModule.initProgressScan()
    } else if (process.platform == "darwin") {
        await darwinScanModule.initProgressScan()
    } else {
        await windowScanModule.initProgressScan()
    }
}

async function checkClamScanProgress() {
    if (process.platform == "linux") {
        result = await linuxScanModule.checkProgressScan()
        return result
    } else if (process.platform == "darwin") {
        result = await darwinScanModule.checkProgressScan()
        return result
    } else {
        result = await windowScanModule.checkProgressScan()
        return result
    }
}

function getQtyOfQuarantineFile() {
    if (process.platform == "linux") {
        return linuxScanModule.getQtyOfQuarantineFile()
    } else if (process.platform == "darwin") {
        result = darwinScanModule.getQtyOfQuarantineFile()
        return result
    } else {
        result = windowScanModule.getQtyOfQuarantineFile()
        return result
    }
}

function getQtyOfInfectedFile() {
    if (process.platform == "linux") {
        return linuxScanModule.getQtyOfInfectedFile()
    } else if (process.platform == "darwin") {
        result = darwinScanModule.getQtyOfInfectedFile()
        return result
    } else {
        result = windowScanModule.getQtyOfInfectedFile()
    }
}

function getAllQuarantineFiles() {
    if (process.platform == "linux") {
        return linuxScanModule.getAllQuarantineFiles()
    } else if (process.platform == "darwin") {
        result = darwinScanModule.getAllQuarantineFiles()
        return result
    } else {
        result = windowScanModule.getAllQuarantineFiles()
    }
}

function burnFile(file) {
    if (process.platform == "linux") {
        return linuxScanModule.burnFile(file)
    } else if (process.platform == "darwin") {
        return darwinScanModule.burnFile(file)
    } else {
        return windowScanModule.burnFile(file)
    }
}

function allowFile(file, oldFullPath) {
    if (process.platform == "linux") {
        return linuxScanModule.allowFile(file, oldFullPath)
    } else if (process.platform == "darwin") {
        return linuxScanModule.allowFile(file, oldFullPath)
    } else {
        return windowScanModule.allowFile(file, oldFullPath)
    }
}

async function installBleachbit() {
    if (process.platform == "linux") {
        await linuxCleanModule.installBleachbit()
    } else if (process.platform == "darwin") {
        await darwinCleanModule.installBleachbit()
    } else {
        await windowCleanModule.installBleachbit()
    }
}

async function initProgressClean() {
    if (process.platform == "linux") {
        await linuxCleanModule.initProgress()
    } else if (process.platform == "darwin") {
        await darwinCleanModule.initProgress()
    } else {
        await windowCleanModule.initProgress()
    }
}

async function runBleachBit() {
    if (process.platform == "linux") {
        linuxCleanModule.doClean()
    } else if (process.platform == "darwin") {
        darwinCleanModule.doClean()
    } else {
        windowCleanModule.doClean()
    }
}

async function checkCleanProgress() {
    if (process.platform == "linux") {
        return await linuxCleanModule.checkProgressClean()
    } else if (process.platform == "darwin") {
        return await darwinCleanModule.checkProgressClean()
    } else {
        return await windowCleanModule.checkProgressClean()
    }
}

async function isBleachbitInstalled() {
    if (process.platform == "linux") {
        await linuxCleanModule.isInstallBleachbit()
    } else if (process.platform == "darwin") {
        result = await darwinCleanModule.isInstallBleachbit()
        return result
    } else {
        result = await windowCleanModule.isInstallBleachbit()
        return result
    }
}