const {app} = require('electron')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');
const { stdout } = require('process');

lstFileFromLSCmd = []
infectedFiles = []
lstScannedFile = []

module.exports = {}

module.exports.sayHelloScan = () => {
    console.log("Hello")
}

module.exports.isInstallClamav = async () => {
    homePath = app.getPath('home');
    const {stdout, stderr} = await exec('ls ' + homePath + '/clamav/bin/')
    return !stdout.includes('No such file');
}

module.exports.installClamav = async () => {
  homePath = app.getPath('home');
  await exec('curl -L -o ' + homePath + '/clamav.zip "https://www.dropbox.com/s/dr11h91rykvicae/clamav.zip?dl=0"')
  await exec('unzip ' + homePath + '/clamav.zip -d ' + homePath)
  await exec('rm ' + homePath + '/clamav.zip -d ')
}

module.exports.initProgressScan = async () => {
  homePath = app.getPath('home');
  const {stdout, stderr} = await exec('ls -a ' + homePath)
  console.log(stdout)
  filesArray = stdout.split(/[\n\r]/g)
  lstFileFromLSCmd = []
  lstScannedFile = []
  infectedFiles = []
  filesArray.forEach(element => {
      if (element != '.' && element != '..') {
        lstFileFromLSCmd.push(element)
      }
  }); 
  console.log(lstFileFromLSCmd[0])
}

module.exports.doScan = async () => {
  console.log('scan')
  homePath = app.getPath('home');
  lstFileFromLSCmd.forEach(async (element) => {
      await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/' + element)
      // check infected file
      if (false) {
        infectedFiles.push(element)
      }
      lstScannedFile.push(element)
  }); 
}

module.exports.checkProgressScan = async () => {
  ratio = lstScannedFile.length / lstFileFromLSCmd.length 
  return ratio
}