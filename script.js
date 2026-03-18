// Hesap Makinesi Uygulaması
// Display logic module integration

/* global window */

import {
    formatDisplayValue,
    formatOperationDisplay,
    formatNumberWithCommas,
    handleBackspace,
    toggleSign as toggleSignLogic,
    appendDigit,
    appendDecimal,
    calculateFontSize,
    createDisplayState,
    clearDisplayState,
} from './display-logic.js';

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
};

let state = createDisplayState();

// Buton olaylarını dinle
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Klavye olaylarını dinle
document.addEventListener('keydown', handleKeyboard);

// Buton tıklama işleyicisi
function handleButtonClick(event) {
    const button = event.target.closest('.btn');
    if (!button) return;
    
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        handleNumberInput(value);
    } else if (action) {
        handleAction(action);
    }
}

// Sayı girişi
function handleNumberInput(value) {
    state.currentInput = appendDigit(
        state.currentInput,
        value,
        state.shouldResetDisplay
    );
    state.shouldResetDisplay = false;
    updateDisplay();
}

// İşlem işleyicisi
function handleAction(action) {
    switch (action) {
        case 'clear':
            clearCalculator();
            break;
        case 'backspace':
            backspace();
            break;
        case 'add':
            setOperation('+');
            break;
        case 'subtract':
            setOperation('-');
            break;
        case 'multiply':
            setOperation('×');
            break;
        case 'divide':
            setOperation('÷');
            break;
        case 'equals':
            calculate();
            break;
        case 'decimal':
            addDecimal();
            break;
        case 'toggle-sign':
            toggleSign();
            break;
    }
}

// Temizleme - resets both current operand and operation
function clearCalculator() {
    state = clearDisplayState();
    updateDisplay();
}

// Geri silme - removes last character
function backspace() {
    if (state.shouldResetDisplay) return;
    
    state.currentInput = handleBackspace(state.currentInput);
    updateDisplay();
}

// İşlem belirleme
function setOperation(op) {
    if (state.operation && !state.shouldResetDisplay) {
        calculate();
    }
    state.previousInput = state.currentInput;
    state.operation = op;
    state.shouldResetDisplay = true;
    updateOperationDisplay();
}

// Hesaplama
function calculate() {
    if (state.operation === null || state.shouldResetDisplay) return;

    const prev = parseFloat(state.previousInput);
    const current = parseFloat(state.currentInput);
    let result;

    if (isNaN(prev) || isNaN(current)) return;

    switch (state.operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                showError('Sıfıra bölme hatası');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Ondalık kontrolü
    if (!Number.isInteger(result)) {
        result = parseFloat(result.toFixed(10));
    }

    state.currentInput = result.toString();
    state.operation = null;
    state.shouldResetDisplay = true;
    updateDisplay();
    display.operation.textContent = '';
}

// Ondalık ekleme - only one per number
function addDecimal() {
    if (state.shouldResetDisplay) {
        state.currentInput = '0';
        state.shouldResetDisplay = false;
    }
    state.currentInput = appendDecimal(state.currentInput);
    updateDisplay();
}

// İşaret değiştirme
function toggleSign() {
    state.currentInput = toggleSignLogic(state.currentInput);
    updateDisplay();
}

// Hata gösterimi
function showError(message) {
    display.result.textContent = message;
    state.currentInput = '0';
    state.previousInput = '';
    state.operation = null;
    state.shouldResetDisplay = true;
}

// Ekran güncelleme - JetBrains Mono 48px with overflow handling
function updateDisplay() {
    const formattedValue = formatDisplayValue(state.currentInput);
    display.result.textContent = formatNumberWithCommas(formattedValue);
    
    // Dynamic font size for overflow handling
    const fontSize = calculateFontSize(formattedValue, 48, 24);
    display.result.style.fontSize = `${fontSize}px`;
}

// İşlem ekranı güncelleme - 24px font
function updateOperationDisplay() {
    display.operation.textContent = formatOperationDisplay(
        state.previousInput,
        state.operation
    );
}

// Klavye işleyicisi
function handleKeyboard(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        handleNumberInput(key);
    } else if (key === '.') {
        addDecimal();
    } else if (key === '+') {
        setOperation('+');
    } else if (key === '-') {
        setOperation('-');
    } else if (key === '*') {
        setOperation('×');
    } else if (key === '/') {
        setOperation('÷');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearCalculator();
    } else if (key === 'Backspace') {
        backspace();
    }
}

// İlk ekran güncelleme
updateDisplay();

// Expose functions for testing
if (typeof window !== 'undefined') {
    window.calculatorDisplay = {
        getState: () => ({ ...state }),
        setState: (newState) => { state = { ...newState }; },
        updateDisplay,
        updateOperationDisplay,
    };
}