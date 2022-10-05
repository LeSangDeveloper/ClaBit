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
            window.invoker.installClamav();
            while (responseClamavIsInstalled === false) {
                try {
                    responseClamavIsInstalled = await window.invoker.isInstalledClamav()
                
                } catch (error) {
                    responseClamavIsInstalled = false;
                }
            }
        }

        var responseIsInstalledBleachbit = await window.invoker.isInstalledBleachbit();

        if (responseIsInstalledBleachbit === false) {
            window.invoker.installBleachbit();
            const information2 = document.getElementById('loading')
            information2.innerText = `INSTALLING.....`
            while (responseIsInstalledBleachbit === false) {
                try {
                    responseIsInstalledBleachbit = await window.invoker.isInstalledBleachbit()
                } catch (error) {
                    responseIsInstalledBleachbit = false;
                }
            }
        }

        $(".activate-fragment").css("display", "none")
        $(".function-fragment").css("display", "block")
        isHandlingClickActivate = false;
        document.querySelector('#buttonActive').disabled = false
    }
}


async function handleClickScan() {
    /* 
        1. call do-scan
        2. check progress
        3. while check progress show progress in progress bar
    */
}

async function handleClickClean() {
    /* 
        1. call do-clean
        2. check progress
        3. while check progress show progress in progress bar
    */
    $("#cleanProgressBar").css('width', '0%')
    document.querySelector('#buttonClean').disabled = true
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