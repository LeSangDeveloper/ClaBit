const {app} = require('electron')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');
const { stdout } = require('process');
const fs = require('fs')

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
    const {stdout, stderr} = await exec('ls /usr/local/bin')
    return stdout.includes('clamscan');
}

module.exports.installClamav = async () => {
  await exec('curl -L -o ~/clamav.zip "https://www.dropbox.com/s/jbqb6lg834ymmal/clamav_MacOS.zip?dl=0"')
  await exec('unzip ~/clamav.zip -d ~/clamav')
  await exec('rm ~/clamav.zip ')
  await exec('cp ~/clamav/clamav_MacOS/bin/clamscan /usr/local/bin')
  await exec('cp ~/clamav/clamav_MacOS/lib/libclamav.9.dylib /usr/local/lib/')
  await exec('cp ~/clamav/clamav_MacOS/lib/libclammspack.0.dylib /usr/local/lib')
  await exec('cp -r ~/clamav/clamav_MacOS/share/clamav /usr/local/share')
  await exec('rm -rf ~/clamav')
  try {
    await exec('mkdir ~/clamav')
  } catch  {

  }
  try {
    await exec('mkdir ~/clamav/.quarantine')
  } catch {

  }
  try {
    await exec('touch ~/clamav/quarantine_file.log')
  } catch {

  }
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
      fullCmd = '/usr/local/bin/clamscan ' + homePath  + "/test" + '/' + element
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

module.exports.doScanWithFileName = async (fileName) => {
  fullCmd = homePath + '/usr/local/bin/clamscan ' + fileName
  try {
    var {stdout, stderr} = await exec(fullCmd) 
  } catch (e) {
    stdout = e.stdout
  } 
  console.log(stdout)
}

module.exports.checkProgressScan = () => {
  ratio = lstScannedFile.length / lstFileFromLSCmd.length 
  return ratio
}

module.exports.getQtyOfQuarantineFile = async () => {
  var data = fs.readFileSync(app.getPath('home') + '/clamav/quarantine_file.log', 'utf8')
  var dataSplit = data.split(/[\n\r]/g)
  var count = 0
  for (i = 0; i < dataSplit.length; ++i) {
    if (dataSplit[i].length > 1) count++
  }
  return count
}

module.exports.getQtyOfInfectedFile = () => {
  return infectedFiles.length
}

module.exports.getAllQuarantineFiles = () => {
  var data = fs.readFileSync(app.getPath('home') + '/clamav/quarantine_file.log', 'utf8')
  var dataSplit = data.split(/[\n\r]/g)
  var result = []
  for (i = 0; i < dataSplit.length; ++i) {
    if (dataSplit[i].length > 1) result.push(dataSplit[i])
  }
  return result
}

module.exports.burnFile = async (file) => {
  await exec('rm ' + file)
  console.log(file)
  removeLineFromLog(file)
  return true
}

module.exports.allowFile = async (file, oldFullPath) => {
  await exec('mv ' + file + ' ' + oldFullPath)
  removeLineFromLog(file)
  console.log(file + " " + oldFullPath)
  return true
}

async function removeLineFromLog(file) {
  var data = fs.readFileSync(app.getPath('home') + '/clamav/quarantine_file.log', 'utf8')
  var dataSplit = data.split(/[\n\r]/g)
  var idx = -1
  for (i = 0; i < dataSplit.length; ++i) {
    if (dataSplit[i].includes(file)) idx = i
  }
  dataSplit.splice(idx, 1)
  await fs.writeFile(homePath + '/clamav/quarantine_file.log', dataSplit.join('\n'), function (err) {
    if (err) throw err;
  })
}

async function handleResultScanFromStdout(stdout, fileName) {
  if (stdout.includes('FOUND')) {
    logArray = stdout.split(/[\n\r]/g)
    resultArray = getResultFromLog(logArray)
    fullPath = resultArray[0].replaceAll("/", "_").replaceAll(":", "")
    date = getCurrentDate()
    try {
      const fullCmd = 'mkdir ' + homePath + '/clamav/.quarantine/' + date
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    try {
      const fullCmd = 'mkdir ' + homePath + '/clamav/.quarantine/' + date + '/' + fullPath 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    try {
      const fullCmd = 'mkdir ' + homePath + '/clamav/.quarantine/' + date + '/' + fullPath + '/' + resultArray[1] 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }
    try {
      const fullCmd = 'mv ' + homePath + '/' + 'test/' + fileName + ' ' + homePath + '/clamav/.quarantine/' + date + "/" + fullPath + '/' + resultArray[1] 
      await exec(fullCmd)
    } catch (e) {
      console.log(e.stdout)
    }

    quarantineFileFullPath = homePath + '/clamav/.quarantine/' + date + "/" + fullPath + '/' + resultArray[1] + "/" + fileName
    isExits  = await checkFileExists(homePath + '/clamav/quarantine_file.log')
    
    if (!isExits) {
      await fs.writeFile(homePath + '/clamav/quarantine_file.log', quarantineFileFullPath + ' ' + resultArray[0].replaceAll(':', '') + ' ' + date.replaceAll('_', '/') + '\n', function (err) {
        if (err) throw err;
      })
    } else {
      await fs.appendFile(homePath + '/clamav/quarantine_file.log', quarantineFileFullPath + ' ' + resultArray[0].replaceAll(':', '') + ' ' + date.replaceAll('_', '/') + '\n', function (err) {
        if (err) throw err;
      })
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

function getCurrentDate() {
  let date = new Date();
  const day = date.toLocaleString('default', { day: '2-digit' })
  const month = date.toLocaleString('default', { month: '2-digit' })
  const year = date.toLocaleString('default', { year: 'numeric' })
  return day + '_' + month + '_' + year;
}

function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
           .then(() => true)
           .catch(() => false)
}