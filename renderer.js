console.log("render script")
document.querySelector('#buttonActive').addEventListener('click', () => {
    /* 
    1. Check if clamav and/or clamav is installed or not
    2. If not installed, download from remote server on the user's system and install automatically
    3. Hide Activate fragment and show the Function fragment. 
    */
    [1, 2, 3].forEach(async () => {
        await func1();
    });
    console.log("Clicked!");
    $(".activate-fragment").css("display", "none")
    $(".function-fragment").css("display", "block")
})

const func1 = async () => {
    const response = await window.versions.checkEnv()
    console.log(response)
}

async function checkEnv() {
    const response = await window.versions.checkEnv()
    console.log(response);
    return response;
}
