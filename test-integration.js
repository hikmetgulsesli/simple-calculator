// Integration Tests for Calculator
const { describe, it, before } = require('node:test');
const assert = require('node:assert');

// Simple DOM simulation for testing
class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.textContent = '';
        this.dataset = {};
        this.className = '';
        this.eventListeners = {};
        this.attributes = {};
    }

    addEventListener(event, handler) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(handler);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    classList = {
        classes: new Set(),
        add: function(cls) { this.classes.add(cls); },
        remove: function(cls) { this.classes.delete(cls); },
        contains: function(cls) { return this.classes.has(cls); }
    };

    querySelector() { return null; }
    querySelectorAll() { return []; }
}

class MockDocument {
    constructor() {
        this.elements = {
            operation: new MockElement('div'),
            result: new MockElement('div'),
            'memory-status': new MockElement('span'),
        };
        this.buttons = [];
        this.eventListeners = {};
    }

    getElementById(id) {
        return this.elements[id] || null;
    }

    querySelector(selector) {
        if (selector.startsWith('button[')) {
            const match = selector.match(/data-(\w+)="([^"]+)"/);
            if (match) {
                const [, type, value] = match;
                return this.buttons.find(b => b.dataset[type] === value) || null;
            }
        }
        return null;
    }

    querySelectorAll(selector) {
        if (selector === '.btn') {
            return this.buttons;
        }
        return [];
    }

    addEventListener(event, handler) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(handler);
    }

    triggerKeydown(key) {
        const event = { key, preventDefault: () => {} };
        if (this.eventListeners['keydown']) {
            this.eventListeners['keydown'].forEach(h => h(event));
        }
    }
}

// Mock DOM globals
global.document = new MockDocument();
global.window = { render_game_to_text: null, advanceTime: null };

// Load calculator script
const fs = require('fs');
const path = require('path');

// Read and evaluate script
const scriptPath = path.join(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Mock timer for animations
global.setTimeout = (fn) => fn();

describe('Integration Tests', () => {
    before(() => {
        // Setup mock buttons
        const buttonConfigs = [
            { action: 'clear' }, { action: 'backspace' }, { action: 'percent' }, { action: 'divide' },
            { value: '7' }, { value: '8' }, { value: '9' }, { action: 'multiply' },
            { value: '4' }, { value: '5' }, { value: '6' }, { action: 'subtract' },
            { value: '1' }, { value: '2' }, { value: '3' }, { action: 'add' },
            { action: 'toggle-sign' }, { value: '0' }, { action: 'decimal' }, { action: 'equals' },
        ];

        buttonConfigs.forEach(config => {
            const btn = new MockElement('button');
            btn.dataset = config;
            btn.classList.classes.add('btn');
            global.document.buttons.push(btn);
        });

        // Execute script
        eval(scriptContent);
    });

    describe('Button Grid Layout', () => {
        it('should have 20 buttons in 4x5 grid configuration', () => {
            assert.strictEqual(global.document.buttons.length, 20);
        });

        it('should have all required button types', () => {
            const actions = global.document.buttons
                .filter(b => b.dataset.action)
                .map(b => b.dataset.action);
            const values = global.document.buttons
                .filter(b => b.dataset.value)
                .map(b => b.dataset.value);

            assert(actions.includes('clear'));
            assert(actions.includes('backspace'));
            assert(actions.includes('percent'));
            assert(actions.includes('equals'));
            assert(values.includes('0'));
            assert(values.includes('9'));
        });
    });

    describe('Number Input', () => {
        it('should add numbers to display when clicked', () => {
            // Clear first
            global.document.triggerKeydown('Escape');

            // Click 1, 2, 3
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('2');
            global.document.triggerKeydown('3');

            assert.strictEqual(global.document.elements.result.textContent, '123');
        });

        it('should handle zero correctly', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('0');
            global.document.triggerKeydown('0');

            assert.strictEqual(global.document.elements.result.textContent, '0');
        });
    });

    describe('Operator Display', () => {
        it('should show operation when operator is selected', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('+');

            assert.strictEqual(global.document.elements.operation.textContent, '5 +');
        });
    });

    describe('Calculation', () => {
        it('should calculate addition correctly', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('+');
            global.document.triggerKeydown('3');
            global.document.triggerKeydown('Enter');

            assert.strictEqual(global.document.elements.result.textContent, '8');
        });

        it('should calculate multiplication correctly', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('4');
            global.document.triggerKeydown('*');
            global.document.triggerKeydown('2');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('Enter');

            assert.strictEqual(global.document.elements.result.textContent, '100');
        });

        it('should handle division by zero', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('/');
            global.document.triggerKeydown('0');
            global.document.triggerKeydown('Enter');

            assert.strictEqual(global.document.elements.result.textContent, 'Sıfıra bölme hatası');
        });
    });

    describe('Clear Function', () => {
        it('should reset calculator completely', () => {
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('+');
            global.document.triggerKeydown('2');
            global.document.triggerKeydown('Escape');

            assert.strictEqual(global.document.elements.result.textContent, '0');
            assert.strictEqual(global.document.elements.operation.textContent, '');
        });
    });

    describe('Backspace', () => {
        it('should remove single character', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('2');
            global.document.triggerKeydown('3');
            global.document.triggerKeydown('Backspace');

            assert.strictEqual(global.document.elements.result.textContent, '12');
        });

        it('should reset to zero when last digit removed', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('Backspace');

            assert.strictEqual(global.document.elements.result.textContent, '0');
        });
    });

    describe('Percent Operation', () => {
        it('should calculate percent correctly', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('0');
            global.document.triggerKeydown('%');

            assert.strictEqual(global.document.elements.result.textContent, '0.5');
        });
    });

    describe('Decimal Input', () => {
        it('should handle decimal points', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('.');
            global.document.triggerKeydown('5');

            assert.strictEqual(global.document.elements.result.textContent, '1.5');
        });

        it('should prevent multiple decimal points', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('.');
            global.document.triggerKeydown('.');
            global.document.triggerKeydown('5');

            assert.strictEqual(global.document.elements.result.textContent, '1.5');
        });
    });

    describe('Toggle Sign', () => {
        it('should toggle positive to negative', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('5');

            // Simulate toggle sign
            const toggleBtn = global.document.buttons.find(b => b.dataset.action === 'toggle-sign');
            if (toggleBtn && toggleBtn.eventListeners['click']) {
                toggleBtn.eventListeners['click'][0]({ currentTarget: toggleBtn });
            }

            assert.strictEqual(global.document.elements.result.textContent, '-5');
        });
    });

    describe('No Placeholder Text', () => {
        it('should not contain TODO placeholders', () => {
            const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
            const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

            assert(!htmlContent.includes('TODO'), 'HTML should not contain TODO');
            assert(!jsContent.includes('TODO'), 'JS should not contain TODO');
            assert(!htmlContent.includes('Coming soon'), 'HTML should not contain Coming soon');
        });
    });

    describe('Number Formatting', () => {
        it('should format large numbers with commas', () => {
            global.document.triggerKeydown('Escape');
            global.document.triggerKeydown('1');
            global.document.triggerKeydown('2');
            global.document.triggerKeydown('3');
            global.document.triggerKeydown('4');
            global.document.triggerKeydown('5');
            global.document.triggerKeydown('6');
            global.document.triggerKeydown('7');

            assert(global.document.elements.result.textContent.includes(','));
        });
    });
});

describe('End-to-End Verification', () => {
    it('should perform complete calculation workflow', () => {
        // Reset
        global.document.triggerKeydown('Escape');
        assert.strictEqual(global.document.elements.result.textContent, '0');

        // Enter 1234.56
        global.document.triggerKeydown('1');
        global.document.triggerKeydown('2');
        global.document.triggerKeydown('3');
        global.document.triggerKeydown('4');
        global.document.triggerKeydown('.');
        global.document.triggerKeydown('5');
        global.document.triggerKeydown('6');

        assert.strictEqual(global.document.elements.result.textContent, '1,234.56');

        // Multiply by 2
        global.document.triggerKeydown('*');
        assert.strictEqual(global.document.elements.operation.textContent, '1,234.56 ×');

        global.document.triggerKeydown('2');
        global.document.triggerKeydown('Enter');

        assert.strictEqual(global.document.elements.result.textContent, '2,469.12');
        assert.strictEqual(global.document.elements.operation.textContent, '');
    });
});
