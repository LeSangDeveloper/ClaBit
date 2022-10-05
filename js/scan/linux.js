const util = require("util");
const exec = util.promisify(require('child_process').exec);
const sudo = require('sudo-prompt');

module.exports = {}

module.exports.sayHelloScan = () => {
    console.log("Hello")
}

module.exports.isInstallClamav = async () => {
    const {stdout, stderr} = await exec('which clamscan')
    return stdout.includes('clamscan');
}

module.exports.installClamav = () => {
  console.log("installclamav")
  var options = {
      name: 'ClaBit',
    };
    sudo.exec('apt-get install clamav -y', options,
      function(error, stdout, stderr) {
        if (error) throw error;
          console.log('stdout: ' + stdout);
    });
}

module.exports.doScan = async () => {

}

module.exports.checkProgressScanLinux = async () => {

}