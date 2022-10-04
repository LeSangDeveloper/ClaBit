console.log("render script")

document.querySelector('#buttonActive').addEventListener('click', () => {
    handleClickActivate();
})

document.querySelector("#linkOpenWindow").addEventListener('click', () => {
    openChildWindow();
})

async function openChildWindow() {
    numberOfWindows = await window.versions.checkOpenWindowNumber();
    console.log(numberOfWindows);
    if (numberOfWindows == 1) {
        window.open("./html/child_window.html", "_blank", "width=1200,height=800");
    }
}

async function handleClickActivate() {
    var responseClamavIsInstalled;
    try {
        responseClamavIsInstalled = await window.versions.isInstalledClamav()
    } catch (error) {
        responseClamavIsInstalled = false;
    }
    console.log(responseClamavIsInstalled);
    if (responseClamavIsInstalled === false) {
        // call ipc Main to download and install Clamav from Server
        // show loading while in progress
        const information = document.getElementById('loading')
        information.innerText = `INSTALLING.....`
        window.versions.installClamav();
        while (responseClamavIsInstalled === false) {
            try {
                responseClamavIsInstalled = await window.versions.isInstalledClamav()
                
            } catch (error) {
                responseClamavIsInstalled = false;
            }
        }
    }

    const responseIsInstalledBleachbit = await window.versions.isInstalledBleachbit();

    if (responseIsInstalledBleachbit === false) {
        // call ipc Main to download and install Bleachbit from Server
        // show loading while in progress
        window.versions.installBleachbit();
        while (responseIsInstalledBleachbit === false) {
            const information = document.getElementById('loading')
            information.innerText = `INSTALLING.....`
            try {
                responseIsInstalledBleachbit = await window.versions.isInstalledBleachbit()
                
            } catch (error) {
                responseIsInstalledBleachbit = false;
            }
        }
    }

    $(".activate-fragment").css("display", "none")
    $(".function-fragment").css("display", "block")
}
