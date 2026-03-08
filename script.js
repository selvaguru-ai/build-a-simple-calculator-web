/**
 * Calculator — script.js
 * Handles all calculator logic, state management, event handling,
 * keyboard input, and accessibility feedback.
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

const displayCurrent = document.getElementById('display-current');
const displayExpression = document.getElementById('display-expression');

// ============================================================
// Display
// ============================================================

/**
 * Renders a value to the current display element.
 * Adjusts font size for long numbers.
 * @param {string} value
 */
function updateDisplay(value) {
  displayCurrent.textContent = value;
  // Shrink font for long numbers
  if (value.length > 9) {
    displayCurrent.classList.add('display__current--long');
  } else {
    displayCurrent.classList.remove('display__current--long');
  }
}

/**
 * Renders the expression line (previousInput + operator symbol).
 */
function updateExpressionDisplay() {
  if (state.operator && state.previousInput !== '') {
    const opSymbol = operatorSymbol(state.operator);
    displayExpression.textContent = `${state.previousInput} ${opSymbol}`;
  } else {
    displayExpression.textContent = '';
  }
}

/**
 * Returns a human-readable symbol for an operator.
 * @param {string} op
 * @returns {string}
 */
function operatorSymbol(op) {
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  return symbols[op] || op;
}

// ============================================================
// Core Calculator Logic
// ============================================================

/**
 * Pure function — computes the result of a binary operation.
 * @param {number} a
 * @param {string} op
 * @param {number} b
 * @returns {number}
 */
function calculate(a, op, b) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return NaN; // Division by zero
      return a / b;
    default:
      return b;
  }
}

/**
 * Formats a number for display — limits decimal places and
 * handles Infinity / NaN gracefully.
 * @param {number} num
 * @returns {string}
 */
function formatResult(num) {
  if (!isFinite(num) || isNaN(num)) {
    return 'Error';
  }
  // Avoid floating-point noise (e.g. 0.1 + 0.2 = 0.30000000000000004)
  const rounded = parseFloat(num.toPrecision(12));
  // Convert to string; if it's too long, use exponential notation
  const str = String(rounded);
  if (str.length > 12) {
    return rounded.toExponential(6);
  }
  return str;
}

// ============================================================
// Handler Functions
// ============================================================

/**
 * Appends a digit to the current input.
 * @param {string} digit  '0'–'9'
 */
function handleDigit(digit) {
  if (state.shouldResetDisplay) {
    state.currentInput = digit;
    state.shouldResetDisplay = false;
  } else {
    // Prevent multiple leading zeros
    if (state.currentInput === '0' && digit !== '.') {
      state.currentInput = digit;
    } else {
      // Limit input length
      if (state.currentInput.length >= 12) return;
      state.currentInput += digit;
    }
  }
  updateDisplay(state.currentInput);
}

/**
 * Handles an operator button press.
 * If an operator is already pending and the user hasn't just pressed
 * another operator, evaluate the chain first.
 * @param {string} op  '+' | '-' | '*' | '/'
 */
function handleOperator(op) {
  const current = parseFloat(state.currentInput);

  if (state.operator && !state.shouldResetDisplay) {
    // Chain calculation
    const previous = parseFloat(state.previousInput);
    const result = calculate(previous, state.operator, current);
    const formatted = formatResult(result);
    state.currentInput = formatted;
    updateDisplay(formatted);
  }

  state.previousInput = state.currentInput;
  state.operator = op;
  state.shouldResetDisplay = true;

  updateExpressionDisplay();
  highlightActiveOperator(op);
}

/**
 * Evaluates the pending expression and shows the result.
 */
function handleEquals() {
  if (!state.operator || state.previousInput === '') return;

  const a = parseFloat(state.previousInput);
  const b = parseFloat(state.currentInput);
  const result = calculate(a, state.operator, b);
  const formatted = formatResult(result);

  // Show full expression in expression display before clearing it
  const opSymbol = operatorSymbol(state.operator);
  displayExpression.textContent = `${state.previousInput} ${opSymbol} ${state.currentInput} =`;

  state.currentInput = formatted;
  state.previousInput = '';
  state.operator = null;
  state.shouldResetDisplay = true;

  updateDisplay(formatted);
  highlightActiveOperator(null);
}

/**
 * Safely appends a decimal point to the current input.
 */
function handleDecimal() {
  if (state.shouldResetDisplay) {
    state.currentInput = '0.';
    state.shouldResetDisplay = false;
    updateDisplay(state.currentInput);
    return;
  }
  if (state.currentInput.includes('.')) return; // Already has decimal
  state.currentInput += '.';
  updateDisplay(state.currentInput);
}

/**
 * Resets the calculator to its initial state.
 */
function handleClear() {
  state.currentInput = '0';
  state.previousInput = '';
  state.operator = null;
  state.shouldResetDisplay = false;
  updateDisplay('0');
  displayExpression.textContent = '';
  highlightActiveOperator(null);
}

/**
 * Removes the last character from the current input.
 */
function handleBackspace() {
  if (state.shouldResetDisplay) return; // Nothing to delete after equals
  if (state.currentInput.length <= 1 || state.currentInput === 'Error') {
    state.currentInput = '0';
  } else {
    state.currentInput = state.currentInput.slice(0, -1);
  }
  updateDisplay(state.currentInput);
}

/**
 * Converts the current input to a percentage (divides by 100).
 */
function handlePercent() {
  const value = parseFloat(state.currentInput);
  if (isNaN(value)) return;
  const result = formatResult(value / 100);
  state.currentInput = result;
  state.shouldResetDisplay = false;
  updateDisplay(result);
}

/**
 * Toggles the sign of the current input.
 */
function handleToggleSign() {
  const value = parseFloat(state.currentInput);
  if (isNaN(value) || value === 0) return;
  const result = formatResult(value * -1);
  state.currentInput = result;
  updateDisplay(result);
}

// ============================================================
// Operator Button Highlight
// ============================================================

/**
 * Highlights the active operator button (iOS-style).
 * Clears highlight from all operator buttons first.
 * @param {string|null} op
 */
function highlightActiveOperator(op) {
  document.querySelectorAll('.btn--operator').forEach((btn) => {
    btn.classList.remove('btn--operator-active');
  });
  if (op) {
    const btn = document.querySelector(`.btn--operator[data-operator="${op}"]`);
    if (btn) btn.classList.add('btn--operator-active');
  }
}

// ============================================================
// Visual Feedback — Keyboard Press Animation
// ============================================================

/**
 * Briefly adds the .active CSS class to a DOM button to simulate
 * a button-press animation when triggered by keyboard input.
 * @param {HTMLElement|null} btn
 */
function flashButton(btn) {
  if (!btn) return;
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 150);
}

/**
 * Finds the DOM button corresponding to a keyboard key and flashes it.
 * @param {string} key  The KeyboardEvent.key value
 */
function flashButtonForKey(key) {
  let btn = null;

  if (key >= '0' && key <= '9') {
    btn = document.querySelector(`[data-digit="${key}"]`);
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    btn = document.querySelector(`[data-operator="${key}"]`);
  } else if (key === 'Enter' || key === '=') {
    btn = document.querySelector('[data-action="equals"]');
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    btn = document.querySelector('[data-action="clear"]');
  } else if (key === 'Backspace') {
    btn = document.querySelector('[data-action="backspace"]');
  } else if (key === '.' || key === ',') {
    btn = document.querySelector('[data-action="decimal"]');
  } else if (key === '%') {
    btn = document.querySelector('[data-action="percent"]');
  }

  flashButton(btn);
}

// ============================================================
// Keyboard Input Handler
// ============================================================

/**
 * Maps keyboard events to calculator actions.
 * Skips events that include modifier keys (Ctrl, Alt, Meta) to
 * avoid interfering with browser shortcuts like Ctrl+R, Ctrl+C, etc.
 * @param {KeyboardEvent} event
 */
function handleKeyboard(event) {
  // Do not intercept browser shortcuts (Ctrl/Cmd/Alt combos)
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const key = event.key;

  // Flash the corresponding on-screen button
  flashButtonForKey(key);

  if (key >= '0' && key <= '9') {
    handleDigit(key);
  } else if (key === '+') {
    handleOperator('+');
  } else if (key === '-') {
    handleOperator('-');
  } else if (key === '*') {
    handleOperator('*');
  } else if (key === '/') {
    // Prevent the browser's Quick Find shortcut in Firefox
    event.preventDefault();
    handleOperator('/');
  } else if (key === 'Enter' || key === '=') {
    // Prevent form submission if ever inside a form
    event.preventDefault();
    handleEquals();
  } else if (key === 'Escape') {
    handleClear();
  } else if (key === 'c' || key === 'C') {
    handleClear();
  } else if (key === 'Backspace') {
    handleBackspace();
  } else if (key === '.' || key === ',') {
    handleDecimal();
  } else if (key === '%') {
    handlePercent();
  }
}

// ============================================================
// Click / Touch Event Delegation
// ============================================================

/**
 * Handles all button clicks via event delegation on the button grid.
 * @param {MouseEvent} event
 */
function handleButtonClick(event) {
  const btn = event.target.closest('button');
  if (!btn) return;

  const digit = btn.dataset.digit;
  const operator = btn.dataset.operator;
  const action = btn.dataset.action;

  if (digit !== undefined) {
    handleDigit(digit);
  } else if (operator) {
    handleOperator(operator);
  } else if (action) {
    switch (action) {
      case 'clear':
        handleClear();
        break;
      case 'backspace':
        handleBackspace();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'toggle-sign':
        handleToggleSign();
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'equals':
        handleEquals();
        break;
      default:
        break;
    }
  }
}

/**
 * Allows buttons to be activated via Enter or Space when focused
 * (for keyboard-only navigation using Tab to focus buttons).
 * The browser fires 'click' on Enter/Space for <button> elements
 * natively, so this is mainly for ensuring no double-fire issues.
 * We rely on the native behavior here.
 */

// ============================================================
// Initialisation
// ============================================================

function init() {
  // Attach click delegation to the button grid
  const grid = document.querySelector('.button-grid');
  if (grid) {
    grid.addEventListener('click', handleButtonClick);
  }

  // Attach keyboard listener to window
  window.addEventListener('keydown', handleKeyboard);

  // Initial display render
  updateDisplay(state.currentInput);
  updateExpressionDisplay();
}

document.addEventListener('DOMContentLoaded', init);
