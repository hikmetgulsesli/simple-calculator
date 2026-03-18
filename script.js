// Hesap Makinesi Uygulaması

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
};

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

// Buton olaylarını dinle
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Klavye olaylarını dinle
document.addEventListener('keydown', handleKeyboard);

// Buton tıklama işleyicisi
function handleButtonClick(event) {
    const button = event.target;
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
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
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

// Klavye işleyicisi
function handleKeyboard(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        handleNumberInput(key);
        highlightButtonByValue(key);
    } else if (key === '.') {
        addDecimal();
        highlightButtonByAction('decimal');
    } else if (key === '+') {
        setOperation('+');
        highlightButtonByAction('add');
    } else if (key === '-') {
        setOperation('-');
        highlightButtonByAction('subtract');
    } else if (key === '*') {
        setOperation('×');
        highlightButtonByAction('multiply');
    } else if (key === '/') {
        setOperation('÷');
        highlightButtonByAction('divide');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
        highlightButtonByAction('equals');
    } else if (key === 'Escape') {
        clearCalculator();
        highlightButtonByAction('clear');
    } else if (key === 'Backspace') {
        backspace();
        highlightButtonByAction('backspace');
    }
}

// Buton görsel geri bildirimi - data-value ile
function highlightButtonByValue(value) {
    const button = document.querySelector(`.btn[data-value="${value}"]`);
    if (button) {
        highlightButton(button);
    }
}

// Buton görsel geri bildirimi - data-action ile
function highlightButtonByAction(action) {
    const button = document.querySelector(`.btn[data-action="${action}"]`);
    if (button) {
        highlightButton(button);
    }
}

// Butona geçici highlight sınıfı ekle
function highlightButton(button) {
    button.classList.add('key-active');
    setTimeout(() => {
        button.classList.remove('key-active');
    }, 100);
}

// İlk ekran güncelleme
updateDisplay();
