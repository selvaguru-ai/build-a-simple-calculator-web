/**
 * Calculator — script.js
 * Vanilla JavaScript ES6+ calculator logic.
 * State is held entirely in memory (no localStorage, no API).
 */

'use strict';

// ============================================================
// State
// ============================================================

/** @type {{ currentInput: string, previousInput: string, operator: string|null, shouldResetDisplay: boolean }} */
const state = {
  currentInput: '0',
  previousInput: '',
  operator: null,
  shouldResetDisplay: false,
};

// ============================================================
// DOM References
// ============================================================

const displayCurrent    = document.getElementById('display-current');
const displayExpression = document.getElementById('display-expression');
const displayEl         = document.getElementById('display');

// ============================================================
// Display
// ============================================================

/**
 * Renders a value to the current display.
 * Automatically shrinks font for very long numbers.
 * @param {string} value
 */
function updateDisplay(value) {
  displayCurrent.textContent = value;

  // Dynamically shrink font size for long numbers to avoid overflow
  const len = value.replace('-', '').replace('.', '').length;
  if (len > 12) {
    displayCurrent.style.fontSize = 'clamp(1rem, 4vw, 1.4rem)';
  } else if (len > 9) {
    displayCurrent.style.fontSize = 'clamp(1.4rem, 5vw, 1.8rem)';
  } else {
    displayCurrent.style.fontSize = '';  // Reset to CSS variable
  }
}

/**
 * Updates the expression line (previous operand + operator).
 * @param {string} text
 */
function updateExpression(text) {
  displayExpression.textContent = text;
}

/**
 * Shows an error state on the display.
 * @param {string} [message='Error']
 */
function showError(message = 'Error') {
  state.currentInput = message;
  state.previousInput = '';
  state.operator = null;
  state.shouldResetDisplay = true;
  displayEl.classList.add('display--error');
  updateDisplay(message);
  updateExpression('');
  highlightOperator(null);
}

/**
 * Clears the error styling from the display.
 */
function clearError() {
  displayEl.classList.remove('display--error');
}

// ============================================================
// Pure calculation
// ============================================================

/**
 * Performs arithmetic on two numbers.
 * @param {number} a
 * @param {string} op  One of '+', '-', '*', '/'
 * @param {number} b
 * @returns {number}
 */
function calculate(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

/**
 * Formats a number for display — avoids floating-point noise,
 * caps decimal places, and handles very large/small numbers.
 * @param {number} num
 * @returns {string}
 */
function formatResult(num) {
  if (!isFinite(num)) return 'Error';

  // Use toPrecision to avoid floating-point noise (e.g. 0.1 + 0.2)
  // but only when the number has decimals
  let result = parseFloat(num.toPrecision(12));

  // Convert to string; if it's in scientific notation, keep it short
  let str = String(result);

  // Cap display at 12 significant characters (excluding sign and dot)
  if (str.replace(/[-.]/g, '').length > 12) {
    str = result.toExponential(6);
  }

  return str;
}

// ============================================================
// Operator highlight
// ============================================================

/**
 * Adds .active class to the currently selected operator button.
 * @param {string|null} op
 */
function highlightOperator(op) {
  document.querySelectorAll('.button-grid button[data-operator]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.operator === op);
  });
}

// ============================================================
// Handler functions
// ============================================================

/**
 * Appends a digit to the current input.
 * @param {string} digit  '0'–'9'
 */
function handleDigit(digit) {
  clearError();

  if (state.shouldResetDisplay) {
    state.currentInput = digit;
    state.shouldResetDisplay = false;
  } else {
    // Prevent multiple leading zeros
    if (state.currentInput === '0' && digit !== '.') {
      state.currentInput = digit;
    } else {
      // Limit input length to 12 digits
      if (state.currentInput.replace(/[-.]/g, '').length >= 12) return;
      state.currentInput += digit;
    }
  }

  updateDisplay(state.currentInput);
}

/**
 * Handles an operator button press.
 * If a previous operator is pending, evaluates it first (chaining).
 * @param {string} op  '+', '-', '*', '/'
 */
function handleOperator(op) {
  clearError();

  const current = parseFloat(state.currentInput);

  // If we already have a pending operation and the user hasn't reset,
  // evaluate the chain before storing the new operator
  if (state.operator && !state.shouldResetDisplay) {
    try {
      const prev   = parseFloat(state.previousInput);
      const result = calculate(prev, state.operator, current);
      const formatted = formatResult(result);

      if (formatted === 'Error') { showError(); return; }

      state.currentInput = formatted;
      updateDisplay(formatted);
    } catch (e) {
      showError(e.message === 'Division by zero' ? '÷0 Error' : 'Error');
      return;
    }
  }

  state.previousInput   = state.currentInput;
  state.operator        = op;
  state.shouldResetDisplay = true;

  // Show expression line: e.g. "42 ×"
  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
  updateExpression(`${state.previousInput} ${opSymbol}`);
  highlightOperator(op);
}

/**
 * Evaluates the current expression and shows the result.
 */
function handleEquals() {
  clearError();

  if (!state.operator || state.previousInput === '') return;

  const a = parseFloat(state.previousInput);
  const b = parseFloat(state.currentInput);

  // Build expression string for display
  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[state.operator] || state.operator;
  const expressionStr = `${state.previousInput} ${opSymbol} ${state.currentInput} =`;

  try {
    const result    = calculate(a, state.operator, b);
    const formatted = formatResult(result);

    if (formatted === 'Error') { showError(); return; }

    updateExpression(expressionStr);
    updateDisplay(formatted);

    // Reset state after equals
    state.currentInput       = formatted;
    state.previousInput      = '';
    state.operator           = null;
    state.shouldResetDisplay = true;

    highlightOperator(null);
  } catch (e) {
    showError(e.message === 'Division by zero' ? '÷0 Error' : 'Error');
  }
}

/**
 * Appends a decimal point if one doesn't already exist.
 */
function handleDecimal() {
  clearError();

  if (state.shouldResetDisplay) {
    state.currentInput = '0.';
    state.shouldResetDisplay = false;
    updateDisplay(state.currentInput);
    return;
  }

  if (!state.currentInput.includes('.')) {
    state.currentInput += '.';
    updateDisplay(state.currentInput);
  }
}

/**
 * Resets the calculator to its initial state.
 */
function handleClear() {
  clearError();
  state.currentInput       = '0';
  state.previousInput      = '';
  state.operator           = null;
  state.shouldResetDisplay = false;

  updateDisplay('0');
  updateExpression('');
  highlightOperator(null);
}

/**
 * Removes the last character from the current input.
 */
function handleBackspace() {
  clearError();

  // If the display is showing a result (shouldReset), backspace clears it
  if (state.shouldResetDisplay) {
    state.currentInput = '0';
    state.shouldResetDisplay = false;
    updateDisplay('0');
    return;
  }

  if (state.currentInput.length <= 1 || state.currentInput === '-0') {
    state.currentInput = '0';
  } else {
    state.currentInput = state.currentInput.slice(0, -1);
    // If we're left with just a minus sign, reset to 0
    if (state.currentInput === '-') state.currentInput = '0';
  }

  updateDisplay(state.currentInput);
}

/**
 * Converts the current input to a percentage (divides by 100).
 */
function handlePercent() {
  clearError();
  const value = parseFloat(state.currentInput);
  if (isNaN(value)) return;

  const result = formatResult(value / 100);
  state.currentInput = result;
  updateDisplay(result);
}

/**
 * Toggles the sign of the current input (positive ↔ negative).
 */
function handleToggleSign() {
  clearError();
  const value = parseFloat(state.currentInput);
  if (isNaN(value) || value === 0) return;

  const toggled = formatResult(-value);
  state.currentInput = toggled;
  updateDisplay(toggled);
}

// ============================================================
// Keyboard support
// ============================================================

/**
 * Maps keyboard events to calculator actions.
 * @param {KeyboardEvent} event
 */
function handleKeyboard(event) {
  const { key } = event;

  // Prevent default for keys we handle (e.g. '/' opening browser find)
  const handled = [
    '0','1','2','3','4','5','6','7','8','9',
    '+','-','*','/','.','%',
    'Enter','=','Backspace','Escape','Delete',
  ];
  if (handled.includes(key)) event.preventDefault();

  if (key >= '0' && key <= '9') {
    handleDigit(key);
    animateButton(`[data-digit="${key}"]`);
  } else if (key === '+') {
    handleOperator('+');
    animateButton('[data-operator="+"]');
  } else if (key === '-') {
    handleOperator('-');
    animateButton('[data-operator="-"]');
  } else if (key === '*') {
    handleOperator('*');
    animateButton('[data-operator="*"]');
  } else if (key === '/') {
    handleOperator('/');
    animateButton('[data-operator="/"]');
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
    animateButton('[data-action="equals"]');
  } else if (key === 'Backspace') {
    handleBackspace();
    animateButton('[data-action="backspace"]');
  } else if (key === 'Escape' || key === 'Delete') {
    handleClear();
    animateButton('[data-action="clear"]');
  } else if (key === '.') {
    handleDecimal();
    animateButton('[data-action="decimal"]');
  } else if (key === '%') {
    handlePercent();
    animateButton('[data-action="percent"]');
  }
}

/**
 * Briefly adds an 'active' CSS class to a button for keyboard press feedback.
 * @param {string} selector  CSS selector for the button
 */
function animateButton(selector) {
  const btn = document.querySelector(`.button-grid button${selector}`);
  if (!btn) return;
  btn.classList.add('keyboard-active');
  setTimeout(() => btn.classList.remove('keyboard-active'), 120);
}

// ============================================================
// Event delegation — button grid clicks
// ============================================================

document.querySelector('.button-grid').addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;

  const { digit, operator, action } = btn.dataset;

  if (digit !== undefined)    { handleDigit(digit);      return; }
  if (operator !== undefined) { handleOperator(operator); return; }

  switch (action) {
    case 'clear':       handleClear();       break;
    case 'backspace':   handleBackspace();   break;
    case 'percent':     handlePercent();     break;
    case 'toggle-sign': handleToggleSign();  break;
    case 'decimal':     handleDecimal();     break;
    case 'equals':      handleEquals();      break;
  }
});

// ============================================================
// Keyboard listener
// ============================================================

document.addEventListener('keydown', handleKeyboard);

// ============================================================
// Initial render
// ============================================================

updateDisplay(state.currentInput);
updateExpression('');
