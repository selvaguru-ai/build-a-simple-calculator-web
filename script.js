/**
 * Calculator Application
 * A simple calculator with full keyboard and mouse support.
 */
class Calculator {
  constructor() {
    // Core state
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operator = null;
    this.shouldResetScreen = false;

    // Grab display elements
    this.currentOperandEl = document.querySelector('.current-operand');
    this.previousOperandEl = document.querySelector('.previous-operand');

    // Bind button click events
    this._bindButtonEvents();

    // Bind keyboard events
    this._bindKeyboardEvents();

    // Initial render
    this.updateDisplay();
  }

  // ---------------------------------------------------------------------------
  // Event Binding
  // ---------------------------------------------------------------------------

  /**
   * Attach click listeners to every calculator button.
   */
  _bindButtonEvents() {
    document.querySelectorAll('button[data-number]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.appendNumber(btn.dataset.number);
        this.updateDisplay();
      });
    });

    document.querySelectorAll('button[data-operator]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.chooseOperator(btn.dataset.operator);
        this.updateDisplay();
      });
    });

    const equalsBtn = document.querySelector('button[data-action="equals"]');
    if (equalsBtn) {
      equalsBtn.addEventListener('click', () => {
        this.calculate();
        this.updateDisplay();
      });
    }

    const clearBtn = document.querySelector('button[data-action="clear"]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clear();
        this.updateDisplay();
      });
    }

    const backspaceBtn = document.querySelector('button[data-action="backspace"]');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', () => {
        this.deleteLast();
        this.updateDisplay();
      });
    }

    const decimalBtn = document.querySelector('button[data-action="decimal"]');
    if (decimalBtn) {
      decimalBtn.addEventListener('click', () => {
        this.inputDecimal();
        this.updateDisplay();
      });
    }

    const toggleSignBtn = document.querySelector('button[data-action="toggle-sign"]');
    if (toggleSignBtn) {
      toggleSignBtn.addEventListener('click', () => {
        this.toggleSign();
        this.updateDisplay();
      });
    }
  }

  /**
   * Attach a single keydown listener on the document and map keys to
   * Calculator methods. Also triggers a 100ms visual highlight on the
   * corresponding DOM button.
   */
  _bindKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
      const key = event.key;

      // --- Digit keys 0-9 ---
      if (/^[0-9]$/.test(key)) {
        this._flashButton(`button[data-number="${key}"]`);
        this.appendNumber(key);
        this.updateDisplay();
        return;
      }

      // --- Operator keys ---
      if (['+', '-', '*'].includes(key)) {
        this._flashButton(`button[data-operator="${key}"]`);
        this.chooseOperator(key);
        this.updateDisplay();
        return;
      }

      // '/' opens browser quick-find on some browsers — prevent that
      if (key === '/') {
        event.preventDefault();
        this._flashButton('button[data-operator="/"]');
        this.chooseOperator('/');
        this.updateDisplay();
        return;
      }

      // --- Equals / Enter ---
      if (key === 'Enter' || key === '=') {
        // Prevent form submission if calculator is ever inside a form
        event.preventDefault();
        this._flashButton('button[data-action="equals"]');
        this.calculate();
        this.updateDisplay();
        return;
      }

      // --- Backspace ---
      if (key === 'Backspace') {
        this._flashButton('button[data-action="backspace"]');
        this.deleteLast();
        this.updateDisplay();
        return;
      }

      // --- Escape → Clear ---
      if (key === 'Escape') {
        this._flashButton('button[data-action="clear"]');
        this.clear();
        this.updateDisplay();
        return;
      }

      // --- Decimal point ('.' or ',') ---
      if (key === '.' || key === ',') {
        this._flashButton('button[data-action="decimal"]');
        this.inputDecimal();
        this.updateDisplay();
        return;
      }
    });
  }

  /**
   * Temporarily add a 'key-pressed' CSS class to the button matching
   * the given selector, then remove it after 100ms to give visual feedback.
   *
   * @param {string} selector - A CSS selector string for the target button.
   */
  _flashButton(selector) {
    const btn = document.querySelector(selector);
    if (!btn) return;

    btn.classList.add('key-pressed');
    setTimeout(() => {
      btn.classList.remove('key-pressed');
    }, 100);
  }

  // ---------------------------------------------------------------------------
  // Calculator Logic
  // ---------------------------------------------------------------------------

  /**
   * Append a digit character to the current operand string.
   * Respects the shouldResetScreen flag set after calculate().
   *
   * @param {string} number - A single digit character ('0'–'9').
   */
  appendNumber(number) {
    // If the display shows an error, reset before accepting new input
    if (this.currentOperand === 'Error') {
      this.currentOperand = '';
    }

    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    // Avoid multiple leading zeros
    if (number === '0' && this.currentOperand === '0') return;

    // Replace the initial '0' with the typed digit (unless it's '0' itself)
    if (this.currentOperand === '0' && number !== '0') {
      this.currentOperand = number;
      return;
    }

    this.currentOperand += number;
  }

  /**
   * Store the current operand and the chosen operator, ready for calculation.
   *
   * @param {string} op - One of '+', '-', '*', '/'.
   */
  chooseOperator(op) {
    if (this.currentOperand === 'Error') return;

    // If there is already a pending operation, calculate it first
    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.calculate();
    }

    this.operator = op;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  /**
   * Perform the pending calculation using previousOperand, operator, and
   * currentOperand. Sets currentOperand to the result string.
   * Division by zero results in 'Error'.
   */
  calculate() {
    if (this.operator === null || this.previousOperand === '') return;
    if (this.currentOperand === 'Error') return;

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    let result;

    switch (this.operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          // Division by zero — surface an error and reset state
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operator = null;
          this.shouldResetScreen = true;
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Convert result to string; avoid floating-point noise with toPrecision
    this.currentOperand = parseFloat(result.toPrecision(12)).toString();
    this.previousOperand = '';
    this.operator = null;
    this.shouldResetScreen = true;
  }

  /**
   * Reset the calculator to its initial state.
   */
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operator = null;
    this.shouldResetScreen = false;
  }

  /**
   * Toggle the sign of the current operand (positive ↔ negative).
   */
  toggleSign() {
    if (this.currentOperand === '0' || this.currentOperand === 'Error') return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
  }

  /**
   * Append a decimal point to the current operand if one is not already present.
   */
  inputDecimal() {
    if (this.currentOperand === 'Error') return;

    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }

    if (this.currentOperand.includes('.')) return;

    this.currentOperand += '.';
  }

  /**
   * Remove the last character from the current operand.
   * If only one character remains, reset to '0'.
   */
  deleteLast() {
    if (this.currentOperand === 'Error') {
      this.clear();
      return;
    }

    if (this.shouldResetScreen) return;

    if (this.currentOperand.length <= 1) {
      this.currentOperand = '0';
      return;
    }

    this.currentOperand = this.currentOperand.slice(0, -1);
  }

  // ---------------------------------------------------------------------------
  // Display
  // ---------------------------------------------------------------------------

  /**
   * Render the current state to the DOM.
   * Formats large numbers with locale-aware grouping separators while
   * preserving a trailing decimal point during live input.
   */
  updateDisplay() {
    if (!this.currentOperandEl || !this.previousOperandEl) return;

    this.currentOperandEl.textContent = this._formatNumber(this.currentOperand);

    if (this.operator && this.previousOperand !== '') {
      this.previousOperandEl.textContent =
        `${this._formatNumber(this.previousOperand)} ${this._operatorSymbol(this.operator)}`;
    } else {
      this.previousOperandEl.textContent = '';
    }
  }

  /**
   * Format a numeric string for display.
   * Passes 'Error' through unchanged.
   *
   * @param {string} numStr - The number string to format.
   * @returns {string} The formatted string.
   */
  _formatNumber(numStr) {
    if (numStr === 'Error') return 'Error';
    if (numStr === '' || numStr === '-') return numStr;

    const hasTrailingDot = numStr.endsWith('.');
    const [intPart, decPart] = numStr.split('.');

    const formattedInt = isNaN(intPart)
      ? intPart
      : parseInt(intPart, 10).toLocaleString('en-US');

    if (decPart !== undefined) {
      return `${formattedInt}.${decPart}`;
    }

    return hasTrailingDot ? `${formattedInt}.` : formattedInt;
  }

  /**
   * Return a display-friendly symbol for the stored operator.
   *
   * @param {string} op - Internal operator string.
   * @returns {string} Display symbol.
   */
  _operatorSymbol(op) {
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return map[op] || op;
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
