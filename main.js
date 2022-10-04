const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);
const { fork } = require('child_process');
const sudo = require('sudo-prompt');

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

    ipcMain.handle('is-installed-clamav', async () => {
        isClamavInstalledVar = await isClamavInstalled(); 
        return isClamavInstalledVar;
    })

    ipcMain.handle('install-clamav', async () => {
        installClamav();
    })

    ipcMain.handle('is-installed-bleachbit', async () => {
        isBleachbitInstalledVar = await isBleachbitInstalled(); 
        return isBleachbitInstalledVar;
    })

    ipcMain.handle('install-bleachbit', async () => {
        installBleachbit();
    })

    ipcMain.handle('check-open-window-number', async () => {
        return BrowserWindow.getAllWindows().length;
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) 
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

async function isClamavInstalled() {
    const {stdout, stderr} = await exec('which clamscan')
    return stdout.includes('clamscan');
}

async function installClamav() {
    var options = {
      name: 'ClaBit',
    };
    sudo.exec('apt-get install clamav -y', options,
      function(error, stdout, stderr) {
        if (error) throw error;
        console.log('stdout: ' + stdout);
      }
    );
}

async function installBleachbit() {
    await exec('curl https://github.com/bleachbit/bleachbit/archive/refs/heads/master.zip -L -o bleachbit.zip')
    await exec('unzip bleachbit.zip')
    await exec('rm bleachbit.zip')
}

async function runBleachBit() {
    await exec('python3 bleachbit-master/bleachbit.py --list | xargs python3 bleachbit-master/bleachbit.py  --clean')
}

async function isBleachbitInstalled() {
    const {stdout, stderr} = await exec('ls')
    return stdout.includes('bleachbit-master')
    // if (process.platform == "win32") {

    // } else {
        
    // }
    // return true;
}

