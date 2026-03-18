// Hesap Makinesi Uygulaması

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
    memory: document.getElementById('memory-display'),
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
    }
}

// Temizleme
function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
    updateOperationDisplay();
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
    const current = parseFloat(currentInput);
    if (isNaN(current)) return;
    
    currentInput = (current / 100).toString();
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
    updateOperationDisplay();
    updateMemoryDisplay();
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
}

// Ekran güncelleme
function updateDisplay() {
    display.result.textContent = formatNumber(currentInput);
}

// İşlem ekranı güncelleme
function updateOperationDisplay() {
    if (previousInput && operation) {
        display.operation.textContent = `${formatNumber(previousInput)} ${operation}`;
    } else {
        display.operation.textContent = '';
    }
}

// Bellek göstergesi güncelleme
function updateMemoryDisplay() {
    if (display.memory) {
        display.memory.textContent = `Memory: ${formatNumber(memoryValue.toFixed(2))}`;
    }
}

// Sayı formatlama (binlik ayraç)
function formatNumber(num) {
    if (typeof num === 'string' && num.includes('hata')) return num;
    
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
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

// Test için expose
window.calculator = {
    getState: () => ({
        currentInput,
        previousInput,
        operation,
        memoryValue,
        shouldResetDisplay
    }),
    setInput: (val) => {
        currentInput = val;
        updateDisplay();
    },
    press: (key) => {
        const btn = document.querySelector(`[data-value="${key}"]`);
        if (btn) btn.click();
    },
    pressAction: (action) => {
        const btn = document.querySelector(`[data-action="${action}"]`);
        if (btn) btn.click();
    }
};
