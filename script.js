import {
    initialState,
    inputNumber,
    inputDecimal,
    setOperator,
    calculate,
    clear,
    backspace,
    toggleSign,
    percentage,
    getDisplayExpression,
} from './calculator-engine.js';

/** @type {import('./calculator-engine.js').CalcState} */
let state = { ...initialState };

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
};

/**
 * Update the display with current state
 */
function updateDisplay() {
    const displayValue = state.currentInput.replace('.', ',');
    display.result.textContent = displayValue;
    display.operation.textContent = getDisplayExpression(state);
}

/**
 * Handle button click events
 * @param {Event} event
 */
function handleButtonClick(event) {
    const button = event.target.closest('.btn');
    if (!button) return;

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        state = inputNumber(state, value);
    } else if (action) {
        handleAction(action);
    }

    updateDisplay();
}

/**
 * Handle action buttons
 * @param {string} action
 */
function handleAction(action) {
    switch (action) {
        case 'clear':
            state = clear();
            break;
        case 'backspace':
            state = backspace(state);
            break;
        case 'add':
            state = setOperator(state, '+');
            break;
        case 'subtract':
            state = setOperator(state, '-');
            break;
        case 'multiply':
            state = setOperator(state, '×');
            break;
        case 'divide':
            state = setOperator(state, '÷');
            break;
        case 'equals':
            state = calculate(state);
            break;
        case 'decimal':
            state = inputDecimal(state);
            break;
        case 'toggle-sign':
            state = toggleSign(state);
            break;
        case 'percent':
            state = percentage(state);
            break;
    }
}

/**
 * Handle keyboard events
 * @param {KeyboardEvent} event
 */
function handleKeyboard(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        state = inputNumber(state, key);
    } else if (key === '.') {
        state = inputDecimal(state);
    } else if (key === '+') {
        state = setOperator(state, '+');
    } else if (key === '-') {
        state = setOperator(state, '-');
    } else if (key === '*') {
        state = setOperator(state, '×');
    } else if (key === '/') {
        event.preventDefault();
        state = setOperator(state, '÷');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        state = calculate(state);
    } else if (key === 'Escape') {
        state = clear();
    } else if (key === 'Backspace') {
        state = backspace(state);
    } else if (key === '%') {
        state = percentage(state);
    }

    updateDisplay();
}

// Event delegation for button clicks
document.querySelector('.buttons')?.addEventListener('click', handleButtonClick);

// Keyboard support
document.addEventListener('keydown', handleKeyboard);

// Initial display
updateDisplay();

// Expose for testing
window.calculator = {
    getState: () => state,
    setState: (/** @type {import('./calculator-engine.js').CalcState} */ newState) => { state = newState; },
    inputNumber: (/** @type {string} */ num) => { state = inputNumber(state, num); updateDisplay(); },
    setOperator: (/** @type {string} */ op) => { state = setOperator(state, op); updateDisplay(); },
    calculate: () => { state = calculate(state); updateDisplay(); },
    clear: () => { state = clear(); updateDisplay(); },
};
