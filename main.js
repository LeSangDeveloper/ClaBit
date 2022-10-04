const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);
const { fork } = require('child_process');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.handle('check-env', async (event, title) => {
        isClamavInstalled = await isClamavInstalled(); 
        return isClamavInstalled;
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    console.log(process.platform)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) 
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

async function isClamavInstalled() {
    const {stdout, stderr} = await exec('ls')
    return stdout.includes('clamav')
}