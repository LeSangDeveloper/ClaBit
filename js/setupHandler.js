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

    ipcMain.handle('do-scan', async () => {
        runClamscan();
    })

    ipcMain.handle('check-scan-progress', async () => {

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
    isClamavInstalledVar = await linuxScanModule.isInstallClamav(); 
    return isClamavInstalledVar;
}

async function installClamav() {
    linuxScanModule.installClamav()
}

async function runClamscan() {

}

async function checkClamScanProgress() {

}

async function installBleachbit() {
    await linuxCleanModule.installBleachbit()
}

async function initProgressClean() {
    // await exec('python3 bleachbit-master/bleachbit.py --list | xargs python3 bleachbit-master/bleachbit.py  --clean')
    await linuxCleanModule.initProgress()
}

async function runBleachBit() {
    // await exec('python3 bleachbit-master/bleachbit.py --list | xargs python3 bleachbit-master/bleachbit.py  --clean')
    linuxCleanModule.doClean()
}

async function checkCleanProgress() {
    return await linuxCleanModule.checkProgressClean()
}

async function isBleachbitInstalled() {
    return await linuxCleanModule.isInstallBleachbit()
}