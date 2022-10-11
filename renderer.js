var isHandlingClickActivate = false;
var isHandlingClickScan = false
var each6HoursScanJob;

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

document.querySelector('#isEach6HoursScan').addEventListener('click', () => {
    if ($('#isEach6HoursScan').prop('checked')) {
        start6HoursSchedule(true)
    } else {
        clearInterval(each6HoursScanJob)
    }
})

async function start6HoursSchedule(isEnableScheduler) {
    if (isEnableScheduler) {
        console.log("Start Schedule job")
        each6HoursScanJob = setInterval(() => {
        if (!isHandlingClickScan) {
            console.log("Running scheduling...")
            handleClickScan()
        }
        // TODO remove test seconds
    }, 180000)
    }
}

async function startWatcher(isEnableWatcher) {
    console.log("Start Realtime job")
    window.invoker.startScanRealtime()
}

async function openChildWindow() {
    numberOfWindows = await window.invoker.checkOpenWindowNumber();
    console.log(numberOfWindows);
    if (numberOfWindows == 1) {
        window.invoker.openChildWindow()
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

        while (responseClamavIsInstalled == false) {
            try {
                responseClamavIsInstalled = await window.invoker.isInstalledClamav()
            } catch (error) {
                responseClamavIsInstalled = false;
            }
            await sleep(1000)
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

        while (responseIsInstalledBleachbit == false) {
            try {
                responseIsInstalledBleachbit = await window.invoker.isInstalledBleachbit()
            } catch {
                responseIsInstalledBleachbit = false
            }
            await sleep(1000)
        }

        $(".activate-fragment").css("display", "none")
        $(".function-fragment").css("display", "block")
        isHandlingClickActivate = false;
        document.querySelector('#buttonActive').disabled = false
        start6HoursSchedule($('#isEach6HoursScan').prop('checked'))
        startWatcher($('#isRealTimeScan').prop('checked'))
    }
}


async function handleClickScan() {
    isHandlingClickScan = true
    $('#linkOpenWindow').css('display', 'none')
    document.querySelector('#buttonScan').disabled = true
    $('#scanProgressBar').css('width', '0%')
    qtyOfOldQuarantineFile = await window.invoker.getQtyOfQuanrantineFile() 
    await window.invoker.initProgressScan()
    window.invoker.doScan();
    var percent = await window.invoker.checkScanProgress()
    console.log(percent)
    console.log(percent < 0.95)
    console.log(0 < 0.95)
    while (percent < 0.95) {
        $("#scanProgressBar").css('width', percent * 100 + '%')
        percent = await window.invoker.checkScanProgress()
        await sleep(1000);
    }
    qtyOfInfectedFiles = await window.invoker.getQtyOfInfectedFile()
    qtyOfQuarantineFile = await window.invoker.getQtyOfQuanrantineFile() 
    //TODO validate infected and quarantine
    document.getElementById('linkOpenWindow').innerText = `Quarantine file New (${qtyOfInfectedFiles}) Total (${qtyOfQuarantineFile})`
    $('#linkOpenWindow').css('display', 'block')
    $("#scanProgressBar").css('width', '100%') 
    document.querySelector('#buttonScan').disabled = false
    isHandlingClickScan = false
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
    // const month = date.toLocaleString('default', { month: '2-digit' })
    const year = date.toLocaleString('default', { year: 'numeric' })
    return day + ' ' + month + ' ' + year;
}