setUpChildWindow()

async function setUpChildWindow() {
    lstQuarantineFiles = await window.invoker.getAllQuarantineFiles()
    innerTextResult = "<div class='row' style='color: #d349d3'><div class='col'>File name</div><div class='col'>Reason</div><div class='col'>Date</div><div class='col-4'>Action</div></div>";
    for (i = 0; i < lstQuarantineFiles.length; ++i) {
        element = lstQuarantineFiles[i]
        console.log(element)
        console.log(element.split(" ")[0])
        fullPathFile = element.split(" ")[0].split("/") 
        fileName = fullPathFile[fullPathFile.length - 1]
        reason = fullPathFile[fullPathFile.length - 2]
        date = element.split(" ")[2]
        innerTextResult += `<div class='row'>`
        + `<div class="col">${fileName}</div>`
        + `<div class='col'>${reason}</div>`
        + `<div class='col'>${date}</div>`
        + "<div class='col-4'>"
        + `<button id='buttonScan' onClick='removeFile("${element.split(" ")[0]}")' class='btn-3d btn-white w-30 center-block'>Burn from system</button> or <a onClick='allowFile("${element.split(" ")[0]}", "${element.split(" ")[1]}")' style='text-decoration: underline; color: #00f' id='resultScan'>allow on system</a>`
        + "</div>"
        + "</div>" 
    }
    document.getElementById('contentChildWindow').innerHTML = innerTextResult
}

async function removeFile(fileFullPath) {
    await window.invoker.burnFile(fileFullPath)
}

async function allowFile(fileFullPath, oldFullPath) {
    await window.invoker.allowFile(fileFullPath, oldFullPath)
}