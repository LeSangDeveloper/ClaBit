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
  // lstFileFromLSCmd.forEach(async (element) => {
  //   try {
  //     console.log(element)
  //     // const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/' + element)
  //     const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/clamav')
  //     console.log(stdout)
  //     // TODO check infected file
  //     if (false) {
  //       infectedFiles(element)
  //     }
  //     lstScannedFile.push(element)
  //   } catch {
  //     console.log("Cannot clean: " + homePath + '/' + element)
  //   }
  // });
  for (var i = 0; i < lstFileFromLSCmd.length; ++i) {
    var element = lstFileFromLSCmd[i]
    try {
      console.log(element)
      const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/' + element)
      // const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/clamav')
      console.log(stdout)
      // TODO check infected file
      if (false) {
        infectedFiles(element)
      }
      lstScannedFile.push(element)
    } catch {
      console.log("Cannot clean: " + homePath + '/' + element)
    }
  }
  // const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/' + element)
  // const {stdout} = await exec(homePath + '/clamav/bin/clamscan ' + homePath + '/clamav')
  // console.log(stdout)
  // // TODO check infected file
  // if (false) {
  //   infectedFiles(element)
  // }
  // console.log("DONE!!!");
}

module.exports.checkProgressScan = async () => {
  ratio = lstScannedFile.length / lstFileFromLSCmd.length 
  return ratio
}