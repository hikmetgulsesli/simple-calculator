/**
 * @typedef {Object} CalcState
 * @property {string} currentInput
 * @property {string} expression
 * @property {boolean} shouldResetDisplay
 * @property {string|null} lastOperator
 * @property {number|null} lastOperand
 */

/** @type {CalcState} */
export const initialState = {
    currentInput: '0',
    expression: '',
    shouldResetDisplay: false,
    lastOperator: null,
    lastOperand: null,
};

/**
 * Format number for display with thousands separators
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
    if (!Number.isFinite(num)) return 'Error';
    if (Math.abs(num) > 1e15) return num.toExponential(10);
    
    const str = num.toString();
    if (str.includes('e')) return str;
    
    const [intPart, decPart] = str.split('.');
    const formattedInt = parseInt(intPart, 10).toLocaleString('tr-TR');
    
    return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
}

/**
 * Parse display number to actual number
 * @param {string} str
 * @returns {number}
 */
export function parseDisplayNumber(str) {
    // Handle Turkish number format (1.234,56)
    const normalized = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
}

/**
 * Check if a character is an operator
 * @param {string} char
 * @returns {boolean}
 */
function isOperator(char) {
    return ['+', '-', '×', '÷', '*', '/'].includes(char);
}

/**
 * Get operator precedence (higher = evaluated first)
 * @param {string} op
 * @returns {number}
 */
function getPrecedence(op) {
    switch (op) {
        case '+':
        case '-':
            return 1;
        case '×':
        case '÷':
        case '*':
        case '/':
            return 2;
        default:
            return 0;
    }
}

/**
 * Normalize operator symbols for evaluation
 * @param {string} op
 * @returns {string}
 */
function normalizeOperator(op) {
    switch (op) {
        case '×':
            return '*';
        case '÷':
            return '/';
        default:
            return op;
    }
}

/**
 * Tokenize expression into numbers and operators
 * @param {string} expression
 * @returns {Array<{type: 'number'|'operator', value: string}>}
 */
function tokenize(expression) {
    const tokens = [];
    let currentNumber = '';
    
    // Remove all spaces first for easier parsing
    const cleanExpr = expression.replace(/\s+/g, '');
    
    for (let i = 0; i < cleanExpr.length; i++) {
        const char = cleanExpr[i];
        const prevChar = i > 0 ? cleanExpr[i - 1] : null;
        
        // Check if this is a minus sign for a negative number
        // Only if it's at the start or right after another operator (but not after a number)
        const isNegativeSign = char === '-' && (
            i === 0 || 
            isOperator(prevChar)
        );
        
        if (isOperator(char) && !isNegativeSign) {
            if (currentNumber !== '') {
                tokens.push({ type: 'number', value: currentNumber });
                currentNumber = '';
            }
            tokens.push({ type: 'operator', value: char });
        } else {
            currentNumber += char;
        }
    }
    
    if (currentNumber !== '') {
        tokens.push({ type: 'number', value: currentNumber });
    }
    
    return tokens;
}

/**
 * Evaluate expression with proper operator precedence (Shunting Yard algorithm)
 * @param {string} expression
 * @returns {{result: number|null, error: string|null}}
 */
export function evaluate(expression) {
    if (!expression || expression.trim() === '') {
        return { result: null, error: null };
    }
    
    // Check for division by zero
    const divByZeroPattern = /÷\s*0+(?:\.|,0*)?(?![0-9])/;
    if (divByZeroPattern.test(expression)) {
        return { result: null, error: 'Sıfıra bölme hatası' };
    }
    
    const tokens = tokenize(expression);
    
    if (tokens.length === 0) {
        return { result: null, error: null };
    }
    
    // Single number
    if (tokens.length === 1 && tokens[0].type === 'number') {
        return { result: parseFloat(tokens[0].value), error: null };
    }
    
    // Shunting Yard to convert to RPN
    const output = [];
    const operators = [];
    
    for (const token of tokens) {
        if (token.type === 'number') {
            output.push(parseFloat(token.value));
        } else if (token.type === 'operator') {
            const op = token.value;
            const precedence = getPrecedence(op);
            
            while (
                operators.length > 0 &&
                getPrecedence(operators[operators.length - 1]) >= precedence
            ) {
                output.push(operators.pop());
            }
            operators.push(op);
        }
    }
    
    while (operators.length > 0) {
        output.push(operators.pop());
    }
    
    // Evaluate RPN
    const stack = [];
    
    for (const item of output) {
        if (typeof item === 'number') {
            stack.push(item);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            if (a === undefined || b === undefined) {
                return { result: null, error: 'Geçersiz ifade' };
            }
            
            const normOp = normalizeOperator(item);
            let result;
            
            switch (normOp) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) {
                        return { result: null, error: 'Sıfıra bölme hatası' };
                    }
                    result = a / b;
                    break;
                default:
                    return { result: null, error: 'Bilinmeyen işlem' };
            }
            
            stack.push(result);
        }
    }
    
    if (stack.length !== 1) {
        return { result: null, error: 'Geçersiz ifade' };
    }
    
    // Clean up floating point errors
    let finalResult = stack[0];
    if (!Number.isInteger(finalResult)) {
        finalResult = parseFloat(finalResult.toFixed(10));
    }
    
    return { result: finalResult, error: null };
}

/**
 * Add number to current input
 * @param {CalcState} state
 * @param {string} num
 * @returns {CalcState}
 */
export function inputNumber(state, num) {
    if (state.shouldResetDisplay) {
        return {
            ...state,
            currentInput: num,
            shouldResetDisplay: false,
        };
    }
    
    if (state.currentInput === '0') {
        return {
            ...state,
            currentInput: num,
        };
    }
    
    // Limit input length
    if (state.currentInput.replace(/[.,]/g, '').length >= 15) {
        return state;
    }
    
    return {
        ...state,
        currentInput: state.currentInput + num,
    };
}

/**
 * Add decimal point
 * @param {CalcState} state
 * @returns {CalcState}
 */
export function inputDecimal(state) {
    if (state.shouldResetDisplay) {
        return {
            ...state,
            currentInput: '0,',
            shouldResetDisplay: false,
        };
    }
    
    if (!state.currentInput.includes(',')) {
        return {
            ...state,
            currentInput: state.currentInput + ',',
        };
    }
    
    return state;
}

/**
 * Set operator
 * @param {CalcState} state
 * @param {string} operator
 * @returns {CalcState}
 */
export function setOperator(state, operator) {
    const normalizedOp = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
    
    if (state.expression === '' || state.shouldResetDisplay) {
        // Start new expression
        return {
            ...state,
            expression: state.currentInput + ' ' + normalizedOp,
            shouldResetDisplay: true,
            lastOperator: normalizedOp,
            lastOperand: null,
        };
    }
    
    // Continue expression with proper precedence
    return {
        ...state,
        expression: state.expression + ' ' + state.currentInput + ' ' + normalizedOp,
        shouldResetDisplay: true,
        lastOperator: normalizedOp,
        lastOperand: null,
    };
}

/**
 * Calculate result
 * @param {CalcState} state
 * @returns {CalcState}
 */
export function calculate(state) {
    if (state.expression === '') {
        // Repeat last operation if available
        if (state.lastOperator && state.lastOperand !== null) {
            const expr = state.currentInput + ' ' + state.lastOperator + ' ' + state.lastOperand;
            const { result, error } = evaluate(expr);
            
            if (error) {
                return {
                    ...initialState,
                    currentInput: error,
                    shouldResetDisplay: true,
                };
            }
            
            return {
                ...state,
                currentInput: result.toString().replace('.', ','),
                shouldResetDisplay: true,
            };
        }
        return state;
    }
    
    const fullExpression = state.expression + ' ' + state.currentInput;
    const { result, error } = evaluate(fullExpression);
    
    if (error) {
        return {
            ...initialState,
            currentInput: error,
            shouldResetDisplay: true,
        };
    }
    
    // Store for repeat calculation
    const tokens = tokenize(fullExpression);
    const lastOp = tokens.filter(t => t.type === 'operator').pop();
    const lastNum = tokens.filter(t => t.type === 'number').pop();
    
    return {
        ...state,
        currentInput: result.toString().replace('.', ','),
        expression: '',
        shouldResetDisplay: true,
        lastOperator: lastOp ? lastOp.value : state.lastOperator,
        lastOperand: lastNum ? parseFloat(lastNum.value) : state.lastOperand,
    };
}

/**
 * Clear calculator
 * @returns {CalcState}
 */
export function clear() {
    return { ...initialState };
}

/**
 * Backspace
 * @param {CalcState} state
 * @returns {CalcState}
 */
export function backspace(state) {
    if (state.shouldResetDisplay) {
        return state;
    }
    
    if (state.currentInput.length === 1 || 
        (state.currentInput.length === 2 && state.currentInput.startsWith('-'))) {
        return {
            ...state,
            currentInput: '0',
        };
    }
    
    return {
        ...state,
        currentInput: state.currentInput.slice(0, -1),
    };
}

/**
 * Toggle sign
 * @param {CalcState} state
 * @returns {CalcState}
 */
export function toggleSign(state) {
    if (state.currentInput === '0') return state;
    
    if (state.currentInput.startsWith('-')) {
        return {
            ...state,
            currentInput: state.currentInput.slice(1),
        };
    }
    
    return {
        ...state,
        currentInput: '-' + state.currentInput,
    };
}

/**
 * Calculate percentage
 * @param {CalcState} state
 * @returns {CalcState}
 */
export function percentage(state) {
    const num = parseDisplayNumber(state.currentInput);
    const result = num / 100;
    
    return {
        ...state,
        currentInput: result.toString().replace('.', ','),
        shouldResetDisplay: true,
    };
}

/**
 * Get display expression for the operation line
 * @param {CalcState} state
 * @returns {string}
 */
export function getDisplayExpression(state) {
    if (state.expression === '') return '';
    if (state.shouldResetDisplay) {
        return state.expression;
    }
    return state.expression + ' ' + state.currentInput;
}
