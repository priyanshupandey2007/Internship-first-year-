// 1. STATE MANAGEMENT
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

// 2. CORE LOGIC FUNCTIONS
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // Prevent multiple leading zeros, overwrite '0' with the digit
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  // Prevent duplicate decimals
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  // If an operator is pressed but we are waiting for a second operand, update the operator
  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    // Fix JavaScript floating point quirks (e.g., 0.1 + 0.2) using parseFloat and toFixed
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') return firstOperand + secondOperand;
  if (operator === '-') return firstOperand - secondOperand;
  if (operator === '*') return firstOperand * secondOperand;
  if (operator === '/') return firstOperand / secondOperand;

  return secondOperand;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

// Update the DOM element
function updateDisplay() {
  const display = document.querySelector('#screen');
  display.textContent = calculator.displayValue;
}

// 3. EVENT HANDLERS (Routing Logic)
function processInput(value) {
  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'clear':
      resetCalculator();
      break;
    default:
      // Check if it's an integer
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }
  updateDisplay();
}

// UI Click Event (Using Event Delegation)
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) return;

  processInput(target.value);
});

// Keyboard Support Event Listener
document.addEventListener('keydown', (event) => {
  let key = event.key;

  // Map keyboard shortcuts to application actions
  if (key === 'Enter') key = '=';
  if (key === 'Escape') key = 'clear';
  if (key === 'c' || key === 'C') key = 'clear';

  // Filter valid inputs
  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', 'clear'];

  if (validKeys.includes(key)) {
    event.preventDefault(); // Prevent accidental scrolling via Space/Enter keys
    processInput(key);
  }
});

// Run initial display update
updateDisplay();
