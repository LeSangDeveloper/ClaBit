var isHandlingClickActivate = false;
console.log("render script")

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
        console.log(responseClamavIsInstalled);
        if (responseClamavIsInstalled === false) {
            const information = document.getElementById('loading')
            information.innerText = `INSTALLING.....`
            window.versions.installClamav();
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
            window.versions.installBleachbit();
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
   window.versions
}

async function handleClickClean() {
    /* 
        1. call do-clean
        2. check progress
        3. while check progress show progress in progress bar
    */
}