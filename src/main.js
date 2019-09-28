const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = electron;

let mainWindow, inputsWindow;
app.disableHardwareAcceleration();

//checking when app is loaded
app.on('ready', function () {
    //create startup Window
    mainWindow = new BrowserWindow(startUpWindowParams);

    // Loading the mainMenu
    loadMainMenu(Menu);

    //load the StartUpWindow
    loadWindow(mainWindow, 'startUpWindow');

    //close the Window
    closeWindow(mainWindow);

});

//Load html page into this start-up window
loadWindow = function (currentWindow, htmlResource) {
    //below statement creates a URL for the file as 'file://dirname/startUpWindow.html' where the '//'is coming from 'slashes: true', 'file:' is from protocol and 'dirname' is the current directory received from '__dirname'
    currentWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/../screens/' + htmlResource + '.html'),
        protocol: 'file:',
        slashes: true
    }));

}

//clear the startUp Window upon closing
closeWindow = function (currentWindow) {
    currentWindow.on('closed', () => {
        currentWindow = null;
    });
}

//Load the contents of the tabs of the Main Menu
loadMainMenu = function (menu) {
    const mainMenu = menu.buildFromTemplate(mainMenuTabs);
    menu.setApplicationMenu(mainMenu);
}

// load the dialog window for providing inputs to be sorted
openInputsDialog = function (inputsWindow) {
    loadWindow(inputsWindow, 'inputsWindow');
    closeWindow(inputsWindow);
}

// capture the inputs sent by the ipcRenderer from the inputsWindow.js
ipcMain.on('inputs', function (e, input) {
    //console.log("input from InputsWindow: " + input);//gets logged in the Terminal Console
    mainWindow.webContents.send('inputs', input);
    inputsWindow.close();
});
ipcMain.on('sortAlgo', function (e, algo) {
    console.log("SortAlgo frm main: " + algo);//gets logged in the Terminal Console
    mainWindow.webContents.send('sortAlgo', algo);
})

// template for the Main MENU tabs
const mainMenuTabs = [
    {
        label: 'File', submenu: [
            {
                label: 'Toggle Full Screen',
                accelerator: process.platform === 'darwin' ? 'Cmd + F' : 'Ctrl + F',
                role: 'toggleFullScreen'
            },
            {
                label: 'Reload',
                accelerator: process.platform === 'darwin' ? 'Cmd + R' : 'Ctrl + R',
                role: 'reload',

            },
            {
                label: 'Quit Application',
                role: 'quit'
            },
        ],
    },
    {
        label: 'Actions', submenu: [
            {
                label: 'Input Values',
                accelerator: process.platform === 'darwin' ? 'Option + E' : 'Alt + E',
                click() {
                    //create inputWindow
                    inputsWindow = new BrowserWindow(inputsWindowParams);
                    openInputsDialog(inputsWindow);
                }
            },
            {
                label: 'Clear Values',
                accelerator: process.platform === 'darwin' ? 'Option + C' : 'Alt + C',
                click() {
                    //clear the contents of mainWindow
                    mainWindow.webContents.send('clearContents');
                }
            },
        ],
    },
    {
        label: 'Algorithms', submenu: [
            {
                label: 'Insertion Sort',
                accelerator: process.platform === 'darwin' ? 'Cmd + ;' : 'Ctrl + ;',
                click() {
                    insertionSort();                    
                }
            },
            { label: 'Selection Sort' },
            { label: 'Bubble Sort' },
            { label: 'Merge Sort' },
            { label: 'Quick Sort' },
            { label: 'Heap Sort' },
        ],
    },
];

//For MAC as it populates the File Menu under the 'Electron' Tab
if (process.platform === 'darwin') {
    mainMenuTabs.unshift({
        label: ''
    });
}

//show developer tools only n development mode
if (process.env.NODE_ENV !== 'production') {
    mainMenuTabs.push(
        {
            label: 'Developer Tools', submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform === 'darwin' ? 'F12' : 'F12',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                    // role: 'toggleDevTools', //Another style of doing what we are doing above..
                },
            ],
        });
}

const startUpWindowParams = {
    webPreferences: {
        nodeIntegration: true //to make the require in other JS pages work
    },
    title: 'Sorting Application',
    titleBarStyle: 'visible',
    width: 1280,
    height: 800,
    backgroundColor: '#e8f2fc',
    show: true,
    icon: path.join(__dirname, 'favicon.icn')
};

const inputsWindowParams = {
    webPreferences: {
        nodeIntegration: true
    },
    title: 'Enter Inputs',
    titleBarStyle: 'hidden',//Hides the top bar in the Window
    width: 500,
    height: 300,
    backgroundColor: '#e8f2fc',
    show: true,
    icon: path.join(__dirname, 'favicon.icn')
};

// take an input of array ans sorts them using insertion Sorting algorithm
insertionSort = function () {
    console.log("SRI in Insertion Sort");
    // const { ipcRenderer } = electron;
    mainWindow.webContents.send('sortAlgo', "Algos");
}