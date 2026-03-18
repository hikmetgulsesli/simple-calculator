// Hesap Makinesi Uygulaması

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
    memory: document.getElementById('memory'),
};

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;
let memoryValue = 0;

// Buton olaylarını dinle
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Klavye olaylarını dinle
document.addEventListener('keydown', handleKeyboard);

// Buton tıklama işleyicisi
function handleButtonClick(event) {
    const button = event.currentTarget;
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
    if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? value : currentInput + value;
    }
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
        case 'percent':
            calculatePercent();
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
        case 'settings':
            // Settings placeholder - could toggle theme, etc.
            console.log('Settings clicked');
            break;
    }
}

// Temizleme
function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
    display.operation.textContent = '';
}

// Geri silme
function backspace() {
    if (shouldResetDisplay) return;
    
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Yüzde hesaplama
function calculatePercent() {
    const value = parseFloat(currentInput);
    if (isNaN(value)) return;
    currentInput = (value / 100).toString();
    updateDisplay();
}

// İşlem belirleme
function setOperation(op) {
    if (operation && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
    updateOperationDisplay();
}

// Hesaplama
function calculate() {
    if (operation === null || shouldResetDisplay) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
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

    currentInput = result.toString();
    memoryValue = result;
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
    updateMemoryDisplay();
    display.operation.textContent = '';
}

// Ondalık ekleme
function addDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// İşaret değiştirme
function toggleSign() {
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
    } else {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

// Hata gösterimi
function showError(message) {
    display.result.textContent = message;
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = true;
    setTimeout(() => {
        display.result.textContent = '0';
    }, 2000);
}

// Ekran güncelleme
function updateDisplay() {
    display.result.textContent = currentInput;
}

// İşlem ekranı güncelleme
function updateOperationDisplay() {
    if (previousInput && operation) {
        display.operation.textContent = `${previousInput} ${operation}`;
    }
}

// Hafıza gösterimi güncelleme
function updateMemoryDisplay() {
    if (display.memory) {
        display.memory.textContent = parseFloat(memoryValue).toFixed(2);
    }
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
        event.preventDefault();
        setOperation('÷');
    } else if (key === '%') {
        calculatePercent();
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
updateMemoryDisplay();
