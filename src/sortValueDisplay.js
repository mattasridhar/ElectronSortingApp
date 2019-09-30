const electron = require('electron');
const { ipcRenderer } = electron;//For sending values from this js page to the main.js page
const $ = require('jquery');

let sortAlgo = "insertionSort";
let toBeSorted = "";
//get the elements from the startUpWindow.html
const ol = document.querySelector('ol');//get the ul from the startUpWindow.html
const dataBarsArea = document.getElementById("dataBars");
const errorArea = document.getElementById("errorArea");
const clearAll = document.getElementById("clearAll");


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

// Receive the Algorithm that are selectd by the main.js
ipcRenderer.on("sortAlgo", function (e, algo) {
    // console.log("srtDisp sortAlgo: " + algo + " inp: " + toBeSorted);
    sortAlgo = algo;
    processInputs(toBeSorted, algo);
});

// Receive the items that are sent by the main.js which it received from inputsHandler.js
ipcRenderer.on("inputs", function (e, inputs) {
    toBeSorted = "";
    toBeSorted = toBeSorted + inputs;
    processInputs(toBeSorted);
    clearAll.removeAttribute('hidden');
});

// Clear the items by receiving the 'clearContents' signal sent by the main.js
ipcRenderer.on("clearContents", function () {
    clearCanvas();
});

//clear button handler
clearAll.addEventListener('click', function (e) {
    clearCanvas();
});

clearCanvas = function () {
    dataBarsArea.innerHTML = "";//clearing the list that was populated earlier
    ol.innerHTML = "";//clearing the list that was populated earlier
    clearAll.setAttribute('hidden', 'hidden');
    errorArea.innerHTML = "";
    toBeSorted = "";
    sortAlgo = "insertionSort";
}

//process the received Input values
processInputs = function (inputs) {
    let inputArr = inputs.split(',');
    let isValid = true;

    inputArr.some(inp => {
        // console.log("Msg: " + inp + " parseInt: " + parseInt(inp) + " cond: " + (Number.isNaN(parseInt(inp))));
        if (Number.isNaN(parseInt(inp))) {
            isValid = false;
        }
    });

    if (!isValid || Number.isNaN(parseInt(inputs))) {
        showErrorMessage(true);
    } else {
        showErrorMessage(false);
        toBeSorted.concat(inputArr);
        applyAgorithm(toBeSorted, sortAlgo);
        // adjustBars(parseInt(inputs));
    }
}

showErrorMessage = function (showError) {
    const errorText = document.createElement('h2');
    const errorMessage = document.createTextNode('In-correct input. Please provide Inputs again');
    if (showError) {
        errorArea.innerHTML = "";
        dataBarsArea.innerHTML = "";
        ol.innerHTML = "";
        errorText.appendChild(errorMessage);
        errorArea.appendChild(errorText);
    } else {
        errorArea.innerHTML = "";
    }
}

function adjustBars(width) {
    // console.log("SRI bar width: " + width);
    var inputBar = document.createElement("div");
    var barSeperator = document.createElement("hr");
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
            inputBar.innerHTML = width * 1;
        }
    }
    dataBarsArea.appendChild(inputBar);
    dataBarsArea.appendChild(barSeperator);
}

applyAgorithm = function (toBeSorted, sortAlgo) {
    const algorithm = sortAlgo;
    const unsortInput = toBeSorted.split(",");
    let unsortedArr = [];
    //converting all strings to numerics
    for (let a = 0; a < unsortInput.length; a++) {
        unsortedArr.push(parseInt(unsortInput[a]));
    }
    dataBarsArea.innerHTML = "";
    ol.innerHTML = "";
    switch (sortAlgo) {
        case "insertionSort":
            insertionSort(unsortedArr);
            break;
        case "selectionSort":
            selectionSort(unsortedArr);
            break;
        case "bubbleSort":
            bubbleSort(unsortedArr);
            break;
        case "mergeSort":
            console.log("Merge Sort Processing. ");
            let aux = [];
            for (i = 0; i <= unsortedArr.length - 1; i++) {
                aux[i] = unsortedArr[i];
            }
            mergeSort(unsortedArr, aux, 0, unsortedArr.length - 1);
            break;
        case "quickSort":
            console.log("Quick Sort Processing. ");
            quickSort(unsortedArr, 0, unsortedArr.length - 1);
            break;
        case "heapSort":
            heapSort(unsortedArr);
            break;
        default:
            showErrorMessage(true);
            break;
    }
}

//animate the bars
iterationBars = function (unsortedArr) {
    dataBarsArea.innerHTML = "";
    for (let i = 0; i < unsortedArr.length; i++) {
        // setTimeout(function () {
        adjustBars(unsortedArr[i]);
        // }, 3000);
    }
    const li = document.createElement('li');
    const input = document.createTextNode(unsortedArr);
    li.appendChild(input);
    ol.appendChild(li);
}

//logic for Heap Sort
heapSort = function (unsortedArr) {
    console.log("Heap Sort Processing. ");
    let n = unsortedArr.length;

    for (let i = (n / 2) - 1; i >= 0; i--) {
        heapify(unsortedArr, n, i);
    }

    for (let i = n - 1; i >= 0; i--) {
        swapContents(unsortedArr, 0, i);
        heapify(unsortedArr, i, 0);
    }
}

heapify = function (unsortedArr, n, i) {
    let max = i;
    let l = (2 * i) + 1;
    let r = (2 * i) + 2;

    if (l < n && unsortedArr[l] > unsortedArr[max]) {
        max = l;
    }
    if (r < n && unsortedArr[r] > unsortedArr[max]) {
        max = r;
    }

    if (max != i) {
        swapContents(unsortedArr, max, i);
        heapify(unsortedArr, n, max);
    }
    iterationBars(unsortedArr);

}

//logic for Quick Sort
quickSort = function (unsortedArr, start, end) {
    if (start <= end) {
        let pIndex = partition(unsortedArr, start, end);

        quickSort(unsortedArr, start, pIndex - 1);
        quickSort(unsortedArr, pIndex + 1, end);
    }
    iterationBars(unsortedArr);
}

partition = function (unsortedArr, start, end) {
    let pIndex = start;
    let pivot = unsortedArr[end];

    for (let i = start; i < end; i++) {
        if (unsortedArr[i] <= pivot) {
            swapContents(unsortedArr, i, pIndex);
            pIndex++;
        }
    }
    swapContents(unsortedArr, pIndex, end);
    return pIndex;
}

//logic for Merge Sort
mergeSort = function (unsortedArr, aux, start, end) {
    if (start === end) {
        return;
    }
    const mid = (start + ((end - start) >> 1));
    mergeSort(unsortedArr, aux, start, mid);
    mergeSort(unsortedArr, aux, mid + 1, end);
    mergeBack(unsortedArr, aux, start, mid, end);
}

mergeBack = function (unsortedArr, aux, start, mid, end) {
    let i = start;
    let k = start;
    let j = mid + 1;
    while (i <= mid && j <= end) {
        if (unsortedArr[i] < unsortedArr[j]) {
            aux[k++] = unsortedArr[i++];
        } else {
            aux[k++] = unsortedArr[j++];
        }
    }

    while (i <= mid) {
        aux[k++] = unsortedArr[i++];
    }

    for (i = start; i <= end; i++) {
        unsortedArr[i] = aux[i];
    }
    iterationBars(unsortedArr);
}

//logic for Bubble Sort
bubbleSort = function (unsortedArr) {
    console.log("Bubble Sort Processing. ");
    for (let k = 0; k < unsortedArr.length - 1; k++) {
        for (let i = 0; i < unsortedArr.length - 1 - k; i++) {
            if (unsortedArr[i] > unsortedArr[i + 1]) {
                unsortedArr = swapContents(unsortedArr, i, i + 1);
            }
        }
        // console.log(unsortedArr);
        iterationBars(unsortedArr);
    }
}

//logic for Selection Sort
selectionSort = function (unsortedArr) {
    console.log("Selection Sort Processing. ");
    for (let i = 0; i < unsortedArr.length; i++) {
        let min = i;
        for (let j = 0; j < unsortedArr.length; j++) {
            if (unsortedArr[j] > unsortedArr[min]) {
                min = j;
            }
            unsortedArr = swapContents(unsortedArr, i, min);
        }
        // console.log(unsortedArr);
        iterationBars(unsortedArr);
    }
}

//logic for insertion sort
insertionSort = function (unsortedArr) {
    console.log("Insertion Sort Processing. ");
    for (let i = 1; i < unsortedArr.length; i++) {
        const val = unsortedArr[i];
        let j = i;
        while (j > 0 && unsortedArr[j - 1] > val) {
            unsortedArr[j] = unsortedArr[j - 1];
            j--;
        }
        unsortedArr[j] = val;
        iterationBars(unsortedArr);
        // console.log(unsortedArr)
    }
    // recursiveInsertionSort(unsortedArr, 0, unsortedArr.length);
}

/*recursiveInsertionSort = function (arr, i, n) {
    console.log(arr + " , " + i + " , " + n);
    const val = arr[i];
    let j = i;
    while (j > 0 && arr[j - 1] > val) {
        arr[j] = arr[j - 1];
        j--
    }
    arr[j] = val;
    iterationBars(arr);
    if ((i + 1) < n) {
        setTimeout(
            recursiveInsertionSort(arr, i + 1, n), 2000);
    }
}*/

swapContents = function (tempArr, i, j) {
    const temp = tempArr[i];
    tempArr[i] = tempArr[j];
    tempArr[j] = temp;
    return tempArr;
}
