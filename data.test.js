import { calculateDifficulty, allocateQuestions, selectQuestions, selectNewQuestions } from './data.js';

describe('calculateDifficulty', () => {
    test('returns 100 for unattempted chapter', () => {
        const chap = { total_attempted: 0, total_wrong: 0, mistake_history: [] };
        expect(calculateDifficulty(chap)).toBe(100);
    });

    test('calculates difficulty based on error rate and consecutive mistakes', () => {
        const chap = {
            total_attempted: 10,
            total_wrong: 2,
            mistake_history: [0, 1, 1, 0, 1],
            consecutive_mastery: 0
        };
        // Error rate: 2/10 = 0.2 -> 20, plus 1 consecutive mistake -> 20 + 20 = 40
        expect(calculateDifficulty(chap)).toBe(40);
    });

    test('ensures minimum difficulty of 10', () => {
        const chap = {
            total_attempted: 100,
            total_wrong: 1,
            mistake_history: [0, 0, 0],
            consecutive_mastery: 0
        };
        // Error rate: 1/100 = 0.01 -> 1, but min 10
        expect(calculateDifficulty(chap)).toBe(10);
    });
});

describe('allocateQuestions', () => {
    test('allocates questions proportionally based on difficulty', () => {
        const chapters = {
            '1': { total_questions: 10, total_attempted: 5, total_wrong: 5, mistake_history: [], consecutive_mastery: 0 },
            '2': { total_questions: 20, total_attempted: 10, total_wrong: 0, mistake_history: [], consecutive_mastery: 3 }
        };
        const allocation = allocateQuestions(chapters, 10);
        expect(allocation['1'] + allocation['2']).toBe(10);
        expect(allocation['1']).toBeGreaterThan(allocation['2']); // Higher difficulty for chap 1
    });

    test('returns zero allocation for zero weights', () => {
        const chapters = {
            '1': { total_questions: 0, total_attempted: 0, total_wrong: 0, mistake_history: [], consecutive_mastery: 0 }
        };
        const allocation = allocateQuestions(chapters, 10);
        expect(allocation['1']).toBe(0);
    });
});

describe('selectQuestions', () => {
    test('selects all questions when n >= available', () => {
        const available = [1, 2, 3];
        expect(selectQuestions(available, 3)).toEqual([1, 2, 3]);
        expect(selectQuestions(available, 5)).toEqual([1, 2, 3]);
    });

    test('selects single question for n = 1', () => {
        const available = [1, 2, 3, 4, 5];
        expect(selectQuestions(available, 1)).toEqual([3]); // Middle question
    });

    test('selects evenly spaced questions', () => {
        const available = [1, 2, 3, 4, 5];
        expect(selectQuestions(available, 3)).toEqual([1, 3, 5]);
    });
});

describe('selectNewQuestions', () => {
    test('selects questions and updates available_questions', () => {
        const chap = {
            total_questions: 5,
            available_questions: [1, 2, 3, 4, 5],
            mistake_history: [],
            consecutive_mastery: 0
        };
        const selected = selectNewQuestions(chap, 3);
        expect(selected.length).toBe(3);
        expect(chap.available_questions.length).toBe(2);
        expect(selected.every(q => [1, 2, 3, 4, 5].includes(q))).toBe(true);
    });

    test('replenishes questions when insufficient', () => {
        const chap = {
            total_questions: 5,
            available_questions: [1],
            mistake_history: [],
            consecutive_mastery: 0
        };
        const selected = selectNewQuestions(chap, 3);
        expect(selected.length).toBe(3);
        expect(chap.available_questions).toEqual([1, 2, 3, 4, 5]);
        expect(selected.every(q => [1, 2, 3, 4, 5].includes(q))).toBe(true);
    });
});