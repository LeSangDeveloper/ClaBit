const util = require("util");
const exec = util.promisify(require('child_process').exec);

module.exports = {}

module.exports.sayHelloClean = () => {
    console.log("Hello")
}

module.exports.isInstallBleachbit = async () => {
    const {stdout, stderr} = await exec('ls')
    return stdout.includes('bleachbit-master')
}

module.exports.installBleachbit = async () => {
    await exec('curl https://github.com/bleachbit/bleachbit/archive/refs/heads/master.zip -L -o bleachbit.zip')
    await exec('unzip bleachbit.zip')
    await exec('rm bleachbit.zip')
}

module.exports.doClean = async () => {
    await exec('python3 bleachbit-master/bleachbit.py --list | xargs python3 bleachbit-master/bleachbit.py  --clean')
}

module.exports.checkProgressClean = async () => {

}