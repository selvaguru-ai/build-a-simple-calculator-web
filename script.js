/**
 * Calculator — Core Logic & State Management
 * Handles all arithmetic operations, state transitions, and DOM updates.
 */

'use strict';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/**
 * Single source of truth for the calculator.
 * @type {{ currentInput: string, previousInput: string, operator: string|null, shouldResetDisplay: boolean }}
 */
const state = {
  currentInput: '0',
  previousInput: '',
  operator: null,
  shouldResetDisplay: false,
};

// ---------------------------------------------------------------------------
// DOM References
// ---------------------------------------------------------------------------

/** @type {HTMLElement} */
const displayCurrent = document.querySelector('.display__current');

/** @type {HTMLElement} */
const displayExpression = document.querySelector('.display__expression');

/** @type {HTMLElement} */
const buttonGrid = document.querySelector('.button-grid');

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

/**
 * Formats a numeric string for display.
 * Limits output to 12 significant digits to avoid overflow.
 *
 * @param {string} value - The raw string to display.
 * @returns {string} Formatted display string.
 */
function formatDisplay(value) {
  if (value === 'Error') return 'Error';

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // If the string ends with a decimal point, preserve it (user is mid-entry)
  if (value.endsWith('.')) return value;

  // Avoid scientific notation for numbers that fit in 12 chars
  const formatted = parseFloat(num.toPrecision(12)).toString();
  return formatted;
}

/**
 * Reads the current state and updates both display elements in the DOM.
 * Applies / removes the 'display__current--error' class for error styling.
 */
function updateDisplay() {
  const isError = state.currentInput === 'Error';

  // Current value / result
  displayCurrent.textContent = formatDisplay(state.currentInput);
  displayCurrent.classList.toggle('display__current--error', isError);

  // Expression line (e.g. "12 +")
  if (state.operator && state.previousInput !== '') {
    const opSymbol = operatorSymbol(state.operator);
    displayExpression.textContent = `${formatDisplay(state.previousInput)} ${opSymbol}`;
  } else {
    displayExpression.textContent = '';
  }
}

/**
 * Maps internal operator tokens to display symbols.
 *
 * @param {string} op - Internal operator string (+, -, *, /).
 * @returns {string} Human-readable symbol.
 */
function operatorSymbol(op) {
  const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  return map[op] || op;
}

// ---------------------------------------------------------------------------
// Pure Calculation
// ---------------------------------------------------------------------------

/**
 * Performs a single arithmetic operation.
 * This is a pure function — no side effects, no state mutation.
 *
 * @param {string|number} a  - Left operand.
 * @param {string}        op - Operator (+, -, *, /).
 * @param {string|number} b  - Right operand.
 * @returns {number|string} Numeric result, or the string 'Error' on division by zero.
 */
function calculate(a, op, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  switch (op) {
    case '+':
      return numA + numB;
    case '-':
      return numA - numB;
    case '*':
      return numA * numB;
    case '/':
      if (numB === 0) return 'Error';
      return numA / numB;
    default:
      return numB; // No operator — just return the second operand
  }
}

// ---------------------------------------------------------------------------
// Input Handlers
// ---------------------------------------------------------------------------

/**
 * Appends a digit to the current input.
 * - Respects the shouldResetDisplay flag (set after an operator press).
 * - Prevents multiple leading zeros ("007" → not allowed).
 * - Clears error state before accepting new input.
 *
 * @param {string} digit - Single digit character ('0'–'9').
 */
function handleDigit(digit) {
  // Any digit press after an error clears the error and starts fresh
  if (state.currentInput === 'Error') {
    state.currentInput = '0';
    state.shouldResetDisplay = false;
  }

  if (state.shouldResetDisplay) {
    state.currentInput = digit;
    state.shouldResetDisplay = false;
  } else {
    // Prevent multiple leading zeros (but allow '0.' later)
    if (state.currentInput === '0' && digit === '0') {
      return; // Already showing '0', don't stack zeros
    }
    // Replace a lone '0' with the new digit (unless it's '0' itself)
    if (state.currentInput === '0' && digit !== '0') {
      state.currentInput = digit;
    } else {
      state.currentInput += digit;
    }
  }

  updateDisplay();
}

/**
 * Appends a decimal point to currentInput.
 * - Does nothing if currentInput already contains a '.'.
 * - Handles the shouldResetDisplay flag (starts a new '0.' entry).
 */
function handleDecimal() {
  if (state.currentInput === 'Error') {
    state.currentInput = '0';
    state.shouldResetDisplay = false;
  }

  if (state.shouldResetDisplay) {
    state.currentInput = '0.';
    state.shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!state.currentInput.includes('.')) {
    state.currentInput += '.';
    updateDisplay();
  }
}

/**
 * Handles an operator button press (+, -, *, /).
 * - If an operator is already pending, chains the calculation first.
 * - Stores currentInput as previousInput and sets the new operator.
 * - Sets shouldResetDisplay so the next digit starts a fresh input.
 *
 * @param {string} op - Operator character (+, -, *, /).
 */
function handleOperator(op) {
  // Don't chain on error
  if (state.currentInput === 'Error') return;

  // Chain: if we already have a pending operator, evaluate it first
  if (state.operator !== null && !state.shouldResetDisplay) {
    const result = calculate(state.previousInput, state.operator, state.currentInput);
    if (result === 'Error') {
      state.currentInput = 'Error';
      state.operator = null;
      state.previousInput = '';
      state.shouldResetDisplay = true;
      updateDisplay();
      return;
    }
    state.currentInput = String(result);
  }

  state.previousInput = state.currentInput;
  state.operator = op;
  state.shouldResetDisplay = true;

  updateDisplay();
}

/**
 * Handles the equals button press.
 * - Evaluates the pending expression.
 * - Displays the result.
 * - Resets operator and previousInput so the result can be used in a new chain.
 */
function handleEquals() {
  if (state.operator === null || state.currentInput === 'Error') return;

  const result = calculate(state.previousInput, state.operator, state.currentInput);

  state.currentInput = result === 'Error' ? 'Error' : String(result);
  state.previousInput = '';
  state.operator = null;
  state.shouldResetDisplay = true; // Next digit starts fresh after a result

  updateDisplay();
}

/**
 * Resets the entire calculator state to its initial values.
 */
function handleClear() {
  state.currentInput = '0';
  state.previousInput = '';
  state.operator = null;
  state.shouldResetDisplay = false;

  updateDisplay();
}

/**
 * Removes the last character from currentInput.
 * - Resets to '0' if the string becomes empty or was a single character.
 * - Does nothing if the display shows 'Error' (use Clear instead).
 */
function handleBackspace() {
  if (state.currentInput === 'Error') return;
  if (state.shouldResetDisplay) return; // Don't backspace into a previous result

  if (state.currentInput.length <= 1) {
    state.currentInput = '0';
  } else {
    state.currentInput = state.currentInput.slice(0, -1);
  }

  updateDisplay();
}

/**
 * Toggles the sign of currentInput (positive ↔ negative).
 * - Multiplies the numeric value by -1.
 * - Handles the edge case of '0' (stays '0').
 */
function handleToggleSign() {
  if (state.currentInput === 'Error') return;

  const num = parseFloat(state.currentInput);
  if (isNaN(num) || num === 0) return;

  state.currentInput = String(num * -1);
  updateDisplay();
}

/**
 * Converts currentInput to a percentage (divides by 100).
 * - Useful for calculating e.g. "50 + 10%" style expressions.
 */
function handlePercent() {
  if (state.currentInput === 'Error') return;

  const num = parseFloat(state.currentInput);
  if (isNaN(num)) return;

  // Avoid floating-point drift by using toPrecision then re-parsing
  state.currentInput = String(parseFloat((num / 100).toPrecision(12)));
  updateDisplay();
}

// ---------------------------------------------------------------------------
// Event Delegation
// ---------------------------------------------------------------------------

/**
 * Single click listener on the button grid.
 * Routes clicks to the appropriate handler based on data attributes.
 *
 * Buttons use:
 *   data-digit="0"–"9"       → handleDigit()
 *   data-operator="+|-|*|/" → handleOperator()
 *   data-action="clear"      → handleClear()
 *   data-action="backspace"  → handleBackspace()
 *   data-action="decimal"    → handleDecimal()
 *   data-action="equals"     → handleEquals()
 *   data-action="toggle-sign"→ handleToggleSign()
 *   data-action="percent"    → handlePercent()
 */
if (buttonGrid) {
  buttonGrid.addEventListener('click', (event) => {
    /** @type {HTMLButtonElement|null} */
    const button = event.target.closest('button');
    if (!button) return; // Click was on grid gap, not a button

    const digit = button.dataset.digit;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (digit !== undefined) {
      handleDigit(digit);
      return;
    }

    if (operator !== undefined) {
      handleOperator(operator);
      return;
    }

    if (action !== undefined) {
      switch (action) {
        case 'clear':
          handleClear();
          break;
        case 'backspace':
          handleBackspace();
          break;
        case 'decimal':
          handleDecimal();
          break;
        case 'equals':
          handleEquals();
          break;
        case 'toggle-sign':
          handleToggleSign();
          break;
        case 'percent':
          handlePercent();
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------

// Render the initial state on page load
updateDisplay();
