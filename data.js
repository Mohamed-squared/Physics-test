/**
 * Data-related logic for the test generator, including storage, question allocation, and selection.
 */

/** Key for localStorage */
export const DATA_KEY = 'test_generator_data';

/** Sample used questions for chapters */
export const usedQuestions = {
    '1': [1, 15, 28], '2': [1, 12, 23, 34, 44, 55, 66, 77], '3': [1, 14, 26, 39],
    '4': [1, 13, 24, 35, 47], '5': [1, 12, 24, 35, 46, 58, 69], '6': [1, 11, 21, 31, 41, 51, 61, 71],
    '7': [1, 12, 23, 34, 45, 56, 67]
};

/** Initial data structure for subjects and chapters */
export const initialData = {
    "subjects": {
        "1": {
            "name": "Fundamentals of Physics",
            "max_questions": 42,
            "chapters": {
                "1": {
                    "total_questions": 28,
                    "total_attempted": 6,
                    "total_wrong": 2,
                    "available_questions": [
                        4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 20, 21, 22, 23, 24, 25
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "2": {
                    "total_questions": 77,
                    "total_attempted": 9,
                    "total_wrong": 1,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 40, 41, 42, 43, 45,
                        46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 58, 59, 60, 61, 62, 63, 64, 65,
                        67, 68, 69, 70, 71, 72, 73, 74, 75, 76
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "3": {
                    "total_questions": 39,
                    "total_attempted": 7,
                    "total_wrong": 3,
                    "available_questions": [
                        5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 27,
                        28, 29, 30, 31, 33, 34, 35, 36
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "4": {
                    "total_questions": 47,
                    "total_attempted": 6,
                    "total_wrong": 0,
                    "available_questions": [
                        2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                        27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "5": {
                    "total_questions": 69,
                    "total_attempted": 10,
                    "total_wrong": 2,
                    "available_questions": [
                        4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27,
                        28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 47, 48, 49, 50,
                        51, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 65, 66
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "6": {
                    "total_questions": 71,
                    "total_attempted": 15,
                    "total_wrong": 7,
                    "available_questions": [
                        4, 5, 7, 8, 12, 13, 15, 17, 18, 19, 20, 22, 23, 24, 25, 29, 30, 32, 33, 34,
                        35, 36, 37, 39, 40, 42, 43, 44, 46, 47, 50, 52, 53, 54, 55, 56, 57, 58, 60,
                        62, 63, 64, 66, 67, 68
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "7": {
                    "total_questions": 67,
                    "total_attempted": 8,
                    "total_wrong": 1,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        24, 25, 26, 27, 28, 29, 30, 31, 32, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46,
                        47, 48, 49, 50, 51, 52, 53, 54, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "8": {
                    "total_questions": 61,
                    "total_attempted": 10,
                    "total_wrong": 3,
                    "available_questions": [
                        4, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 19, 21, 22, 23, 29, 31, 32, 33,
                        34, 35, 37, 38, 39, 40, 44, 45, 46, 47, 48, 50, 51, 52, 54, 56, 57, 58, 59
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "9": {
                    "total_questions": 81,
                    "total_attempted": 13,
                    "total_wrong": 3,
                    "available_questions": [
                        3, 5, 6, 7, 9, 10, 12, 13, 15, 16, 17, 18, 19, 21, 22, 23, 24, 26, 29, 30,
                        31, 33, 35, 36, 37, 38, 44, 46, 47, 48, 51, 53, 54, 55, 56, 58, 59, 60, 61,
                        63, 64, 65, 66, 67, 69, 70, 71, 73, 75, 76, 77, 78
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "10": {
                    "total_questions": 81,
                    "total_attempted": 0,
                    "total_wrong": 0,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23,
                        24, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45,
                        46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 66, 67,
                        68, 69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "11": {
                    "total_questions": 54,
                    "total_attempted": 0,
                    "total_wrong": 0,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23,
                        24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44,
                        46, 47, 48, 49, 50, 51, 52, 53
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "12": {
                    "total_questions": 53,
                    "total_attempted": 0,
                    "total_wrong": 0,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23,
                        24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 45,
                        46, 47, 48, 49, 50, 51, 52
                    ],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                }
            },
            "pending_exams": [
                {
                    "id": "2025-04-11_23:46",
                    "allocation": {
                        "1": 3,
                        "2": 2,
                        "3": 3,
                        "4": 0,
                        "5": 3,
                        "6": 7,
                        "7": 1,
                        "8": 10,
                        "9": 13
                    }
                },
                {
                    "id": "2025-04-12_00:03",
                    "allocation": {
                        "1": 3,
                        "2": 1,
                        "3": 3,
                        "4": 1,
                        "5": 3,
                        "6": 7,
                        "7": 1,
                        "8": 10,
                        "9": 13
                    }
                },
                {
                    "id": "2025-04-15_21:38",
                    "allocation": {
                        "1": 1,
                        "2": 1,
                        "3": 2,
                        "4": 1,
                        "5": 2,
                        "6": 4,
                        "7": 1,
                        "8": 2,
                        "9": 3,
                        "10": 11,
                        "11": 7,
                        "12": 7
                    },
                    "results_entered": false
                }
            ]
        }
    }
};

/**
 * Calculates the difficulty score for a chapter based on error rate and consecutive mistakes.
 * @param {Object} chap - Chapter data with total_attempted, total_wrong, mistake_history.
 * @returns {number} Difficulty score (10 to 100+).
 */
export function calculateDifficulty(chap) {
    if (chap.total_attempted > 0) {
        let error_rate = chap.total_wrong / chap.total_attempted;
        let base_difficulty = Math.max(error_rate * 100, 10);
        let consecutive_mistakes = 0;
        for (let wrong of chap.mistake_history.slice().reverse()) {
            if (wrong > 0) consecutive_mistakes++;
            else break;
        }
        return base_difficulty + (consecutive_mistakes * 20);
    }
    return 100;
}

/**
 * Allocates questions across chapters based on difficulty and mastery.
 * @param {Object} chapters - Chapters object with chapter data.
 * @param {number} total_test_questions - Total questions for the test.
 * @returns {Object} Allocation of questions per chapter.
 */
export function allocateQuestions(chapters, total_test_questions) {
    let weights = {};
    for (let chap_num in chapters) {
        let chap = chapters[chap_num];
        let mastery = chap.consecutive_mastery || 0;
        let weight_factor = mastery >= 6 ? 0.5 : mastery >= 3 ? 0.75 : 1.0;
        weights[chap_num] = chap.total_questions * (calculateDifficulty(chap) / 100) * weight_factor;
    }
    let sum_w = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum_w === 0) return Object.fromEntries(Object.keys(chapters).map(c => [c, 0]));
    let proportions = Object.fromEntries(Object.entries(weights).map(([k, w]) => [k, w / sum_w]));
    let expected = Object.fromEntries(Object.entries(proportions).map(([k, p]) => [k, total_test_questions * p]));
    let allocations = Object.fromEntries(Object.entries(expected).map(([k, e]) => [k, Math.floor(e)]));
    let total_allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
    let remaining = total_test_questions - total_allocated;
    let remainders = Object.fromEntries(Object.keys(chapters).map(c => [c, expected[c] - allocations[c]]));
    let sorted_chaps = Object.entries(remainders).sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < remaining; i++) {
        let chap_num = sorted_chaps[i % sorted_chaps.length][0];
        allocations[chap_num]++;
    }
    return allocations;
}

/**
 * Selects a subset of questions from available questions.
 * @param {number[]} available - Array of available question IDs.
 * @param {number} n - Number of questions to select.
 * @returns {number[]} Selected question IDs.
 */
export function selectQuestions(available, n) {
    if (n === 0) return [];
    if (n >= available.length) return available.slice();
    if (n === 1) return [available[Math.floor(available.length / 2)]];
    let step = (available.length - 1) / (n - 1);
    let indices = Array.from({length: n}, (_, i) => Math.round(i * step));
    return indices.map(i => available[Math.min(i, available.length - 1)]).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).slice(0, n);
}

/**
 * Selects new questions for a chapter, updating available questions.
 * @param {Object} chap - Chapter data with available_questions and total_questions.
 * @param {number} n - Number of questions to select.
 * @returns {number[]} Selected question IDs.
 */
export function selectNewQuestions(chap, n) {
    let available = chap.available_questions.slice();
    let selected = [];
    if (available.length >= n) {
        selected = selectQuestions(available, n);
        chap.available_questions = available.filter(q => !selected.includes(q));
    } else {
        selected = available;
        let remaining = n - available.length;
        let all_questions = Array.from({length: chap.total_questions}, (_, i) => i + 1);
        selected.push(...Array.from({length: remaining}, () => all_questions[Math.floor(Math.random() * all_questions.length)]));
        chap.available_questions = all_questions.slice();
    }
    return selected.sort((a, b) => a - b);
}

/**
 * Saves data to localStorage.
 * @param {Object} data - Data to save.
 */
export function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

/**
 * Loads data from localStorage, initializing with default data if none exists.
 * @returns {Object} Loaded or initialized data.
 */
export function loadData() {
    let data = JSON.parse(localStorage.getItem(DATA_KEY));
    if (!data) {
        data = JSON.parse(JSON.stringify(initialData));
        saveData(data);
    } else if (!data.subjects) {
        data = {
            subjects: {
                '1': {
                    name: "Fundamentals of Physics",
                    max_questions: 42,
                    chapters: data.chapters || {},
                    pending_exams: data.pending_exams || []
                }
            }
        };
        for (let chap of Object.values(data.subjects['1'].chapters)) {
            chap.mistake_history = chap.mistake_history || [];
            chap.consecutive_mastery = chap.consecutive_mastery || 0;
            chap.available_questions = chap.available_questions || Array.from({length: chap.total_questions}, (_, i) => i + 1);
        }
        saveData(data);
    }
    return data;
}