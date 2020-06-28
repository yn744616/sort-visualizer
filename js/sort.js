/**
 * This class visualizes merge sort algorithm with the use of async functions.
 * In order to change the color of bars when comparing or swapping/sorting, many
 * "await" statements had to be used. 
 * 
 * When the sorter is comparing values of two bars, those bars turn yellow.
 * When the sorter determines which value of those two bars is smaller, 
 * the bar with smaller value turns purple. 
 * Lastly, when the sorter is done sorting those bars according to their values, 
 * both two bars turn blue, their original color;
 * 
 */
const delay = ms => new Promise(res => setTimeout(res, ms));
const bar = document.querySelector('.bar');
const barContainerWidth = bar.getBoundingClientRect().width;
let maxNumArray = 22;
const genArrayBtn = document.querySelector('.arr-btn');
const mergeSortBtn = document.querySelector('.merge-sort-btn');
const slider = document.querySelector('.range');
const compareColor = "#F7C15C";
const setColor = "#7020FF";
const originalColor = "#0075FF";
var speed = 250;
 
/**
 * Changes the number of bars depending on the screen size
 */
if(barContainerWidth > 500 && barContainerWidth < 870) {
    maxNumArray = 15;
}else if(barContainerWidth <= 500 && barContainerWidth > 400){
    maxNumArray = 10;
}else if(barContainerWidth <= 400){
    maxNumArray = 5;
}


/**
 * First set up randomly generated array when page gets loaded
 */
var array = [];
for(let i = 0; i < maxNumArray; i++){
    //array.push(rndNumgenerator(20, 300));
    let num = rndNumgenerator(20, 300);
    while(array.includes(num)){
        num = rndNumgenerator(20, 300);
    }
    array.push(num);

}

array.forEach(function(value, index){
    const div = document.createElement('div');
    div.classList.add('mx-1', 'text-center', 'text-light');
    div.id = index;
    div.style.height = value * 2 + "px";
    div.style.width = "30px";
    div.style.backgroundColor = originalColor;
    div.textContent = value;
    bar.append(div);
});


/**
 * Generate new random array when 'Generate New Array" button is clicked 
 */
genArrayBtn.addEventListener('click', () => {
    array = [];
    for(let i = 0; i < maxNumArray; i++){
        let num = rndNumgenerator(20, 300);
        while(array.includes(num)){
            num = rndNumgenerator(20, 300);
        }
        array.push(num);
    }

    array.forEach(function(value, index){
        const currBar = document.getElementById(index);
        currBar.style.height = value * 2 + "px";
        currBar.textContent = value;
    });
});

/**
 * Helper function that is used when generating a new array
 * 
 * @param {*} min 
 * @param {*} max 
 */
function rndNumgenerator(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Merge sort the array when "Merge Sort" button is clicked
 */
mergeSortBtn.addEventListener('click', async function() {
    genArrayBtn.disabled = true;

    array = await mergeSort(array);

    genArrayBtn.disabled = false;
});

/**
 * Every time slider gets updated, display number and update speed
 */
slider.addEventListener('mousemove', e => {
    console.log(e.target);
    speed = slider.value * 50;
    document.getElementById('sliderValue').innerHTML = slider.value;

});




/******************************************************** Helper Methods From Here ********************************************************/

/**
 * This function is recursive. After it divides the array, 
 * it uses the merge function to put the array together to conquer. 
 * e.g., array = [1, 4, 3, 2] -> mergeSort(array)
 * -> merge(merge(1, 4), merge(3, 2))
 * 
 * @param {*} arr 
 */
async function mergeSort(arr){
    if(arr.length <= 1){
        return arr;
    }
    const midIndex = Math.floor(arr.length / 2);

    const leftArray = arr.slice(0, midIndex);
    const rightArray = arr.slice(midIndex);

    return await merge(await mergeSort(leftArray), await mergeSort(rightArray));
}

/**
 * This method helps mergeSort() function to put array elements back together. 
 * It also shows which array elements are getting compared, which one is smaller, 
 * and reverses back to their original color when it sorts two elements.  
 * 
 * @param {*} leftArr 
 * @param {*} rightArr 
 */
async function merge(leftArr, rightArr){
    let leftIndex = 0;
    let rightIndex = 0;
    let result = [];

    while(leftIndex < leftArr.length && rightIndex < rightArr.length){

        await delay(speed);
        await changeColor(rightArr[rightIndex], compareColor);
        await changeColor(leftArr[leftIndex], compareColor);
        await delay(speed);

        if(leftArr[leftIndex] < rightArr[rightIndex]){
            result.push(leftArr[leftIndex]);
            await changeColor(leftArr[leftIndex], setColor);
            await delay(speed);
            await changeColor(leftArr[leftIndex], originalColor);
            await changeColor(rightArr[rightIndex], originalColor);
            ++leftIndex;
        }else{
            result.push(rightArr[rightIndex]);
            await changeColor(rightArr[rightIndex], setColor);
            await delay(speed);
            await changeColor(rightArr[rightIndex], originalColor);

            let tempR = rightArr[rightIndex];
            let tempL = leftArr[leftIndex];
            await swap(leftArr[leftIndex], rightArr[rightIndex]);
            await changeColor(array[array.indexOf(tempR)], originalColor);
            await changeColor(array[array.indexOf(tempL)], originalColor);

            ++rightIndex;
        }
       
        //Display array each time array gets merged back
        array.forEach(function(value, index){
            const currBar = document.getElementById(index);
            currBar.style.height = value * 2 + "px";
            currBar.textContent = value;
        });
    }

    //There can be one element in either left or right array so check and add at the end
    while(leftIndex < leftArr.length){
        await changeColor(leftArr[leftIndex], originalColor);
        result.push(leftArr[leftIndex++]);
    } 
    while(rightIndex < rightArr.length) {
        await changeColor(rightArr[rightIndex], originalColor);
        result.push(rightArr[rightIndex++]);
    }

    //Display array again
    array.forEach(function(value, index){
        const currBar = document.getElementById(index);
        currBar.style.height = value * 2 + "px";
        currBar.textContent = value;
    });
    
    return result;
}


/**
 * This method swaps values in the array. 
 * It swaps only two values if elementA and elementB are
 * right next to each other. If not, elementB takes elementA's spot
 * and all elements from elementA moves up a spot. 
 * e.g., {1, 2, 3, 4} -> swap(1, 4)
 * = {4, 1, 2, 3}
 * 
 * @param {*} elementA 
 * @param {*} elementB 
 */
async function swap(elementA, elementB){
    let indexA = array.indexOf(elementA);
    let indexB = array.indexOf(elementB);
    let diff = Math.abs(indexB - indexA);
  
    if(diff <= 1){
        let temp = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = temp;

    }else{
        let temp = array[indexB];
        
        while(diff > 0){
            array[indexB] = array[--indexB];
            --diff;
        }
        array[indexB] = temp
    }
    
}


/**
 * This function finds the index of the element and changes the div with
 * id = index of element to whichever color. 
 * 
 * @param {*} element 
 * @param {*} color 
 */
async function changeColor(element, color){
    let i = array.indexOf(element);
    document.getElementById(i).style.backgroundColor = color;
}
