/**
 * Calculator - ES6 class encapsulating all calculator state and logic.
 *
 * State properties:
 *   currentOperand  {string}  - The number currently being entered/displayed
 *   previousOperand {string}  - The first operand stored after an operator is chosen
 *   operator        {string|null} - The pending arithmetic operator (+, -, *, /)
 *   shouldResetScreen {boolean} - When true, the next digit input clears the display first
 */
class Calculator {
  constructor() {
    // Grab DOM references once so we don't query on every update
    this.currentOperandEl  = document.querySelector('.current-operand');
    this.previousOperandEl = document.querySelector('.previous-operand');

    // Initialise state
    this.clear();
  }

  // ---------------------------------------------------------------------------
  // State mutators
  // ---------------------------------------------------------------------------

  /** Reset everything back to the initial default state. */
  clear() {
    this.currentOperand   = '0';
    this.previousOperand  = '';
    this.operator         = null;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  /**
   * Append a digit (0-9) to the current operand.
   * Prevents multiple leading zeros (e.g. '00' → stays '0').
   * If shouldResetScreen is true, replaces the display with the new digit.
   *
   * @param {string} number - A single digit character '0'–'9'
   */
  appendNumber(number) {
    // After pressing equals (or an operator that triggered calculate),
    // the next digit should start a fresh number.
    if (this.shouldResetScreen) {
      this.currentOperand   = '';
      this.shouldResetScreen = false;
    }

    // Prevent multiple leading zeros: '0' + '0' should stay '0'
    if (number === '0' && this.currentOperand === '0') return;

    // Replace the placeholder '0' with the first real digit
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }

    this.updateDisplay();
  }

  /**
   * Append a decimal point only if one is not already present in currentOperand.
   * If shouldResetScreen is true (e.g. right after equals), start a fresh '0.'.
   */
  inputDecimal() {
    if (this.shouldResetScreen) {
      this.currentOperand   = '0';
      this.shouldResetScreen = false;
    }

    if (this.currentOperand.includes('.')) return;

    this.currentOperand += '.';
    this.updateDisplay();
  }

  /**
   * Store the current operand as the previous operand and record the operator.
   * Handles chained operations: if an operator is already pending, compute the
   * intermediate result first before storing the new operator.
   *
   * @param {string} op - One of '+', '-', '*', '/'
   */
  chooseOperator(op) {
    // Don't allow chaining on an error state
    if (this.currentOperand === 'Error') return;

    // If we already have a pending operator AND the user hasn't just pressed
    // another operator (shouldResetScreen means they haven't typed a new number
    // yet), compute the intermediate result first.
    if (this.operator !== null && !this.shouldResetScreen) {
      this.calculate();
      // calculate() may have produced 'Error'; bail out if so
      if (this.currentOperand === 'Error') return;
    }

    this.previousOperand  = this.currentOperand;
    this.operator         = op;
    this.shouldResetScreen = true; // next digit starts a fresh number
    this.updateDisplay();
  }

  /**
   * Perform the arithmetic operation.
   * Uses parseFloat for both operands and rounds to 12 significant figures
   * to avoid floating-point precision artefacts (e.g. 0.1 + 0.2).
   * Division by zero sets currentOperand to 'Error' and resets state.
   */
  calculate() {
    if (this.operator === null || this.previousOperand === '') return;

    const prev    = parseFloat(this.previousOperand);
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
          // Division by zero — show error and reset operator state
          this.currentOperand   = 'Error';
          this.previousOperand  = '';
          this.operator         = null;
          this.shouldResetScreen = true;
          this.updateDisplay();
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Round to 12 significant figures to eliminate floating-point noise
    this.currentOperand   = String(parseFloat(result.toPrecision(12)));
    this.previousOperand  = '';
    this.operator         = null;
    this.shouldResetScreen = true; // next digit starts fresh after a result
    this.updateDisplay();
  }

  /**
   * Remove the last character from currentOperand.
   * If only one character remains (or the display shows 'Error'), reset to '0'.
   */
  deleteLast() {
    if (this.shouldResetScreen) return; // don't delete a just-computed result
    if (this.currentOperand === 'Error' || this.currentOperand.length <= 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  /**
   * Toggle the sign of the current operand (positive ↔ negative).
   * Has no effect on '0' or 'Error'.
   */
  toggleSign() {
    if (this.currentOperand === '0' || this.currentOperand === 'Error') return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
    this.updateDisplay();
  }

  // ---------------------------------------------------------------------------
  // DOM update
  // ---------------------------------------------------------------------------

  /**
   * Reflect the current state onto the DOM.
   * previousOperand span shows the stored operand + operator (if any).
   * currentOperand span shows the number being entered / the result.
   */
  updateDisplay() {
    this.currentOperandEl.textContent = this.currentOperand;

    if (this.operator !== null && this.previousOperand !== '') {
      // Show the operator symbol next to the previous operand
      const displayOp = this.operator === '*' ? '×' : this.operator === '/' ? '÷' : this.operator;
      this.previousOperandEl.textContent = `${this.previousOperand} ${displayOp}`;
    } else {
      this.previousOperandEl.textContent = this.previousOperand;
    }
  }
}

// ---------------------------------------------------------------------------
// Bootstrap — wire up event listeners once the DOM is ready
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const calculator = new Calculator();

  // ---- Button click listeners --------------------------------------------

  document.querySelectorAll('button[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const value  = button.dataset.value;

      switch (action) {
        case 'number':
          calculator.appendNumber(value);
          break;
        case 'operator':
          calculator.chooseOperator(value);
          break;
        case 'equals':
          calculator.calculate();
          break;
        case 'clear':
          calculator.clear();
          break;
        case 'delete':
          calculator.deleteLast();
          break;
        case 'decimal':
          calculator.inputDecimal();
          break;
        case 'toggle-sign':
          calculator.toggleSign();
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    });
  });

  // ---- Keyboard listeners ------------------------------------------------

  document.addEventListener('keydown', (e) => {
    // Prevent default for keys we handle (avoids page scroll on Space, etc.)
    const handled = [
      '0','1','2','3','4','5','6','7','8','9',
      '+','-','*','/','.','Enter','Backspace','Escape','Delete','%'
    ];
    if (handled.includes(e.key)) e.preventDefault();

    if (e.key >= '0' && e.key <= '9') {
      calculator.appendNumber(e.key);
    } else if (e.key === '.') {
      calculator.inputDecimal();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      calculator.chooseOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      calculator.calculate();
    } else if (e.key === 'Backspace') {
      calculator.deleteLast();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
      calculator.clear();
    }
  });
});
