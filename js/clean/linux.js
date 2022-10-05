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
    const {stdout, stderr} = await exec('ls')
    return stdout.includes('bleachbit-master')
}

module.exports.installBleachbit = async () => {
    // await exec('sudo curl https://github.com/bleachbit/bleachbit/archive/refs/heads/master.zip -L -o bleachbit.zip | unzip bleachbit.zip | rm bleachbit.zip')
    // await exec('unzip bleachbit.zip')
    // await exec('rm bleachbit.zip')
    var options = {
        name: 'ClaBit',
      };
    const currentPath = await returnCurrentPath();
    const fileZip = currentPath + '/bleachbit.zip';
    console.log(fileZip)
    await sudo.exec('curl https://github.com/bleachbit/bleachbit/archive/refs/heads/master.zip -L -o ' + fileZip + ' && unzip ' + fileZip + ' -d ' + currentPath + ' && rm ' + fileZip, options,
        function(error, stdout, stderr) {
          if (error) throw error;
            console.log('stdout: ' + stdout);
    });
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
    const currentPath = await returnCurrentPath();
    const cmd = 'python3 ' + currentPath + '/bleachbit-master/bleachbit.py --list --debug';
    console.log(cmd)
    const {stdout} = await exec(cmd)
    console.log(stdout)
    filesArray = stdout.split(/[\n\r]/g)
    filesArray.forEach(element => {
        if (element.split('.').length === 2) {
            lstFileFromBleachbit.push(element)
        }
    }); 
    console.log(lstFileFromBleachbit[0])
}  

async function cleanFiles() {
    lstFileFromBleachbit.forEach(async (element) => {
        await exec('python3 bleachbit-master/bleachbit.py ' + element + ' --clean')
        lstFileProcessed.push(element)
    }); 
}  

async function returnCurrentPath() {
    const {stdout, stderr} = await exec('pwd')
    return stdout.replace(/[\n\r]/g, '')
}