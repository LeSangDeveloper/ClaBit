const {app} = require('electron')
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');

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

module.exports.doScan = async () => {

}

module.exports.checkProgressScanLinux = async () => {

}