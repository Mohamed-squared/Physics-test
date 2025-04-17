/**
 * UI rendering and event handling for the test generator website.
 */
import { loadData, saveData, allocateQuestions, selectNewQuestions, DATA_KEY } from './data.js';

/** Current subject (fixed to the first subject) */
let currentSubject = null;

/**
 * Initializes the UI by setting up the current subject and initial view.
 */
export function initUI() {
    let data = loadData();
    currentSubject = data.subjects['1']; // Assume first subject is "Fundamentals of Physics"
    showSubject();
}

/**
 * Displays the form to add chapters to the current subject.
 */
export function showAddChapters() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Add Chapters to ${currentSubject.name}</h2>
            <div id="chapter-inputs">
                <div class="chapter-input mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Chapter Number</label>
                    <input type="number" min="1" class="chapter-number mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Total Questions</label>
                    <input type="number" min="1" class="total-questions mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
                </div>
            </div>
            <button class="btn-secondary mb-4" onclick="addChapterInput()">Add Another Chapter</button>
            <div>
                <button class="btn-primary mr-2" onclick="submitChapters()">Submit Chapters</button>
                <button class="btn-secondary" onclick="showSubject()">Cancel</button>
            </div>
        </div>
    `;
}

/**
 * Adds an additional chapter input field to the form.
 */
export function addChapterInput() {
    const div = document.createElement('div');
    div.className = 'chapter-input mb-4';
    div.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Chapter Number</label>
        <input type="number" min="1" class="chapter-number mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Total Questions</label>
        <input type="number" min="1" class="total-questions mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
    `;
    document.getElementById('chapter-inputs').appendChild(div);
}

/**
 * Submits the chapters form, adding chapters to the current subject.
 */
export function submitChapters() {
    let chapter_inputs = document.getElementsByClassName('chapter-input');
    let chapters = [];
    for (let input of chapter_inputs) {
        let chap_num = parseInt(input.querySelector('.chapter-number').value);
        let total_questions = parseInt(input.querySelector('.total-questions').value);
        if (isNaN(chap_num) || isNaN(total_questions) || chap_num < 1 || total_questions < 1) {
            alert("Please enter valid chapter number and total questions.");
            return;
        }
        chapters.push({chap_num, total_questions});
    }
    let data = loadData();
    for (let {chap_num, total_questions} of chapters) {
        data.subjects['1'].chapters[chap_num] = {
            total_questions,
            total_attempted: 0,
            total_wrong: 0,
            available_questions: Array.from({length: total_questions}, (_, i) => i + 1),
            mistake_history: [],
            consecutive_mastery: 0
        };
    }
    saveData(data);
    currentSubject = data.subjects['1'];
    showSubject();
}

/**
 * Displays the main subject view with options and pending exams.
 */
export function showSubject() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('subject-info').innerHTML = `
        <h2 class="text-xl font-semibold text-primary-600 dark:text-primary-400">${currentSubject.name}</h2>
        <p>Max questions per test: ${currentSubject.max_questions}</p>
    `;
    document.getElementById('content').innerHTML = `
        <div>
            <h3 class="text-lg font-semibold mt-6 mb-2 dark:text-white">Chapters</h3>
            <ul class="list-disc pl-5 dark:text-gray-300">
                ${Object.keys(currentSubject.chapters).length === 0 ? '<li>No chapters added.</li>' : 
                  Object.entries(currentSubject.chapters).map(([num, chap]) => `
                    <li>Chapter ${num}: ${chap.total_questions} questions, ${chap.total_attempted} attempted, ${chap.total_wrong} wrong</li>
                  `).join('')}
            </ul>
            <h3 class="text-lg font-semibold mt-6 mb-2 dark:text-white">Pending Exams</h3>
            <ul class="list-disc pl-5 dark:text-gray-300">
                ${currentSubject.pending_exams.length === 0 ? '<li>No pending exams.</li>' : 
                  currentSubject.pending_exams.map(exam => `
                    <li>
                        Exam ${exam.id}: ${Object.entries(exam.allocation).map(([chap, num]) => `Ch${chap}: ${num}q`).join(', ')}
                        ${exam.results_entered ? '' : `<button class="btn-primary ml-2" onclick="enterTestResults('${exam.id}')">Enter Results</button>`}
                    </li>
                  `).join('')}
            </ul>
        </div>
    `;
}

/**
 * Generates a new test for the current subject.
 */
export function generateTest() {
    if (Object.keys(currentSubject.chapters).length === 0) {
        alert("Please add chapters before generating a test.");
        return;
    }
    let data = loadData();
    let exam_id = new Date().toISOString().replace(/T/, '_').replace(/:..$/, '');
    let allocation = allocateQuestions(currentSubject.chapters, currentSubject.max_questions);
    let questionsByChapter = {};
    for (let chap_num in allocation) {
        let num_questions = allocation[chap_num];
        if (num_questions > 0) {
            questionsByChapter[chap_num] = selectNewQuestions(data.subjects['1'].chapters[chap_num], num_questions);
        }
    }
    data.subjects['1'].pending_exams.push({id: exam_id, allocation, results_entered: false});
    saveData(data);
    currentSubject = data.subjects['1'];
    showGeneratedTest(exam_id, allocation, questionsByChapter);
}

/**
 * Displays the generated test details.
 * @param {string} exam_id - ID of the generated exam.
 * @param {Object} allocation - Question allocation per chapter.
 * @param {Object} questionsByChapter - Selected questions per chapter.
 */
export function showGeneratedTest(exam_id, allocation, questionsByChapter) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div>
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Generated Test: ${exam_id}</h2>
            ${Object.entries(questionsByChapter).map(([chap, questions]) => `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold dark:text-white">Chapter ${chap}</h3>
                    <p class="dark:text-gray-300">Questions: ${questions.join(', ')}</p>
                    <p class="dark:text-gray-300">Number of questions: ${allocation[chap]}</p>
                </div>
            `).join('')}
            <button class="btn-primary" onclick="showSubject()">Back to Subject</button>
        </div>
    `;
}

/**
 * Displays the form to enter test results for pending exams.
 */
export function showEnterResults() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Enter Test Results</h2>
            <select id="exam-select" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 mb-4">
                <option value="">Select an Exam</option>
                ${currentSubject.pending_exams.filter(e => !e.results_entered).map(exam => `
                    <option value="${exam.id}">Exam ${exam.id}</option>
                `).join('')}
            </select>
            <button class="btn-primary mr-2" onclick="selectExamForResults()">Enter Results</button>
            <button class="btn-secondary" onclick="showSubject()">Cancel</button>
        </div>
    `;
}

/**
 * Handles selection of an exam for entering results.
 */
export function selectExamForResults() {
    const exam_id = document.getElementById('exam-select').value;
    if (!exam_id) {
        alert("Please select an exam.");
        return;
    }
    enterTestResults(exam_id);
}

/**
 * Displays the form to enter test results for a specific exam.
 * @param {string} exam_id - ID of the exam to enter results for.
 */
export function enterTestResults(exam_id) {
    let exam = currentSubject.pending_exams.find(e => e.id === exam_id);
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Enter Results for Exam ${exam_id}</h2>
            ${Object.entries(exam.allocation).map(([chap_num, num_questions]) => `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chapter ${chap_num} (${num_questions} questions): Number of wrong answers
                    </label>
                    <input type="number" min="0" max="${num_questions}" 
                           class="wrong-input mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm" 
                           data-chapter="${chap_num}">
                </div>
            `).join('')}
            <div>
                <button class="btn-primary mr-2" onclick="submitTestResults('${exam_id}')">Submit Results</button>
                <button class="btn-secondary" onclick="showSubject()">Cancel</button>
            </div>
        </div>
    `;
}

/**
 * Submits test results and updates chapter statistics.
 * @param {string} exam_id - ID of the exam.
 */
export function submitTestResults(exam_id) {
    let data = loadData();
    let exam = data.subjects['1'].pending_exams.find(e => e.id === exam_id);
    let wrong_inputs = document.getElementsByClassName('wrong-input');
    let results = {};
    for (let input of wrong_inputs) {
        let chap_num = input.dataset.chapter;
        let wrong = parseInt(input.value);
        if (isNaN(wrong) || wrong < 0 || wrong > exam.allocation[chap_num]) {
            alert(`Please enter a valid number of wrong answers for Chapter ${chap_num}.`);
            return;
        }
        results[chap_num] = wrong;
    }
    for (let chap_num in results) {
        let chap = data.subjects['1'].chapters[chap_num];
        let num_questions = exam.allocation[chap_num];
        let wrong = results[chap_num];
        chap.total_attempted += num_questions;
        chap.total_wrong += wrong;
        chap.mistake_history.push(wrong);
        if (wrong === 0) {
            chap.consecutive_mastery = (chap.consecutive_mastery || 0) + 1;
        } else {
            chap.consecutive_mastery = 0;
        }
    }
    exam.results_entered = true;
    saveData(data);
    currentSubject = data.subjects['1'];
    showSubject();
}

/**
 * Displays the form to delete a pending exam.
 */
export function showDeleteExam() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Delete an Exam</h2>
            <select id="exam-select" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 mb-4">
                <option value="">Select an Exam</option>
                ${currentSubject.pending_exams.map(exam => `
                    <option value="${exam.id}">Exam ${exam.id}</option>
                `).join('')}
            </select>
            <button class="btn-danger mr-2" onclick="deleteExam()">Delete Exam</button>
            <button class="btn-secondary" onclick="showSubject()">Cancel</button>
        </div>
    `;
}

/**
 * Deletes the selected exam.
 */
export function deleteExam() {
    const exam_id = document.getElementById('exam-select').value;
    if (!exam_id) {
        alert("Please select an exam to delete.");
        return;
    }
    let data = loadData();
    data.subjects['1'].pending_exams = data.subjects['1'].pending_exams.filter(e => e.id !== exam_id);
    saveData(data);
    currentSubject = data.subjects['1'];
    showSubject();
}

/**
 * Displays a placeholder for managing subjects (single-subject mode).
 */
export function showManageSubjects() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Manage Subjects</h2>
            <p class="dark:text-gray-300">Currently, only one subject (${currentSubject.name}) is supported.</p>
            <button class="btn-primary mt-4" onclick="showSubject()">Back to Subject</button>
        </div>
    `;
}