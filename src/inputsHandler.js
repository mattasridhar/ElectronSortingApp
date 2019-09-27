const electron = require('electron');
const { ipcRenderer } = electron;//For sending values from this js page to the main.js page

const form = document.querySelector('form');

//capturing Submit button event
form.addEventListener('submit', submitInputs);

function submitInputs(e) {
    e.preventDefault();
    const inputsText = document.querySelector('#inputsText').value;
    // console.log("Submit Inputs value: " + inputsText);//gets logged in the browser console
    ipcRenderer.send('inputs', inputsText);
}