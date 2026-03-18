/**
 * Klavye desteği testleri
 * US-005: Keyboard support
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Test sonuçları
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        passedTests++;
    } else {
        console.error(`✗ ${message}`);
        failedTests++;
    }
}

function test(name, fn) {
    try {
        console.log(`\nTest: ${name}`);
        fn();
    } catch (error) {
        console.error(`✗ ${name} - Exception: ${error.message}`);
        failedTests++;
    }
}

// HTML ve JS dosyalarını yükle
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// JSDOM ile sanal bir tarayıcı ortamı oluştur
const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost'
});

const window = dom.window;
const document = window.document;

// Script'i değerlendir
try {
    window.eval(script);
} catch (e) {
    console.error('Script evaluation error:', e.message);
    process.exit(1);
}

// Test suite
console.log('=== US-005: Keyboard Support Tests ===\n');

// Test 1: Sayı tuşları (0-9) çalışıyor mu
test('Number keys (0-9) input numbers', () => {
    const display = document.getElementById('result');
    
    // Her sayı tuşunu test et
    for (let i = 0; i <= 9; i++) {
        // Temizle
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
        
        // Sayı tuşuna bas
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: String(i) }));
        
        assert(display.textContent === String(i), `Key ${i} inputs ${i}`);
    }
});

// Test 2: Operatör tuşları çalışıyor mu
test('Operator keys (+, -, *, /) input operators', () => {
    const operationDisplay = document.getElementById('operation');
    
    // Test addition
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '+' }));
    assert(operationDisplay.textContent.includes('+'), 'Key + inputs addition operator');
    
    // Test subtraction
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '-' }));
    assert(operationDisplay.textContent.includes('-'), 'Key - inputs subtraction operator');
    
    // Test multiplication
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '*' }));
    assert(operationDisplay.textContent.includes('×'), 'Key * inputs multiplication operator');
    
    // Test division
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '/' }));
    assert(operationDisplay.textContent.includes('÷'), 'Key / inputs division operator');
});

// Test 3: Enter tuşu hesaplama yapıyor mu
test('Enter key triggers calculation', () => {
    const display = document.getElementById('result');
    const operationDisplay = document.getElementById('operation');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '+' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '3' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter' }));
    
    assert(display.textContent === '8', 'Enter calculates 5 + 3 = 8');
    assert(operationDisplay.textContent === '', 'Operation display clears after calculation');
});

// Test 4: Escape tuşu temizliyor mu
test('Escape key triggers clear', () => {
    const display = document.getElementById('result');
    const operationDisplay = document.getElementById('operation');
    
    // Temizle ve yeni bir hesaplama başlat
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '+' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '3' }));
    
    // Escape ile temizle
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    
    assert(display.textContent === '0', 'Escape clears display to 0');
    assert(operationDisplay.textContent === '', 'Escape clears operation display');
});

// Test 5: Backspace son karakteri siliyor mu
test('Backspace key deletes last character', () => {
    const display = document.getElementById('result');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '1' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '2' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '3' }));
    
    assert(display.textContent === '123', 'Display shows 123');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Backspace' }));
    
    assert(display.textContent === '12', 'Backspace deletes last character (123 -> 12)');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Backspace' }));
    assert(display.textContent === '1', 'Backspace deletes again (12 -> 1)');
});

// Test 6: Visual feedback - buton highlight
test('Visual feedback on keypress (button highlight)', () => {
    const button = document.querySelector('.btn[data-value="5"]');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    
    // setTimeout ile highlight sınıfının eklendiğini kontrol et
    setTimeout(() => {
        const hasKeyActive = button.classList.contains('key-active');
        assert(hasKeyActive, 'Button has key-active class immediately after keypress');
    }, 10);
    
    // 150ms sonra highlight kaldırılmalı
    setTimeout(() => {
        const hasKeyActive = button.classList.contains('key-active');
        assert(!hasKeyActive, 'key-active class removed after timeout');
    }, 150);
});

// Test 7: Nokta tuşu çalışıyor mu
test('Decimal key (.) adds decimal point', () => {
    const display = document.getElementById('result');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '.' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5' }));
    
    assert(display.textContent === '5.5', 'Decimal key inputs decimal point');
});

// Test 8: Eşittir tuşu (=) da hesaplama yapıyor mu
test('Equals key (=) triggers calculation', () => {
    const display = document.getElementById('result');
    
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '2' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '*' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '4' }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: '=' }));
    
    assert(display.textContent === '8', 'Equals key calculates 2 * 4 = 8');
});

// Test sonuçlarını özetle
setTimeout(() => {
    console.log('\n=== Test Summary ===');
    console.log(`Total: ${passedTests + failedTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    
    if (failedTests > 0) {
        process.exit(1);
    }
}, 200);
