// Hesap Makinesi Uygulaması - Integration

const display = {
    operation: document.getElementById('operation'),
    result: document.getElementById('result'),
    memory: document.getElementById('memory-status'),
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
    const button = event.currentTarget;
    const value = button.dataset.value;
    const action = button.dataset.action;

    // Tıklama animasyonu
    animateButton(button);

    if (value !== undefined) {
        handleNumberInput(value);
    } else if (action) {
        handleAction(action);
    }
}

// Buton animasyonu
function animateButton(button) {
    button.classList.add('key-active');
    setTimeout(() => {
        button.classList.remove('key-active');
    }, 100);
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
        case 'percent':
            percent();
            break;
        case 'settings':
            // Settings placeholder - no action for now
            break;
    }
}

// Temizleme
function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    display.operation.textContent = '';
    updateDisplay();
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

// Yüzde
function percent() {
    const value = parseFloat(currentInput);
    if (isNaN(value)) return;
    currentInput = (value / 100).toString();
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
    }
}

// Sayı formatlama (binlik ayraç)
function formatNumber(numStr) {
    if (numStr === 'Sıfıra bölme hatası') return numStr;

    const isNegative = numStr.startsWith('-');
    const absolute = isNegative ? numStr.slice(1) : numStr;

    const parts = absolute.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (isNegative ? '-' : '') + formattedInteger + (decimalPart ? '.' + decimalPart : '');
}

// Klavye işleyicisi
function handleKeyboard(event) {
    const key = event.key;

    // Klavye buton vurgulama
    if (key >= '0' && key <= '9') {
        highlightButtonByValue(key);
        handleNumberInput(key);
    } else if (key === '.') {
        highlightButtonByAction('decimal');
        addDecimal();
    } else if (key === '+') {
        highlightButtonByAction('add');
        setOperation('+');
    } else if (key === '-') {
        highlightButtonByAction('subtract');
        setOperation('-');
    } else if (key === '*') {
        highlightButtonByAction('multiply');
        setOperation('×');
    } else if (key === '/') {
        highlightButtonByAction('divide');
        setOperation('÷');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        highlightButtonByAction('equals');
        calculate();
    } else if (key === 'Escape') {
        highlightButtonByAction('clear');
        clearCalculator();
    } else if (key === 'Backspace') {
        highlightButtonByAction('backspace');
        backspace();
    } else if (key === '%') {
        highlightButtonByAction('percent');
        percent();
    }
}

// Buton vurgulama - değer ile
function highlightButtonByValue(value) {
    const button = document.querySelector(`button[data-value="${value}"]`);
    if (button) animateButton(button);
}

// Buton vurgulama - aksiyon ile
function highlightButtonByAction(action) {
    const button = document.querySelector(`button[data-action="${action}"]`);
    if (button) animateButton(button);
}

// İlk ekran güncelleme
updateDisplay();
