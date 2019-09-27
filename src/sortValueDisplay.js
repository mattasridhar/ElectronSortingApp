const electron = require('electron');
const { ipcRenderer } = electron;//For sending values from this js page to the main.js page

const ul = document.querySelector('ul');//get the ul from the startUpWindow.html

// Receive the items that are sent by the main.js which it received from inputsHandler.js
ipcRenderer.on("inputs", function (e, inputs) {
    const li = document.createElement('li');
    const input = document.createTextNode(inputs);
    li.appendChild(input);
    ul.appendChild(li);
});

// Clear the items by receiving the 'clearContents' signal sent by the main.js
ipcRenderer.on("clearContents", function () {
    ul.innerHTML = "";//clearing the list that was populated earlier
});

//clear the particular selection of input
ul.addEventListener('dblclick', function (e) {
    e.target.remove();
});