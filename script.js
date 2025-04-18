const DATA_KEY = 'test_generator_data';
const usedQuestions = {
    '1': [1, 15, 28], '2': [1, 12, 23, 34, 44, 55, 66, 77], '3': [1, 14, 26, 39],
    '4': [1, 13, 24, 35, 47], '5': [1, 12, 24, 35, 46, 58, 69], '6': [1, 11, 21, 31, 41, 51, 61, 71],
    '7': [1, 12, 23, 34, 45, 56, 67]
};

const initialData = {
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
                    "latex_problems": [], // Store LaTeX problems
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "2": {
                    "total_questions": 77,
                    "total_attempted": 8,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20,
                        21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38,
                        39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 56,
                        57, 58, 59, 60, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73,
                        74, 75, 76
                    ],
                    "latex_problems": [],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "3": {
                    "total_questions": 39,
                    "total_attempted": 6,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20,
                        21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                        38
                    ],
                    "latex_problems": [],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "4": {
                    "total_questions": 47,
                    "total_attempted": 6,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20,
                        21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38,
                        39, 40, 41, 42, 43, 44, 45, 46
                    ],
                    "latex_problems": [],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "5": {
                    "total_questions": 69,
                    "total_attempted": 8,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20,
                        21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38,
                        39, 40, 41, 42, 43, 44, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55,
                        56, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68
                    ],
                    "latex_problems": [],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "6": {
                    "total_questions": 71,
                    "total_attempted": 8,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                        22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38,
                        39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56,
                        57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70
                    ],
                    "latex_problems": [],
                    "mistake_history": [],
                    "consecutive_mastery": 0
                },
                "7": {
                    "total_questions": 67,
                    "total_attempted": 8,
                    "total_wrong": 2,
                    "available_questions": [
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20,
                        21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38,
                        39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
                        57, 58, 59, 60, 61, 62, 63, 64, 65, 66
                    ],
                    "latex_problems": [],
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
                        "7": 1
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
                        "7": 1
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
                        "7": 1
                    },
                    "results_entered": false
                }
            ]
        }
    }
};

function calculateDifficulty(chap) {
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

function allocateQuestions(chapters, total_test_questions) {
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

function selectQuestions(available, n) {
    if (n === 0) return [];
    if (n >= available.length) return available.slice();
    if (n === 1) return [available[Math.floor(available.length / 2)]];
    let step = (available.length - 1) / (n - 1);
    let indices = Array.from({length: n}, (_, i) => Math.round(i * step));
    return indices.map(i => available[Math.min(i, available.length - 1)]).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).slice(0, n);
}

function selectNewQuestions(chap, n) {
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

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function loadData() {
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
            chap.latex_problems = chap.latex_problems || [];
        }
        saveData(data);
    }
    return data;
}

let data = loadData();
let currentSubject = Object.values(data.subjects)[0];
let charts = {};

function updateSubjectInfo() {
    document.getElementById('subject-info').innerHTML = `<p class="text-lg">Current Subject: ${currentSubject.name}</p>`;
}

function generateTest() {
    showLoading("Generating Test...");
    setTimeout(() => {
        let chapters = currentSubject.chapters;
        let max_questions = currentSubject.max_questions;
        if (Object.keys(chapters).length === 0) {
            document.getElementById('content').innerHTML = '<p class="text-red-500">No chapters available. Please add chapters first.</p>';
            hideLoading();
            return;
        }
        let allocation = allocateQuestions(chapters, max_questions);
        let exam_id = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
        let output = `<p class="font-bold">Generating test for exam ID: ${exam_id}</p>`;
        output += `<p>Today's test allocation (${max_questions} questions total):</p>`;
        for (let chap_num in allocation) {
            let n = allocation[chap_num];
            if (n > 0) {
                let questions = selectNewQuestions(chapters[chap_num], n);
                let latex_problems = selectLatexProblems(chapters[chap_num], questions);
                output += `<p>Chapter ${chap_num}: ${n} questions - select questions ${questions.join(', ')}</p>`;
                output += `<div class="mathjax-container">`;
                latex_problems.forEach((problem, idx) => {
                    output += `<div class="mb-2">Problem ${questions[idx]}: \\[${problem.latex}\\]</div>`;
                });
                output += `</div>`;
            }
        }
        currentSubject.pending_exams.push({id: exam_id, allocation, results_entered: false});
        saveData(data);
        document.getElementById('content').innerHTML = output;
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise().catch(err => console.error('MathJax typesetting error:', err));
        }
        hideLoading();
    }, 500);
}

function selectLatexProblems(chap, questions) {
    return questions
        .map(q => chap.latex_problems.find(p => p.problem_number === q))
        .filter(p => p !== undefined);
}

function showEnterResults() {
    let pending_exams = currentSubject.pending_exams;
    if (pending_exams.length === 0) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No pending exams to enter results for.</p>';
        return;
    }
    let output = '<p class="font-bold mb-4">Select an exam to enter results for:</p><div class="space-y-2">';
    pending_exams.forEach((exam, i) => {
        output += `<div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <button onclick="enterResults(${i})" class="w-full text-left flex justify-between items-center">
                <span>${i + 1}. ${exam.id}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>`;
    });
    output += '</div>';
    document.getElementById('content').innerHTML = output;
}

function enterResults(index) {
    let exam = currentSubject.pending_exams[index];
    let allocation = exam.allocation;
    let output = `<p class="font-bold mb-4">Entering results for exam ${exam.id}:</p><div class="space-y-4">`;
    let inputs = [];
    for (let chap_num in allocation) {
        let n = allocation[chap_num];
        if (n > 0) {
            output += `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label for="wrong-${chap_num}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chapter ${chap_num}: number of wrong answers (0 to ${n})
                </label>
                <input id="wrong-${chap_num}" type="number" min="0" max="${n}" value="0" 
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            </div>`;
            inputs.push(chap_num);
        }
    }
    output += `</div>
    <button onclick="submitResults(${index}, ${JSON.stringify(inputs)})" 
        class="mt-6 w-full btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Submit Results
    </button>`;
    document.getElementById('content').innerHTML = output;
}

function submitResults(index, chap_nums) {
    showLoading("Saving Results...");
    setTimeout(() => {
        let exam = currentSubject.pending_exams[index];
        let chapters = currentSubject.chapters;
        for (let chap_num of chap_nums) {
            let n = exam.allocation[chap_num];
            let wrong = parseInt(document.getElementById(`wrong-${chap_num}`).value);
            if (isNaN(wrong) || wrong < 0 || wrong > n) {
                hideLoading();
                alert(`Invalid input for Chapter ${chap_num}. Must be between 0 and ${n}.`);
                return;
            }
            chapters[chap_num].total_attempted += n;
            chapters[chap_num].total_wrong += wrong;
            chapters[chap_num].mistake_history.push(wrong);
            chapters[chap_num].consecutive_mastery = wrong === 0 ? (chapters[chap_num].consecutive_mastery || 0) + 1 : 0;
        }
        exam.results_entered = true;
        currentSubject.pending_exams.splice(index, 1);
        saveData(data);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Results entered successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function showAddChapters() {
    let output = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Add New Chapters</h2>
            <div class="mb-4">
                <label for="num-chapters" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of new chapters
                </label>
                <input id="num-chapters" type="number" min="1" value="1" placeholder="Enter number of chapters" 
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <button onclick="addChaptersForm()" class="btn-primary w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
                Continue
            </button>
        </div>
    `;
    document.getElementById('content').innerHTML = output;
}

function addChaptersForm() {
    let num_chapters = parseInt(document.getElementById('num-chapters').value);
    if (isNaN(num_chapters) || num_chapters < 1) {
        alert("Please enter a positive integer.");
        return;
    }
    let output = '<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">';
    output += '<h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Enter Chapter Details</h2>';
    output += '<div class="space-y-4">';
    let inputs = [];
    for (let i = 0; i < num_chapters; i++) {
        output += `
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-medium mb-3 text-gray-700 dark:text-gray-300">Chapter ${i + 1}</h3>
                <div class="mb-3">
                    <label for="chap-num-${i}" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Chapter number</label>
                    <input id="chap-num-${i}" type="text" placeholder="Enter chapter number" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                    <label for="chap-questions-${i}" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total questions</label>
                    <input id="chap-questions-${i}" type="number" min="1" placeholder="Enter number of questions" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
            </div>
        `;
        inputs.push(i);
    }
    output += '</div>';
    output += `<button onclick="submitChapters(${JSON.stringify(inputs)})" class="mt-6 btn-primary w-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Submit Chapters
    </button>`;
    output += '</div>';
    document.getElementById('content').innerHTML = output;
}

function submitChapters(indices) {
    showLoading("Adding Chapters...");
    setTimeout(() => {
        let chapters = currentSubject.chapters;
        for (let i of indices) {
            let chap_num = document.getElementById(`chap-num-${i}`).value;
            let total_questions = parseInt(document.getElementById(`chap-questions-${i}`).value);
            if (chap_num in chapters) {
                hideLoading();
                alert(`Chapter ${chap_num} already exists.`);
                return;
            }
            if (!chap_num || isNaN(total_questions) || total_questions < 1) {
                hideLoading();
                alert("Please enter valid chapter number and questions.");
                return;
            }
            chapters[chap_num] = {
                total_questions,
                total_attempted: 0,
                total_wrong: 0,
                available_questions: Array.from({length: total_questions}, (_, j) => j + 1),
                latex_problems: [],
                mistake_history: [],
                consecutive_mastery: 0
            };
        }
        saveData(data);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Chapters added successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function showDeleteExam() {
    let pending_exams = currentSubject.pending_exams;
    if (pending_exams.length === 0) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No pending exams to delete.</p>';
        return;
    }
    let output = '<p class="font-bold mb-4">Select an exam to delete:</p><div class="space-y-2">';
    pending_exams.forEach((exam, i) => {
        output += `<div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <button onclick="confirmDeleteExam(${i})" class="w-full text-left flex justify-between items-center">
                <span>${i + 1}. ${exam.id}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>`;
    });
    output += '</div>';
    document.getElementById('content').innerHTML = output;
}

function confirmDeleteExam(index) {
    let exam = currentSubject.pending_exams[index];
    document.getElementById('content').innerHTML = `
        <div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">Delete Exam</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete exam ${exam.id}?</p>
            <div class="flex justify-center space-x-3">
                <button onclick="deleteExam(${index})" class="btn-danger flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Delete
                </button>
                <button onclick="showDeleteExam()" class="btn-secondary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    Cancel
                </button>
            </div>
        </div>
    `;
}

function deleteExam(index) {
    showLoading("Deleting Exam...");
    setTimeout(() => {
        currentSubject.pending_exams.splice(index, 1);
        saveData(data);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Exam deleted successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function showManageSubjects() {
    let output = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Manage Subjects</h2>
            <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-medium mb-3 text-gray-700 dark:text-gray-300">Current Subjects</h3>
                <div class="space-y-2">
                    ${Object.entries(data.subjects).map(([id, subject]) => `
                        <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded shadow-sm">
                            <span>${subject.name}</span>
                            <div class="flex space-x-2">
                                <button onclick="selectSubject('${id}')" class="p-1 text-primary-500 hover:text-primary-600 dark:text-primary-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button onclick="editSubject('${id}')" class="p-1 text-blue-500 hover:text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button onclick="confirmDeleteSubject('${id}')" class="p-1 text-red-500 hover:text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-medium mb-3 text-gray-700 dark:text-gray-300">Add New Subject</h3>
                <div class="mb-3">
                    <label for="subject-name" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Name</label>
                    <input id="subject-name" type="text" placeholder="Enter subject name" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="mb-3">
                    <label for="max-questions" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Maximum Questions per Test</label>
                    <input id="max-questions" type="number" min="1" value="42" placeholder="Enter maximum questions" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <button onclick="addSubject()" class="btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Add Subject
                </button>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = output;
}

function selectSubject(id) {
    showLoading("Switching Subject...");
    setTimeout(() => {
        if (data.subjects[id]) {
            currentSubject = data.subjects[id];
            updateSubjectInfo();
            document.getElementById('content').innerHTML = `
            <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p class="font-medium">Subject changed to ${currentSubject.name}</p>
                </div>
            </div>`;
        }
        hideLoading();
    }, 500);
}

function editSubject(id) {
    let subject = data.subjects[id];
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Edit Subject</h2>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="mb-3">
                    <label for="edit-subject-name" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Name</label>
                    <input id="edit-subject-name" type="text" value="${subject.name}" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="mb-3">
                    <label for="edit-max-questions" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Maximum Questions per Test</label>
                    <input id="edit-max-questions" type="number" min="1" value="${subject.max_questions}" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="flex space-x-3 mt-4">
                    <button onclick="updateSubject('${id}')" class="btn-primary flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Save Changes
                    </button>
                    <button onclick="showManageSubjects()" class="btn-secondary flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateSubject(id) {
    showLoading("Updating Subject...");
    setTimeout(() => {
        let name = document.getElementById('edit-subject-name').value;
        let max_questions = parseInt(document.getElementById('edit-max-questions').value);
        if (!name || isNaN(max_questions) || max_questions < 1) {
            hideLoading();
            alert("Please enter a valid subject name and number of questions.");
            return;
        }
        data.subjects[id].name = name;
        data.subjects[id].max_questions = max_questions;
        currentSubject = data.subjects[id];
        saveData(data);
        updateSubjectInfo();
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Subject updated successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function confirmDeleteSubject(id) {
    let subject = data.subjects[id];
    document.getElementById('content').innerHTML = `
        <div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">Delete Subject</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete the subject "${subject.name}"? This action cannot be undone.</p>
            <div class="flex justify-center space-x-3">
                <button onclick="deleteSubject('${id}')" class="btn-danger flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Delete
                </button>
                <button onclick="showManageSubjects()" class="btn-secondary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    Cancel
                </button>
            </div>
        </div>
    `;
}

function deleteSubject(id) {
    showLoading("Deleting Subject...");
    setTimeout(() => {
        delete data.subjects[id];
        if (Object.keys(data.subjects).length === 0) {
            data.subjects['1'] = {
                name: "Default Subject",
                max_questions: 42,
                chapters: {},
                pending_exams: []
            };
        }
        currentSubject = Object.values(data.subjects)[0];
        saveData(data);
        updateSubjectInfo();
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Subject deleted successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function addSubject() {
    showLoading("Adding Subject...");
    setTimeout(() => {
        let name = document.getElementById('subject-name').value;
        let max_questions = parseInt(document.getElementById('max-questions').value);
        if (!name || isNaN(max_questions) || max_questions < 1) {
            hideLoading();
            alert("Please enter a valid subject name and number of questions.");
            return;
        }
        let id = Math.max(...Object.keys(data.subjects).map(Number), 0) + 1;
        data.subjects[id] = {
            name,
            max_questions,
            chapters: {},
            pending_exams: []
        };
        saveData(data);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Subject "${name}" added successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function showProgressDashboard() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('content').innerHTML = '';
    updateCharts();
}

function updateCharts() {
    let chapters = currentSubject.chapters;
    let labels = Object.keys(chapters).sort((a, b) => parseInt(a) - parseInt(b));
    let attemptedData = labels.map(chap => chapters[chap].total_attempted);
    let wrongData = labels.map(chap => chapters[chap].total_wrong);
    let masteryData = labels.map(chap => chapters[chap].consecutive_mastery);
    let difficultyData = labels.map(chap => calculateDifficulty(chapters[chap]));

    if (charts.attemptedChart) charts.attemptedChart.destroy();
    if (charts.wrongChart) charts.wrongChart.destroy();
    if (charts.masteryChart) charts.masteryChart.destroy();
    if (charts.difficultyChart) charts.difficultyChart.destroy();

    charts.attemptedChart = new Chart(document.getElementById('attemptedChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Questions Attempted',
                data: attemptedData,
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Questions' } },
                x: { title: { display: true, text: 'Chapter' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    charts.wrongChart = new Chart(document.getElementById('wrongChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Wrong Answers',
                data: wrongData,
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Wrong Answers' } },
                x: { title: { display: true, text: 'Chapter' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    charts.masteryChart = new Chart(document.getElementById('masteryChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Consecutive Mastery',
                data: masteryData,
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Mastery Count' } },
                x: { title: { display: true, text: 'Chapter' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    charts.difficultyChart = new Chart(document.getElementById('difficultyChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Chapter Difficulty',
                data: difficultyData,
                backgroundColor: '#F59E0B',
                borderColor: '#D97706',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 200, title: { display: true, text: 'Difficulty Score' } },
                x: { title: { display: true, text: 'Chapter' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function closeDashboard() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('content').innerHTML = '';
}

function showUploadPDF() {
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Upload Textbook PDF</h2>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="mb-4">
                    <label for="pdf-upload" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select PDF File
                    </label>
                    <input id="pdf-upload" type="file" accept=".pdf" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="mb-4">
                    <label for="chapter-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assign to Chapter
                    </label>
                    <select id="chapter-select" class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        ${Object.keys(currentSubject.chapters).map(chap => `<option value="${chap}">Chapter ${chap}</option>`).join('')}
                    </select>
                </div>
                <button onclick="processPDF()" class="btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm7-1.414L14.414 6H12a1 1 0 01-1-1V2.586zM7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                    Process PDF
                </button>
            </div>
        </div>
    `;
}

function processPDF() {
    showLoading("Processing PDF...");
    const fileInput = document.getElementById('pdf-upload');
    const chapter = document.getElementById('chapter-select').value;
    if (!fileInput.files.length) {
        hideLoading();
        alert("Please select a PDF file.");
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('chapter', chapter);

    // Note: Actual PDF processing requires a backend server.
    // This is a placeholder for frontend simulation.
    // Replace with actual API call to your backend processing script.
    setTimeout(() => {
        // Simulate fetching processed problems (replace with actual API response)
        const simulatedProblems = [
            { problem_number: 1, latex: "x^2 + 2x + 1 = 0" },
            { problem_number: 2, latex: "\\int_{0}^{1} x^2 \\, dx" }
        ];
        currentSubject.chapters[chapter].latex_problems.push(...simulatedProblems);
        saveData(data);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">PDF processed successfully! Added ${simulatedProblems.length} problems to Chapter ${chapter}.</p>
            </div>
        </div>`;
        hideLoading();
    }, 1000);
}

function exportData() {
    showLoading("Exporting Data...");
    setTimeout(() => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test_generator_data.json';
        a.click();
        URL.revokeObjectURL(url);
        document.getElementById('content').innerHTML = `
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="font-medium">Data exported successfully!</p>
            </div>
        </div>`;
        hideLoading();
    }, 500);
}

function importData() {
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Import Data</h2>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="mb-4">
                    <label for="data-import" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select JSON File
                    </label>
                    <input id="data-import" type="file" accept=".json" 
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <button onclick="processImport()" class="btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    Import Data
                </button>
            </div>
        </div>
    `;
}

function processImport() {
    showLoading("Importing Data...");
    const fileInput = document.getElementById('data-import');
    if (!fileInput.files.length) {
        hideLoading();
        alert("Please select a JSON file.");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData.subjects) throw new Error("Invalid data format");
            data = importedData;
            currentSubject = Object.values(data.subjects)[0];
            saveData(data);
            updateSubjectInfo();
            document.getElementById('content').innerHTML = `
            <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p class="font-medium">Data imported successfully!</p>
                </div>
            </div>`;
        } catch (err) {
            alert("Error importing data: " + err.message);
        }
        hideLoading();
    };
    reader.readAsText(file);
}

function exit() {
    showLoading("Exiting...");
    setTimeout(() => {
        document.getElementById('content').innerHTML = `
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-center animate-fade-in">
            <p class="text-lg font-medium text-gray-700 dark:text-gray-200">Thank you for using the Test Generator!</p>
            <p class="text-gray-500 dark:text-gray-400">Your progress has been saved.</p>
        </div>`;
        hideLoading();
    }, 500);
}

function showLoading(message) {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    updateCharts();
});

document.getElementById('close-dashboard').addEventListener('click', closeDashboard);

if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

updateSubjectInfo();