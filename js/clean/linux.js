const {app} = require('electron')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');
const spawn = util.promisify(require('child_process').spawn);
const {execSync} = require('child_process');

lstFileFromBleachbit = []
lstFileProcessed = []

process.on('message', (msg) => {
    console.log('Message from parent: aaa');
});

module.exports = {}

module.exports.sayHelloClean = () => {
    console.log("Hello")
}

module.exports.isInstallBleachbit = async () => {
    homePath = app.getPath('home');
    const {stdout, stderr} = await exec('ls ' + homePath + '/bleachbit-master')
    return !stdout.includes('No such')
}

module.exports.installBleachbit = async () => {
    homePath = app.getPath('home');
    const fileZip = homePath + '/bleachbit.zip';
    console.log(fileZip)
    homePath = app.getPath('home');
    await exec('curl https://github.com/bleachbit/bleachbit/archive/refs/heads/master.zip -L -o ' + fileZip)
    await exec('unzip ' + fileZip + ' -d ' + homePath)
    await exec('rm ' + fileZip)
}

module.exports.initProgress = async () => {
    await initFiles()
}

module.exports.doClean = async () => {
    cleanFiles()
}

module.exports.checkProgressClean = () => {
    ratio = lstFileProcessed.length / lstFileFromBleachbit.length 
    return ratio
}

async function initFiles() {
    lstFileFromBleachbit = []
    lstFileProcessed = []
    homePath = app.getPath('home');
    const cmd = 'python3 ' + homePath + '/bleachbit-master/bleachbit.py --list --debug';
    const {stdout} = await exec(cmd)
    filesArray = stdout.split(/[\n\r]/g)
    filesArray.forEach(element => {
        if (element.split('.').length === 2) {
            lstFileFromBleachbit.push(element)
        }
    }); 
}  

async function cleanFiles() {
    homePath = app.getPath('home');
    lstFileFromBleachbit.forEach(async (element) => {
        await exec('python3 ' + homePath + '/bleachbit-master/bleachbit.py ' + element + ' --clean')
        lstFileProcessed.push(element)
    }); 
}  

async function returnCurrentPath() {
    const {stdout, stderr} = await exec('pwd')
    return stdout.replace(/[\n\r]/g, '')
}