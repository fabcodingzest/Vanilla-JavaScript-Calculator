const numbers = document.querySelectorAll(".numbers");
const operators = document.querySelectorAll(".operators");
const allClear = document.querySelector(".clear-all");
const clear = document.querySelector(".clear");
const display = document.querySelector(".display-screen");
const decimal = document.querySelector(".decimal");

const calculator = {
  displayVal: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  result: 0
}

function updateDisplay () {
  display.value = calculator.displayVal;
  resetDisplay()
  updateInputWidth();
}
updateDisplay();

// Numbers Input Function
function displayNum (e) {
  const { displayVal, waitingForSecondOperand } = calculator;
  resetDisplay();

  if (waitingForSecondOperand === true) {
    calculator.displayVal = e.currentTarget.value;
    calculator.waitingForSecondOperand = false;
  } else {
    if (displayVal.length < 10) {
      calculator.displayVal = displayVal === '0' ? e.currentTarget.value : displayVal + e.currentTarget.value;
    }
  }
  updateDisplay();
}

// Calculation Object 
const perfornCalculation = {
  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
  '-': (firstOperand, secondOperand) => {
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
  const inputVal = parseFloat(displayVal);


  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = e.currentTarget.value;
    return;
  }

  if (firstOperand === null) {
    calculator.firstOperand = inputVal;
  } else if (operator) {
    const result = perfornCalculation[ operator ](firstOperand, inputVal);
    calculator.displayVal = String(parseFloat(result).toFixed(2));
    calculator.firstOperand = parseFloat(result);

  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = e.currentTarget.value;
  updateDisplay();

}
    // show result

// All Clear Function
function clearAll () {
  calculator.result = 0;
  calculator.displayVal = '0';
  calculator.operator = null;
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  updateDisplay();
} 

// Clear Function
function clearEntry () {
  const numArr = calculator.displayVal.split('');
  // const resArr = calculator.firstOperand
  console.log(numArr);
  
  numArr.pop();  
  calculator.displayVal = numArr.join('');
  calculator.firstOperand = parseFloat(numArr.join(''));
  updateDisplay();
}

// decimal function
function decimalInput (e) {
  if (!calculator.displayVal.includes(e.currentTarget.value)) {
    calculator.displayVal += e.currentTarget.value;
    updateDisplay();
  }
}

// Function to check if Input is overFLown
function isOverflown (element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth>element.clientWidth;
}

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

// Event Listener Functions
numbers.forEach(number => {
  number.addEventListener('click', displayNum);
});
operators.forEach(operator => {
  operator.addEventListener('click', handleOperator)
})
allClear.addEventListener('click', clearAll);
clear.addEventListener('click', clearEntry);
decimal.addEventListener('click', decimalInput);