var isHandlingClickActivate = false;

document.querySelector('#buttonActive').addEventListener('click', () => {
    handleClickActivate()
})

document.querySelector('#buttonClean').addEventListener('click', () => {
    handleClickClean()
})

document.querySelector('#buttonScan').addEventListener('click', () => {
    handleClickScan()
})

document.querySelector("#linkOpenWindow").addEventListener('click', () => {
    openChildWindow()
})

async function openChildWindow() {
    numberOfWindows = await window.invoker.checkOpenWindowNumber();
    console.log(numberOfWindows);
    if (numberOfWindows == 1) {
        window.open("./html/child_window.html", "_blank", "width=1200,height=800");
    }
}

async function handleClickActivate() {
    if (!isHandlingClickActivate) {
        document.querySelector('#buttonActive').disabled = true
        isHandlingClickActivate = true;
        var responseClamavIsInstalled;
        try {
            responseClamavIsInstalled = await window.invoker.isInstalledClamav()
        } catch (error) {
            responseClamavIsInstalled = false;
        }

        if (responseClamavIsInstalled === false) {
            const information = document.getElementById('loading')
            information.innerText = `INSTALLING.....`
            await window.invoker.installClamav();
        }

        var responseIsInstalledBleachbit
        try {
            responseIsInstalledBleachbit = await window.invoker.isInstalledBleachbit()
        } catch {
            responseIsInstalledBleachbit = false
        }

        if (responseIsInstalledBleachbit === false) {
            const information2 = document.getElementById('loading')
            information2.innerText = `INSTALLING.....`
            await window.invoker.installBleachbit();
        }

        $(".activate-fragment").css("display", "none")
        $(".function-fragment").css("display", "block")
        isHandlingClickActivate = false;
        document.querySelector('#buttonActive').disabled = false
    }
}


async function handleClickScan() {
    document.querySelector('#buttonScan').disabled = true
    $('#scanProgressBar').css('width', '0%')
    await window.invoker.initProgressScan()
    window.invoker.doScan();
    var percent = await window.invoker.checkScanProgress()
    console.log(percent)
    console.log(percent < 0.95)
    console.log(0 < 0.95)
    // TODO get number of infected file
    while (percent < 0.95) {
        $("#scanProgressBar").css('width', percent * 100 + '%')
        percent = await window.invoker.checkScanProgress()
        await sleep(1000);
    }
    /* TODO render UI for user click to interact to infected file 
    1. get number of new infected file (1)
    2. get number of old infected file (2)
    3. validate number in step 1 and step 2
    4. show number in step 1 and step 2
    */
    $('#linkOpenWindow').css('display', 'block')
    $("#scanProgressBar").css('width', '100%') 
    document.querySelector('#buttonScan').disabled = false
}

async function handleClickClean() {
    document.querySelector('#buttonClean').disabled = true
    $("#cleanProgressBar").css('width', '0%')
    await window.invoker.initProgressClean()
    window.invoker.doClean();
    var percent = await window.invoker.checkCleanProgress();
    while (percent < 0.95) {
        $("#cleanProgressBar").css('width', percent * 100 + '%')
        percent = await window.invoker.checkCleanProgress()
        await sleep(1000);
    }
    console.log(getCurrentDate())
    document.getElementById('lastCleanDate').innerText = `Last clean date: ${getCurrentDate()}`
    $('#lastCleanDate').css('display', 'block')
    $("#cleanProgressBar").css('width', '100%')
    document.querySelector('#buttonClean').disabled = false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
 }

function getCurrentDate() {
    let date = new Date();
    const day = date.toLocaleString('default', { day: '2-digit' })
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.toLocaleString('default', { year: 'numeric' })
    return day + ' ' + month + ' ' + year;
}