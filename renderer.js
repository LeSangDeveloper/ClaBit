var isHandlingClickActivate = false;

document.querySelector('#buttonActive').addEventListener('click', () => {
    handleClickActivate();
})

document.querySelector('#buttonClean').addEventListener('click', () => {
    handleClickClean();
})

document.querySelector('#buttonScan').addEventListener('click', () => {
    handleClickScan();
})

document.querySelector("#linkOpenWindow").addEventListener('click', () => {
    openChildWindow();
})

async function openChildWindow() {
    numberOfWindows = await window.invoker.checkOpenWindowNumber();
    console.log(numberOfWindows);
    if (numberOfWindows == 1) {
        window.open("./html/child_window.html", "_blank", "width=1200,height=800");
    }
}

async function handleClickActivate() {
    // TODO: improve later
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
        console.log(responseIsInstalledBleachbit)
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
    var percent = await window.invoker.checkScanProgress();
    while (percent < 0.95) {
        $("#scanProgressBar").css('width', percent * 100 + '%')
        percent = await window.invoker.checkScanProgress();
        await sleep(1000);
    }
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
        percent = await window.invoker.checkCleanProgress();
        await sleep(1000);
    }
    $("#cleanProgressBar").css('width', '100%')
    document.querySelector('#buttonClean').disabled = false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }