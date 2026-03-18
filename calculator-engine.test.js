import { describe, it, expect } from 'vitest';
import {
    initialState,
    inputNumber,
    inputDecimal,
    setOperator,
    calculate,
    clear,
    backspace,
    toggleSign,
    percentage,
    evaluate,
    formatNumber,
    parseDisplayNumber,
    getDisplayExpression,
} from './calculator-engine.js';

describe('Calculator Core Operations', () => {
    describe('Addition (+)', () => {
        it('should add two positive numbers', () => {
            const { result } = evaluate('5 + 3');
            expect(result).toBe(8);
        });

        it('should add positive and negative numbers', () => {
            const { result } = evaluate('5 + -3');
            expect(result).toBe(2);
        });

        it('should handle decimal addition', () => {
            const { result } = evaluate('0.1 + 0.2');
            expect(result).toBeCloseTo(0.3, 10);
        });

        it('should add via state operations', () => {
            let state = { ...initialState };
            state = inputNumber(state, '5');
            state = setOperator(state, '+');
            state = inputNumber(state, '3');
            state = calculate(state);
            expect(state.currentInput).toBe('8');
        });
    });

    describe('Subtraction (-)', () => {
        it('should subtract two positive numbers', () => {
            const { result } = evaluate('10 - 4');
            expect(result).toBe(6);
        });

        it('should handle negative results', () => {
            const { result } = evaluate('4 - 10');
            expect(result).toBe(-6);
        });

        it('should subtract via state operations', () => {
            let state = { ...initialState };
            state = inputNumber(state, '10');
            state = setOperator(state, '-');
            state = inputNumber(state, '4');
            state = calculate(state);
            expect(state.currentInput).toBe('6');
        });
    });

    describe('Multiplication (×)', () => {
        it('should multiply two positive numbers', () => {
            const { result } = evaluate('6 × 7');
            expect(result).toBe(42);
        });

        it('should handle multiplication by zero', () => {
            const { result } = evaluate('100 × 0');
            expect(result).toBe(0);
        });

        it('should multiply via state operations', () => {
            let state = { ...initialState };
            state = inputNumber(state, '6');
            state = setOperator(state, '×');
            state = inputNumber(state, '7');
            state = calculate(state);
            expect(state.currentInput).toBe('42');
        });
    });

    describe('Division (÷)', () => {
        it('should divide two positive numbers', () => {
            const { result } = evaluate('20 ÷ 4');
            expect(result).toBe(5);
        });

        it('should handle division resulting in decimals', () => {
            const { result } = evaluate('10 ÷ 4');
            expect(result).toBe(2.5);
        });

        it('should divide via state operations', () => {
            let state = { ...initialState };
            state = inputNumber(state, '20');
            state = setOperator(state, '÷');
            state = inputNumber(state, '4');
            state = calculate(state);
            expect(state.currentInput).toBe('5');
        });
    });

    describe('Division by zero', () => {
        it('should return error for division by zero', () => {
            const { result, error } = evaluate('10 ÷ 0');
            expect(result).toBeNull();
            expect(error).toBe('Sıfıra bölme hatası');
        });

        it('should return error via state operations', () => {
            let state = { ...initialState };
            state = inputNumber(state, '10');
            state = setOperator(state, '÷');
            state = inputNumber(state, '0');
            state = calculate(state);
            expect(state.currentInput).toBe('Sıfıra bölme hatası');
        });

        it('should handle 0.0 as division by zero', () => {
            const { error } = evaluate('10 ÷ 0.0');
            expect(error).toBe('Sıfıra bölme hatası');
        });
    });

    describe('Chained operations with precedence', () => {
        it('should handle 2 + 3 × 4 = 14 (multiplication before addition)', () => {
            const { result } = evaluate('2 + 3 × 4');
            expect(result).toBe(14);
        });

        it('should handle 10 - 2 × 3 = 4', () => {
            const { result } = evaluate('10 - 2 × 3');
            expect(result).toBe(4);
        });

        it('should handle 20 ÷ 4 + 3 = 8', () => {
            const { result } = evaluate('20 ÷ 4 + 3');
            expect(result).toBe(8);
        });

        it('should handle 15 ÷ 3 × 2 = 10 (left to right for same precedence)', () => {
            const { result } = evaluate('15 ÷ 3 × 2');
            expect(result).toBe(10);
        });

        it('should handle 8 - 3 + 2 = 7 (left to right for same precedence)', () => {
            const { result } = evaluate('8 - 3 + 2');
            expect(result).toBe(7);
        });

        it('should handle complex expression 2 + 3 × 4 - 6 ÷ 2', () => {
            const { result } = evaluate('2 + 3 × 4 - 6 ÷ 2');
            expect(result).toBe(11);
        });
    });

    describe('Equal (=) button', () => {
        it('should calculate and display result', () => {
            let state = { ...initialState };
            state = inputNumber(state, '5');
            state = setOperator(state, '+');
            state = inputNumber(state, '3');
            state = calculate(state);
            expect(state.currentInput).toBe('8');
            expect(state.expression).toBe('');
            expect(state.shouldResetDisplay).toBe(true);
        });

        it('should allow continuing calculation with result', () => {
            let state = { ...initialState };
            state = inputNumber(state, '5');
            state = setOperator(state, '+');
            state = inputNumber(state, '3');
            state = calculate(state);
            state = setOperator(state, '×');
            state = inputNumber(state, '2');
            state = calculate(state);
            expect(state.currentInput).toBe('16');
        });
    });

    describe('Helper functions', () => {
        describe('formatNumber', () => {
            it('should format integers', () => {
                expect(formatNumber(1000)).toBe('1.000');
                expect(formatNumber(5000000)).toBe('5.000.000');
            });

            it('should format decimals', () => {
                expect(formatNumber(1234.56)).toBe('1.234,56');
            });

            it('should handle scientific notation for large numbers', () => {
                expect(formatNumber(1e20)).toMatch(/e\+/);
            });

            it('should handle infinity', () => {
                expect(formatNumber(Infinity)).toBe('Error');
            });
        });

        describe('parseDisplayNumber', () => {
            it('should parse Turkish formatted numbers', () => {
                expect(parseDisplayNumber('1.234,56')).toBe(1234.56);
                expect(parseDisplayNumber('1.000')).toBe(1000);
            });
        });

        describe('getDisplayExpression', () => {
            it('should format expression for display', () => {
                let state = { ...initialState };
                state = inputNumber(state, '5');
                state = setOperator(state, '+');
                state = inputNumber(state, '3');
                expect(getDisplayExpression(state)).toBe('5 + 3');
            });
        });
    });

    describe('State operations', () => {
        describe('inputNumber', () => {
            it('should replace zero with new number', () => {
                let state = { ...initialState };
                state = inputNumber(state, '5');
                expect(state.currentInput).toBe('5');
            });

            it('should append to existing number', () => {
                let state = { ...initialState };
                state = inputNumber(state, '1');
                state = inputNumber(state, '2');
                expect(state.currentInput).toBe('12');
            });
        });

        describe('inputDecimal', () => {
            it('should add comma to number', () => {
                let state = { ...initialState };
                state = inputDecimal(state);
                expect(state.currentInput).toBe('0,');
            });

            it('should not add second comma', () => {
                let state = { ...initialState };
                state = inputDecimal(state);
                state = inputDecimal(state);
                expect(state.currentInput).toBe('0,');
            });
        });

        describe('clear', () => {
            it('should reset to initial state', () => {
                let state = { ...initialState };
                state = inputNumber(state, '5');
                state = setOperator(state, '+');
                // Use the state to avoid lint errors
                expect(state.currentInput).toBe('5');
                const clearedState = clear();
                expect(clearedState.currentInput).toBe('0');
                expect(clearedState.expression).toBe('');
            });
        });

        describe('backspace', () => {
            it('should remove last digit', () => {
                let state = { ...initialState };
                state = inputNumber(state, '1');
                state = inputNumber(state, '2');
                state = inputNumber(state, '3');
                state = backspace(state);
                expect(state.currentInput).toBe('12');
            });

            it('should reset to zero when single digit', () => {
                let state = { ...initialState };
                state = inputNumber(state, '5');
                state = backspace(state);
                expect(state.currentInput).toBe('0');
            });
        });

        describe('toggleSign', () => {
            it('should make number negative', () => {
                let state = { ...initialState };
                state = inputNumber(state, '5');
                state = toggleSign(state);
                expect(state.currentInput).toBe('-5');
            });

            it('should make number positive', () => {
                let state = { ...initialState };
                state.currentInput = '-5';
                state = toggleSign(state);
                expect(state.currentInput).toBe('5');
            });
        });

        describe('percentage', () => {
            it('should divide by 100', () => {
                let state = { ...initialState };
                state = inputNumber(state, '50');
                state = percentage(state);
                expect(state.currentInput).toBe('0,5');
            });
        });
    });
});
