/**
 * Calculator Display Logic Module
 * Handles number formatting, overflow, and display updates
 */

/**
 * Format a number for display with proper overflow handling
 * @param {string} value - The raw input value
 * @param {number} maxLength - Maximum characters to display before overflow
 * @returns {string} Formatted display value
 */
export function formatDisplayValue(value, maxLength = 12) {
    if (!value || value === '0') return '0';
    
    // Remove leading zeros (except for decimal)
    if (value.length > 1 && value.startsWith('0') && value[1] !== '.') {
        value = value.replace(/^0+/, '') || '0';
    }
    
    // Handle overflow with scientific notation
    if (value.replace('-', '').replace('.', '').length > maxLength) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            return num.toExponential(6);
        }
    }
    
    return value;
}

/**
 * Format operation display
 * @param {string} previousInput - Previous operand
 * @param {string|null} operation - Operation symbol
 * @returns {string} Formatted operation display
 */
export function formatOperationDisplay(previousInput, operation) {
    if (!previousInput || !operation) return '';
    return `${formatNumberWithCommas(previousInput)} ${operation}`;
}

/**
 * Add thousands separators to a number string
 * @param {string} value - Number as string
 * @returns {string} Number with commas
 */
export function formatNumberWithCommas(value) {
    if (!value) return '0';
    
    const parts = value.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Add commas to integer part
    const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimalPart ? `${withCommas}.${decimalPart}` : withCommas;
}

/**
 * Check if a value can have a decimal point added
 * @param {string} value - Current display value
 * @returns {boolean} True if decimal can be added
 */
export function canAddDecimal(value) {
    if (!value) return true;
    return !value.includes('.');
}

/**
 * Handle backspace on a value
 * @param {string} value - Current display value
 * @returns {string} Value after backspace
 */
export function handleBackspace(value) {
    if (!value || value === '0') return '0';
    
    if (value.length === 1 || (value.length === 2 && value.startsWith('-'))) {
        return '0';
    }
    
    return value.slice(0, -1);
}

/**
 * Toggle sign of a number
 * @param {string} value - Current display value
 * @returns {string} Value with toggled sign
 */
export function toggleSign(value) {
    if (!value || value === '0') return '0';
    
    if (value.startsWith('-')) {
        return value.slice(1);
    }
    
    return '-' + value;
}

/**
 * Append a digit to the current value
 * @param {string} current - Current display value
 * @param {string} digit - Digit to append (0-9)
 * @param {boolean} shouldReset - Whether to reset display first
 * @returns {string} New display value
 */
export function appendDigit(current, digit, shouldReset = false) {
    if (shouldReset || current === '0') {
        return digit;
    }
    
    // Prevent multiple leading zeros
    if (current === '0' && digit === '0') {
        return '0';
    }
    
    return current + digit;
}

/**
 * Append decimal point to current value
 * @param {string} current - Current display value
 * @returns {string} Value with decimal point
 */
export function appendDecimal(current) {
    if (!canAddDecimal(current)) {
        return current;
    }
    
    return current + '.';
}

/**
 * Check if display needs overflow handling
 * @param {string} value - Display value
 * @param {number} maxChars - Maximum characters
 * @returns {boolean} True if overflow
 */
export function isOverflow(value, maxChars = 16) {
    if (!value) return false;
    return value.replace(/[,-]/g, '').length > maxChars;
}

/**
 * Scale font size based on content length
 * @param {string} value - Display value
 * @param {number} baseSize - Base font size in pixels
 * @param {number} minSize - Minimum font size in pixels
 * @returns {number} Calculated font size
 */
export function calculateFontSize(value, baseSize = 48, minSize = 24) {
    if (!value) return baseSize;
    
    const length = value.length;
    
    if (length <= 9) return baseSize;
    if (length <= 12) return Math.max(baseSize * 0.8, minSize);
    if (length <= 15) return Math.max(baseSize * 0.65, minSize);
    
    return minSize;
}

/**
 * Create display state object
 * @returns {DisplayState} New display state
 */
export function createDisplayState() {
    return {
        currentInput: '0',
        previousInput: '',
        operation: null,
        shouldResetDisplay: false,
    };
}

/**
 * Clear display state
 * @returns {DisplayState} Cleared state
 */
export function clearDisplayState() {
    return {
        currentInput: '0',
        previousInput: '',
        operation: null,
        shouldResetDisplay: false,
    };
}

// Default export for module
export default {
    formatDisplayValue,
    formatOperationDisplay,
    formatNumberWithCommas,
    canAddDecimal,
    handleBackspace,
    toggleSign,
    appendDigit,
    appendDecimal,
    isOverflow,
    calculateFontSize,
    createDisplayState,
    clearDisplayState,
};