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
  homePath = app.getPath('home')
  // TODO remove test
  const {stdout, stderr} = await exec('ls -a ' + homePath + "/test")
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
      // TODO remove test
      fullCmd = homePath + '/clamav/bin/clamscan ' + homePath  + "/test" + '/' + element
      try {
        var {stdout, stderr} = await exec(fullCmd) 
      } catch (e) {
        stdout = e.stdout
      } 
      console.log(stdout)
      handleResultScanFromStdout(stdout, element)
    } catch {
      console.log("Cannot scan: " + homePath + '/' + element)
    }
    lstScannedFile.push(element)
  }
}

module.exports.checkProgressScan = () => {
  ratio = lstScannedFile.length / lstFileFromLSCmd.length 
  return ratio
}

module.exports.getQtyOfQuarantineFile = async () => {
  const {stdout, stderr} = await exec('ls -lat ' + homePath + "/clamav/.quarantine")
  result = stdout.split(/[\n\r]/g)
  return result.length - 4
}

module.exports.getQtyOfInfectedFile = () => {
  return infectedFiles.length
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

async function handleResultScanFromStdout(stdout, fileName) {
  if (stdout.includes('FOUND')) {
    logArray = stdout.split(/[\n\r]/g)
    resultArray = getResultFromLog(logArray)
    fullPath = resultArray[0].replaceAll("/", "_").replaceAll(":", "").replaceAll(fileName, "")
    try {
      const fullCmd = 'mkdir ' + homePath + '/clamav/.quarantine/' + fullPath 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    try {
      const fullCmd = 'mkdir ' + homePath + '/clamav/.quarantine/' + fullPath + '/' + resultArray[1] 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    try {
      const fullCmd = 'mv ' + homePath + '/' + 'test/' + fileName + ' ' + homePath + '/clamav/.quarantine/' + fullPath + '/' + resultArray[1] 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    infectedFiles.push(fileName)
  }
}

function getResultFromLog(logArray) {
  for (var i = 0; i < logArray.length; ++i) {
    var element = logArray[i]
    if (element.includes("FOUND"))
      result = element.split(" ") 
      return result
  }
}