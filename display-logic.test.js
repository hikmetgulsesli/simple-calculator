import { describe, it, expect } from 'vitest';
import {
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
} from './display-logic.js';

describe('formatDisplayValue', () => {
    it('should return 0 for empty or null value', () => {
        expect(formatDisplayValue('')).toBe('0');
        expect(formatDisplayValue(null)).toBe('0');
        expect(formatDisplayValue(undefined)).toBe('0');
    });

    it('should return 0 for input "0"', () => {
        expect(formatDisplayValue('0')).toBe('0');
    });

    it('should remove leading zeros', () => {
        expect(formatDisplayValue('007')).toBe('7');
        expect(formatDisplayValue('000')).toBe('0');
    });

    it('should preserve decimal point', () => {
        expect(formatDisplayValue('0.5')).toBe('0.5');
        expect(formatDisplayValue('00.75')).toBe('.75');
    });

    it('should use scientific notation for overflow', () => {
        expect(formatDisplayValue('12345678901234')).toMatch(/e\+/i);
    });

    it('should handle negative numbers', () => {
        expect(formatDisplayValue('-123')).toBe('-123');
    });
});

describe('formatOperationDisplay', () => {
    it('should return empty string when no inputs', () => {
        expect(formatOperationDisplay('', null)).toBe('');
        expect(formatOperationDisplay(null, '+')).toBe('');
    });

    it('should format operation with commas', () => {
        expect(formatOperationDisplay('1250', '×')).toBe('1,250 ×');
        expect(formatOperationDisplay('5000', '+')).toBe('5,000 +');
    });
});

describe('formatNumberWithCommas', () => {
    it('should return 0 for empty or null value', () => {
        expect(formatNumberWithCommas('')).toBe('0');
        expect(formatNumberWithCommas(null)).toBe('0');
    });

    it('should add commas to large numbers', () => {
        expect(formatNumberWithCommas('1000')).toBe('1,000');
        expect(formatNumberWithCommas('1000000')).toBe('1,000,000');
        expect(formatNumberWithCommas('1234567890')).toBe('1,234,567,890');
    });

    it('should preserve decimal part', () => {
        expect(formatNumberWithCommas('1234.56')).toBe('1,234.56');
        expect(formatNumberWithCommas('1000000.99')).toBe('1,000,000.99');
    });

    it('should handle negative numbers', () => {
        expect(formatNumberWithCommas('-1000')).toBe('-1,000');
        expect(formatNumberWithCommas('-1234.56')).toBe('-1,234.56');
    });
});

describe('canAddDecimal', () => {
    it('should return true for empty or null value', () => {
        expect(canAddDecimal('')).toBe(true);
        expect(canAddDecimal(null)).toBe(true);
    });

    it('should return true if no decimal exists', () => {
        expect(canAddDecimal('123')).toBe(true);
        expect(canAddDecimal('0')).toBe(true);
    });

    it('should return false if decimal already exists', () => {
        expect(canAddDecimal('123.45')).toBe(false);
        expect(canAddDecimal('0.5')).toBe(false);
    });
});

describe('handleBackspace', () => {
    it('should return 0 for single digit', () => {
        expect(handleBackspace('5')).toBe('0');
        expect(handleBackspace('0')).toBe('0');
    });

    it('should return 0 for negative single digit', () => {
        expect(handleBackspace('-5')).toBe('0');
    });

    it('should remove last character', () => {
        expect(handleBackspace('123')).toBe('12');
        expect(handleBackspace('12345')).toBe('1234');
    });

    it('should handle negative numbers', () => {
        expect(handleBackspace('-123')).toBe('-12');
    });
});

describe('toggleSign', () => {
    it('should return 0 for empty or 0 value', () => {
        expect(toggleSign('0')).toBe('0');
        expect(toggleSign('')).toBe('0');
    });

    it('should add negative sign to positive number', () => {
        expect(toggleSign('123')).toBe('-123');
    });

    it('should remove negative sign from negative number', () => {
        expect(toggleSign('-123')).toBe('123');
    });
});

describe('appendDigit', () => {
    it('should return digit when shouldReset is true', () => {
        expect(appendDigit('123', '5', true)).toBe('5');
    });

    it('should replace 0 with digit', () => {
        expect(appendDigit('0', '5', false)).toBe('5');
    });

    it('should append digit to current value', () => {
        expect(appendDigit('12', '3', false)).toBe('123');
    });

    it('should prevent multiple leading zeros', () => {
        expect(appendDigit('0', '0', false)).toBe('0');
    });
});

describe('appendDecimal', () => {
    it('should add decimal point', () => {
        expect(appendDecimal('123')).toBe('123.');
        expect(appendDecimal('0')).toBe('0.');
    });

    it('should not add duplicate decimal', () => {
        expect(appendDecimal('123.45')).toBe('123.45');
        expect(appendDecimal('0.5')).toBe('0.5');
    });
});

describe('isOverflow', () => {
    it('should return false for short values', () => {
        expect(isOverflow('123')).toBe(false);
        expect(isOverflow('1234567890')).toBe(false);
    });

    it('should return true for long values', () => {
        expect(isOverflow('12345678901234567')).toBe(true);
    });

    it('should ignore commas and signs', () => {
        expect(isOverflow('1,234,567,890,123,456', 10)).toBe(true);
    });
});

describe('calculateFontSize', () => {
    it('should return base size for short values', () => {
        expect(calculateFontSize('123', 48, 24)).toBe(48);
        expect(calculateFontSize('123456789', 48, 24)).toBe(48);
    });

    it('should reduce size for longer values', () => {
        expect(calculateFontSize('1234567890', 48, 24)).toBeCloseTo(38.4, 1);
        expect(calculateFontSize('123456789012', 48, 24)).toBeCloseTo(38.4, 1);
    });

    it('should not go below minimum size', () => {
        expect(calculateFontSize('12345678901234567890', 48, 24)).toBe(24);
    });
});

describe('createDisplayState', () => {
    it('should create initial state', () => {
        const state = createDisplayState();
        expect(state.currentInput).toBe('0');
        expect(state.previousInput).toBe('');
        expect(state.operation).toBe(null);
        expect(state.shouldResetDisplay).toBe(false);
    });
});

describe('clearDisplayState', () => {
    it('should reset to initial state', () => {
        const initial = {
            currentInput: '123',
            previousInput: '456',
            operation: '+',
            shouldResetDisplay: true,
        };
        const cleared = clearDisplayState(initial);
        expect(cleared.currentInput).toBe('0');
        expect(cleared.previousInput).toBe('');
        expect(cleared.operation).toBe(null);
        expect(cleared.shouldResetDisplay).toBe(false);
    });
});