const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);
const { fork } = require('child_process');
const sudo = require('sudo-prompt');
const linuxCleanModule = require('./js/clean/linux.js') 
const linuxScanModule = require('./js/scan/linux.js') 

app.whenReady().then(() => {
    createWindow()

    setupScanHandler();
    setupCleanHandler();
    
    ipcMain.handle('check-open-window-number', async () => {
        return BrowserWindow.getAllWindows().length;
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) 
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1230,
        height: 600,
        minWidth: 1024,
        minHeight: 565,
        webPreferences: {
            preload: path.join(__dirname, './js/preload.js')
        }
    })

    win.loadFile('index.html')
}

function setupScanHandler() {
    ipcMain.handle('is-installed-clamav', async () => {
        isClamavInstalledVar = await isClamavInstalled(); 
        return isClamavInstalledVar;
    })

    ipcMain.handle('install-clamav', async () => {
        installClamav();
    })

    ipcMain.handle('do-scan', async () => {
        
    })

    ipcMain.handle('check-scan-progress', async () => {

    })
}

function setupCleanHandler() {
    ipcMain.handle('is-installed-bleachbit', async () => {
        isBleachbitInstalledVar = await isBleachbitInstalled(); 
        return isBleachbitInstalledVar;
    })

    ipcMain.handle('install-bleachbit', async () => {
        installBleachbit();
    })

    ipcMain.handle('do-clean', async () => {

    })

    ipcMain.handle('check-clean-progress', async => {

    })
}

async function isClamavInstalled() {
    isClamavInstalledVar = linuxScanModule.isInstallClamav(); 
    return isClamavInstalledVar;
}

async function installClamav() {
    linuxScanModule.installClamav()
}

async function installBleachbit() {
    await linuxCleanModule.installBleachbit()
}

async function runBleachBit() {
    await exec('python3 bleachbit-master/bleachbit.py --list | xargs python3 bleachbit-master/bleachbit.py  --clean')
}

async function isBleachbitInstalled() {
    return await linuxCleanModule.isInstallBleachbit()
}

