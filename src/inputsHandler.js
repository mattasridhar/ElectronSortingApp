const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');

//capturing Submit button event
form.addEventListener('submit', submitInputs);

function submitInputs(e){
    e.preventDefault();
    console.log("Submit clicked");
}