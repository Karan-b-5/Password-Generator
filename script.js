// ------- fetching all the required elements (This is Not a Good Practice we should fetch the elements as and when they are required)
const passwordDisplay = document.querySelector('[data-passwordDisplay]')  //Mention the custom attribute in []
const copyBtn = document.querySelector('[data-copy]') 
const copyMsg = document.querySelector('[data-copiedMsg]') 

const inputSlider = document.querySelector('[data-lengthSlider]') 
const lengthDisplay = document.querySelector('[data-lengthDisplay]') 

const uppercaseCheck = document.querySelector('#uppercase') 
const lowercaseCheck = document.querySelector('#lowercase') 
const numbersCheck = document.querySelector('#numbers') 
const symbolsCheck = document.querySelector('#symbols') 
const allCheckboxes = document.querySelectorAll('input[type=checkbox]')  // will select all the input fields with type checkbox
 
const strengthIndicator = document.querySelector('[data-strengthIndicator]') 
const generateBtn = document.querySelector('.generateBtn') 



// ------- Setting up the intial values

let password = ""; // initial password is empty
let passwordLength = 10; // considering initial password length as 10
let checkCount = 0; 

handleSlider(); // to move slider to its initial position when we load or refresh page...

setIndicator("#ccc"); // setting initial color for the strenth indicator

// ------- Setting up the Functions

// setting up the initial password length on the display as well as slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //kuch aur bhi....
    // to make the bg image visible in that part only which is selected by user (i.e. till where the thumb is set by user) 
    const min = inputSlider.min
    const max = inputSlider.max
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min) ) + "% 100%"
    // (passwordLength-min)*100/(max-min) gives the percentage of part which is selected by user and this we return as the width of bg Size and the height of bg remains fixed always i.e. 100

}

// setting up the color of the strength indicator
function setIndicator(color){
    strengthIndicator.style.backgroundColor = color;
    // Shadow
    strengthIndicator.style.boxShadow = `0 0 12px 1px ${color}`
}

// generating a random integer value (within specified range)
function getRndInteger(min, max){
    // return Math.floor(Math.random() * (max-min))  // this gives a random intger value between [0, (max-min)]
    return Math.floor(Math.random() * (max-min)) + min   // this mow gives a random intger value between [min, (max-min)]
    // return Math.floor(Math.random() * (max-min)) + min // -> this is also correct
}

// generating a random integer value (single digit number)
function generateRandomNumber(){
    return getRndInteger(0, 9); // will return a single digit number value
}

// generating a random ASCII value (between 97 to 122 (123 exclusive)) and getting the corresponding lowercase alphabet
function generateLowercase(){
    return  String.fromCharCode(getRndInteger(97, 123)); // will return a single lowercase alphabet from a-z
}

// generating a random ASCII value (between 65 to 91) and getting the corresponding uppercase alphabet
function generateUppercase(){
    return  String.fromCharCode(getRndInteger(65, 91)); // will return a single uppercase alphabet from A-Z
}

// creating a string of symbols and then we will randomly select one from it (by generating a random index and getting char at that location)...
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// to calculate the strength of the password as per the selected parameters
function calcStrength(){
    // marking them as false, assuming that none of the checkboxes is selected.. And then checking if if that checkbox is checked then we mark it as true...
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    // we can also add a condition where hasNum, hasSym and (hasLower || hasUpper) are true and (length >= 8)
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        // wait till the value gets copied to clipboard (it returns a promise, so await will wait till promise is resolved or rejected)
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "Copied !";  // if successfully copied
    }
    catch(e){
        copyMsg.innerText = 'Error Occured !';  // if error ocuured while copying
    }

    // to make copied wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

// Shuffle the array randomly 
function shufflePassword(array) {
    // Fisher Yates Algorithm
    for (let i = array.length - 1; i > 0; i--) {
        // generating index 'j' randomly between 0 to i (i+1 is exclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // swapping the number at index i and index j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    // str = array.join("");
    return str;
}

function handleCheckBoxChange(){
    // whenever a new ckeckbox is ticked or unticked, the function 'handleCheckBoxChange' is called that checks all of checkboxes again and counts which of them are ticked. and increment checkCount accordingly.
    checkCount = 0;
    allCheckboxes.forEach(checkbox => {
        if(checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}



// ------- Setting up the Event Listeners

allCheckboxes.forEach((checkbox) => {
    //we can also apply event listener on each of the checkbox separately OR we can also use a for loop to apply listener to all of them (as the function and event are common and we have also fetched all checkboxes together in 'allCheckboxes')
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=> {
    console.log('inputslider');
    passwordLength = e.target.value
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        // i.e. if there is a valid (i.e. non empty) value present in the passwordDisplay field then only password will be copied to clipboard
        copyContent();
    }

    // OR -> when the length of 'password'  is greater than 0 the only password will be copied to clipboard
    // if(password.length > 0)
    //     copyContent();
})


generateBtn.addEventListener('click', () => {
    // generating password when generateBtn is clicked
    
    // when none of the checkbox is clicked.
    if(checkCount==0)   
    return ;

console.log('Generated password');
    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // --- Generating the new password
    
    // remove the old password (i.e. make it empty)
    password = "";

    // putting the stuff as per the selected checkboxes
    /*
    if(uppercaseCheck.checked)
        password += generateUppercase();
    if(lowercaseCheck.checked)
        password += generateLowercase();
    if(numbersCheck.checked)
        password += generateRandomNumber();
    if(symbolsCheck.checked)
        password += generateSymbol();

    Instead of this we can make a array and insert all the generating functions of those checked checkboxes to generate the characters...
    */

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);  // don't push generateUppercase() becoz then the char generated by it will be pushed...
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);


    // compulsory addition (i.e. inserting all the selected checkboxes chars at least once)
    for (let i = 0; i < funcArr.length; i++) {
        // don't random generate indexes here as we compulsorily want these additions
        password += funcArr[i]();
    }

    // remaining addition (i.e. when passwordLength > checkCount, then for remaining position we generate chars randomly)
    for (let i = 0; i < passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length)
        password += funcArr[randIndex]();
    }

    // Shuffle the Password (else we would always have the uppercase case in beginning and then others also in sequence for the first four position if all are selected.)
    password = shufflePassword(Array.from(password))

    // show password on UI 
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
    
})




// we can also map a method to its on click event...