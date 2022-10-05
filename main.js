const {app, BrowserWindow} = require('electron')
const path = require('path')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);
const { fork } = require('child_process');
const sudo = require('sudo-prompt');
const setupHandlerModule = require('./js/setupHandler.js')

app.whenReady().then(() => {
    createWindow()

    setupHandlerModule.setupCleanHandler();
    setupHandlerModule.setupScanHandler();
    setupHandlerModule.setupCommonHandler();

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

