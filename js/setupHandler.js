const {BrowserWindow, ipcMain} = require('electron')
const linuxCleanModule = require('./clean/linux.js') 
const sudo = require('sudo-prompt');
const linuxScanModule = require('./scan/linux.js') 

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

    ipcMain.handle('burn-file', (file) => {
        return burnFile()
    })

    ipcMain.handle('allow-file', (file) => {
        return allowFile()
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
}

async function isClamavInstalled() {
    if (process.platform == "linux") {
        await linuxScanModule.isInstallClamav()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function installClamav() {
    if (process.platform == "linux") {
        linuxScanModule.installClamav()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function runClamscan() {
    if (process.platform == "linux") {
        linuxScanModule.doScan()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function initProgressScan() {
    if (process.platform == "linux") {
        await linuxScanModule.initProgressScan()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function checkClamScanProgress() {
    if (process.platform == "linux") {
        result = await linuxScanModule.checkProgressScan()
        return result
    } else if (process.platform == "darwin") {

    } else {

    }
}

function getQtyOfQuarantineFile() {
    if (process.platform == "linux") {
        return linuxScanModule.getQtyOfQuarantineFile()
    } else if (process.platform == "darwin") {

    } else {

    }
}

function getQtyOfInfectedFile() {
    if (process.platform == "linux") {
        return linuxScanModule.getQtyOfInfectedFile()
    } else if (process.platform == "darwin") {

    } else {

    }
}

function getAllQuarantineFiles() {
    if (process.platform == "linux") {
        return linuxScanModule.getAllQuarantineFiles()
    } else if (process.platform == "darwin") {

    } else {

    }
}

function burnFile(file) {
    if (process.platform == "linux") {
        return linuxScanModule.burnFile(file)
    } else if (process.platform == "darwin") {

    } else {

    }
}

function allowFile(file) {
    if (process.platform == "linux") {
        return linuxScanModule.allowFile(file)
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function installBleachbit() {
    if (process.platform == "linux") {
        await linuxCleanModule.installBleachbit()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function initProgressClean() {
    if (process.platform == "linux") {
        await linuxCleanModule.initProgress()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function runBleachBit() {
    if (process.platform == "linux") {
        linuxCleanModule.doClean()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function checkCleanProgress() {
    if (process.platform == "linux") {
        await linuxCleanModule.checkProgressClean()
    } else if (process.platform == "darwin") {

    } else {

    }
}

async function isBleachbitInstalled() {
    if (process.platform == "linux") {
        await linuxCleanModule.isInstallBleachbit()
    } else if (process.platform == "darwin") {

    } else {
        
    }
}