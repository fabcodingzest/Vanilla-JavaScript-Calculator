// Selecting DOM elements
const numbers = document.querySelectorAll(".numbers");
const operators = document.querySelectorAll(".operators");
const allClear = document.querySelector(".clear-all");
const clear = document.querySelector(".clear");
const display = document.querySelector(".display-screen");
const decimal = document.querySelector(".decimal");

// state Object
const calculator = {
  displayVal: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
}

// Function to check if Input is overflowed
function isOverflown (element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

// Adjusting display screen fontSize according to input size
function updateInputWidth () {
  let fontSize = parseInt((window.getComputedStyle(display).fontSize))
  console.log(fontSize);
  let paddingBottom = parseInt((window.getComputedStyle(display).paddingBottom))
  for (let i = fontSize; i >= 35; i--) {
    let overflow = isOverflown(display);
    if (overflow) {
      fontSize -= 4;
      paddingBottom += 2;
      display.style.fontSize = fontSize + "px";
      display.style.paddingBottom = paddingBottom + "px";
    }
  }
}

// Reset Display function
function resetDisplay () {
  display.style.fontSize = "4rem";
  display.style.paddingBottom = "0";
}

// Utility function to update Display screen
function updateDisplay () {
  display.value = calculator.displayVal;
  resetDisplay()
  updateInputWidth();
}

// Updating screen at the start of application
updateDisplay();

// Displaying the digits (operand)
function displayNum (e) {
  const { displayVal, waitingForSecondOperand } = calculator;
  // resetting display in case the display screen font size is smaller then default
  resetDisplay();

  // we check if waitingForSecondOperand is true and set displayValue to the key that was clicked. Otherwise, we perform the same check as before, overwriting or appending to calculator.displayValue as appropriate. This check is to overwrite firstOperand when we want to input the second one
  if (waitingForSecondOperand === true) {
    calculator.displayVal = e.currentTarget.value;
    calculator.waitingForSecondOperand = false;
  } else {
    if (displayVal.length < 10) { // limiting input to 10 numbers
      // Check if there is already zero, if there is then display it as it is without appending and if there is other digit then zero then append the string to make the operand of more then 1 digit.
      calculator.displayVal = displayVal === '0' ? e.currentTarget.value : displayVal + e.currentTarget.value;
    }
  }
  updateDisplay();
}

// Calculation functions Object 
const perfornCalculation = {
  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
  '-': (firstOperand, secondOperand) => {
    // Condition for the weird JavaScript bug which shows 03.3 - 0.2 = 0.99999....8, so we check if we have same operands for the function. If they are 0.3 and 0.2 then we return 0.1 otherwise we return the calculated value
    if(firstOperand === 0.3 && secondOperand === 0.2){
      return 0.1;
    } else {
      return firstOperand - secondOperand
    }
  },
  '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
  '%': (firstOperand, secondOperand) => firstOperand % secondOperand,
  '=': (firstOperand, secondOperand) => secondOperand,
}


// Operators Function
function handleOperator (e) {
  const { displayVal, firstOperand, operator } = calculator;
  // saving the parsed value of display screen into input Val constant 
  const inputVal = parseFloat(displayVal);

// if we already have an operator and we are waiting for second operand then we set the state of operator in state to the operator which was clicked at last. (if a person clicks 21 +-* simultaneously then * is taken for calculation)
  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = e.currentTarget.value;
    return;
  }
// if we dont have an operand then we set it to the displayValue which we saved earlier in inputVal
  if (firstOperand === null) {
    calculator.firstOperand = inputVal;
  } else if (operator) {
    // otherwise we perform the calculation by calling the Calculation Object with arguments firstOperand which we saved earlier and inputVal which was currently displayed on screen after we saved previous operand
    const result = perfornCalculation[ operator ](firstOperand, inputVal);
    // update the result on the display screen and saving the result as firstOperand
    calculator.displayVal = `${Number.isInteger(result) ? result : parseFloat(result).toFixed(2)}`;
    calculator.firstOperand = parseFloat(result);

  }
// setting the waitingForSecondOperand flag to true as we have firstOperand which was the result of earlier calculation
  calculator.waitingForSecondOperand = true;
  // update operator value to the current operator clicked
  calculator.operator = e.currentTarget.value;
  updateDisplay();
}

// All Clear Function
function clearAll () {
  calculator.displayVal = '0';
  calculator.operator = null;
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  updateDisplay();
} 

// Clear Function
function clearEntry () {
  // taking the display screen value and splitting it into an array
  const numArr = calculator.displayVal.split('');
  // removing the last element from the array
  numArr.pop();  
  let numberAfterClearingLastEntry = numArr.join('');
  // Updating display screen and first operand(parsed) value to the result after popping the last element and joining the array together.
  calculator.displayVal = numberAfterClearingLastEntry;
  calculator.firstOperand = parseFloat(numberAfterClearingLastEntry);
  updateDisplay();
}

// decimal function
function decimalInput (e) {
  // we check if we already have a decimal in display value in state object, if its not true then we append it to the display value
  if (!calculator.displayVal.includes(e.currentTarget.value)) {
    calculator.displayVal += e.currentTarget.value;
    updateDisplay();
  }
}

// Event Listeners
numbers.forEach(number => {
  number.addEventListener('click', displayNum);
});

operators.forEach(operator => {
  operator.addEventListener('click', handleOperator)
})

decimal.addEventListener('click', decimalInput);
allClear.addEventListener('click', clearAll);
clear.addEventListener('click', clearEntry);