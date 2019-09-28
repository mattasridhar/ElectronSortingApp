const electron = require('electron');
const { ipcRenderer } = electron;//For sending values from this js page to the main.js page


let sortAlgo = "";
const ul = document.querySelector('ul');//get the ul from the startUpWindow.html
const dataBarsArea = document.getElementById("dataBars");
const errorArea = document.getElementById("errorArea");


// For handling Dark Themes
let html = document.documentElement

document.addEventListener('click', (e) => {
    let { target } = e
    let newTheme = target.getAttribute('data-set-theme')

    if (newTheme) {
        html.setAttribute('data-theme', newTheme)
        localStorage.theme = newTheme
    }
});

// Receive the items that are sent by the main.js which it received from inputsHandler.js
ipcRenderer.on("sortAlgo", function (e, algo) {
    console.log("srtDisp sortAlgo: " + algo)
    sortAlgo = algo;
});

// Receive the Algorithm that are selectd by the main.js
ipcRenderer.on("inputs", function (e, inputs) {
    const li = document.createElement('li');
    const input = document.createTextNode(inputs);
    li.appendChild(input);
    ul.appendChild(li);
    processInputs(inputs);
});

// Clear the items by receiving the 'clearContents' signal sent by the main.js
ipcRenderer.on("clearContents", function () {
    ul.innerHTML = "";//clearing the list that was populated earlier
});

//clear the particular selection of input
ul.addEventListener('dblclick', function (e) {
    e.target.remove();
});

//process the received Input values
processInputs = function (inputs) {
    let inputArr = inputs.split(',');
    let isValid = true;

    inputArr.some(inp => {
        console.log("Msg: " + inp + " parseInt: " + parseInt(inp) + " cond: " + (Number.isNaN(parseInt(inp))));
        if (Number.isNaN(parseInt(inp))) {
            isValid = false;
        }
    });

    if (!isValid || Number.isNaN(parseInt(inputs))) {
        showErrorMessage(true);
    } else {
        showErrorMessage(false);
        move(parseInt(inputs));
    }
}

applyAgorithm = function(){}

showErrorMessage = function (showError) {
    const errorText = document.createElement('h2');
    const errorMessage = document.createTextNode('In-correct Input. Please provide Inputs again');
    if (showError) {
        errorText.appendChild(errorMessage);
        errorArea.appendChild(errorText);
    } else {
        errorArea.innerHTML = "";
    }
}

function move(width) {
    console.log("SRI width: " + width);
    var inputBar = document.createElement("div");
    var blankBar = document.createElement("hr");
    inputBar.setAttribute('id', width.toString());
    inputBar.setAttribute('class', "w3-container w3-round-large");
    var upperWidth = width;
    width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= upperWidth) {
            clearInterval(id);
        } else {
            width++;
            inputBar.style.width = width + '%';
            inputBar.innerHTML = width * 1 + '%';
        }
    }
    dataBarsArea.appendChild(inputBar);
    dataBarsArea.appendChild(blankBar);
}