const {app} = require('electron')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');
const { stdout } = require('process');

lstFileFromLSCmd = []
infectedFiles = []
lstScannedFile = []

isInScanned = false

module.exports = {}

module.exports.sayHelloScan = () => {
    console.log("Hello")
}

module.exports.isInstallClamav = () => {
    homePath = app.getPath('home');
    const {stdout, stderr} = exec('ls ' + homePath + '/clamav/bin/')
    return !stdout.includes('No such file');
}

module.exports.installClamav = async () => {
  homePath = app.getPath('home');
  await exec('curl -L -o ' + homePath + '/clamav.zip "https://www.dropbox.com/s/dr11h91rykvicae/clamav.zip?dl=0"')
  await exec('unzip ' + homePath + '/clamav.zip -d ' + homePath)
  await exec('rm ' + homePath + '/clamav.zip -d ')
}

module.exports.initProgressScan = () => {
  homePath = app.getPath('home');
  const {stdout, stderr} = exec('ls -a ' + homePath)
  filesArray = stdout.split(/[\n\r]/g)
  lstFileFromLSCmd = []
  lstScannedFile = []
  infectedFiles = []
  filesArray.forEach(element => {
      if (element != '.' && element != '..') {
        lstFileFromLSCmd.push(element)
      }
  }); 
}

module.exports.doScan = async () => {
  homePath = app.getPath('home');
  for (var i = 0; i < lstFileFromLSCmd.length; ++i) {
    var element = lstFileFromLSCmd[i]
    try {
      console.log(element)
      const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/' + element)
      // const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/clamav')
      console.log(stdout)
      if (stdout.includes('FOUND')) {
        /* 
        1. Convert path of file to the folder_name by change "/" to "_" and create it in ""
        2. Move infected file from its location to new folder
        3. push element's name to list
        */
        infectedFiles.push(element)
      }
      lstScannedFile.push(element)
    } catch {
      console.log("Cannot clean: " + homePath + '/' + element)
    }
  }
}

module.exports.checkProgressScan = () => {
  ratio = lstScannedFile.length / lstFileFromLSCmd.length 
  return ratio
}

module.exports.getQtyOfQuarantineFile = () => {
  // TODO implement this function
  return 0
}

module.exports.getQtyOfInfectedFile = () => {
  // TODO implement this function
  return 0
}

module.exports.getAllQuarantineFiles = () => {
  // TODO implement this function
  return 0
}

module.exports.burnFile = (file) => {
  // TODO implement this function
  return true
}

module.exports.allowFile = (file) => {
  // TODO implement this function
  return true
}