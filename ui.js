// ui.js
import { loadData, saveData, generateExam, calculateDifficulty } from './data.js';

export let currentSubject = null;

export function initUI() {
    const data = loadData();
    currentSubject = data.subjects[Object.keys(data.subjects)[0]]; // Default to first subject
}

export function showSubject() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('content').innerHTML = '';
    document.getElementById('dashboard').classList.add('hidden');
}

export function generateTest() {
    const exam = generateExam(currentSubject);
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Today's Test</h2>
            <p class="dark:text-gray-300">${exam.questions.map(q => `Ch. ${q.chapter}: Q${q.number}`).join('<br>')}</p>
            <button id="back-to-menu" class="btn-primary mt-4">Back to Menu</button>
        </div>
    `;
    document.getElementById('back-to-menu').addEventListener('click', showSubject);
}

export function showEnterResults() {
    const data = loadData();
    const pending = currentSubject.pending_exams;
    if (!pending.length) {
        alert('No pending exams to enter results for.');
        return;
    }
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Enter Test Results</h2>
            <div id="results-inputs">
                ${pending[0].questions.map((q, i) => `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ch. ${q.chapter} Q${q.number} Correct?</label>
                        <input type="checkbox" class="result-checkbox mt-1" data-index="${i}">
                    </div>
                `).join('')}
            </div>
            <button id="submit-results-btn" class="btn-primary mr-2">Submit Results</button>
            <button id="cancel-results-btn" class="btn-secondary">Cancel</button>
        </div>
    `;
    document.getElementById('submit-results-btn').addEventListener('click', enterTestResults);
    document.getElementById('cancel-results-btn').addEventListener('click', showSubject);
}

function enterTestResults() {
    const checkboxes = document.querySelectorAll('.result-checkbox');
    const results = Array.from(checkboxes).map(cb => cb.checked);
    let data = loadData();
    const exam = data.subjects[currentSubject.id].pending_exams.shift();
    exam.questions.forEach((q, i) => {
        const chapter = data.subjects[currentSubject.id].chapters[q.chapter];
        chapter.total_attempted = (chapter.total_attempted || 0) + 1;
        if (results[i]) {
            chapter.correct_streak = (chapter.correct_streak || 0) + 1;
            chapter.wrong_streak = 0;
        } else {
            chapter.wrong_answers = (chapter.wrong_answers || 0) + 1;
            chapter.wrong_streak = (chapter.wrong_streak || 0) + 1;
            chapter.correct_streak = 0;
        }
    });
    saveData(data);
    showSubject();
}

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
            <button id="add-chapter-btn" class="btn-secondary mb-4">Add Another Chapter</button>
            <div>
                <button id="submit-chapters-btn" class="btn-primary mr-2">Submit Chapters</button>
                <button id="cancel-chapters-btn" class="btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    document.getElementById('add-chapter-btn').addEventListener('click', addChapterInput);
    document.getElementById('submit-chapters-btn').addEventListener('click', submitChapters);
    document.getElementById('cancel-chapters-btn').addEventListener('click', showSubject);
}

function addChapterInput() {
    const div = document.createElement('div');
    div.classList.add('chapter-input', 'mb-4');
    div.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Chapter Number</label>
        <input type="number" min="1" class="chapter-number mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Total Questions</label>
        <input type="number" min="1" class="total-questions mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm">
    `;
    document.getElementById('chapter-inputs').appendChild(div);
}

function submitChapters() {
    const chapterNumbers = document.querySelectorAll('.chapter-number');
    const totalQuestions = document.querySelectorAll('.total-questions');
    let data = loadData();
    chapterNumbers.forEach((numInput, i) => {
        const num = parseInt(numInput.value);
        const total = parseInt(totalQuestions[i].value);
        if (num && total) {
            data.subjects[currentSubject.id].chapters[num] = {
                total_questions: total,
                total_attempted: 0,
                wrong_answers: 0,
                correct_streak: 0,
                wrong_streak: 0
            };
        }
    });
    saveData(data);
    showSubject();
}

export function showDeleteExam() {
    const data = loadData();
    if (!data.subjects[currentSubject.id].pending_exams.length) {
        alert('No pending exams to delete.');
        return;
    }
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Delete Pending Exam</h2>
            <p class="dark:text-gray-300">Delete the oldest pending exam?</p>
            <button id="confirm-delete-btn" class="btn-primary mr-2">Yes</button>
            <button id="cancel-delete-btn" class="btn-secondary">No</button>
        </div>
    `;
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        let data = loadData();
        data.subjects[currentSubject.id].pending_exams.shift();
        saveData(data);
        showSubject();
    });
    document.getElementById('cancel-delete-btn').addEventListener('click', showSubject);
}

export function showManageSubjects() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('content').innerHTML = `
        <div class="max-w-md mx-auto p-4">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Manage Subjects</h2>
            <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2 dark:text-white">Current Subjects</h3>
                <ul id="subject-list" class="list-disc pl-5 dark:text-gray-300">
                    ${Object.values(loadData().subjects).map(subject => `
                        <li>${subject.name} <button class="delete-subject-btn text-red-500" data-id="${subject.id}">Delete</button></li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-2 dark:text-white">Add New Subject</h3>
                <input id="new-subject-name" type="text" placeholder="Subject Name" class="w-full mb-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <input id="new-subject-max-questions" type="number" min="1" placeholder="Max Questions" class="w-full mb-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <button id="add-subject-btn" class="btn-primary w-full">Add Subject</button>
            </div>
            <button id="back-to-subject-btn" class="btn-secondary mt-4">Back to Subject</button>
        </div>
    `;
    document.getElementById('add-subject-btn').addEventListener('click', addSubject);
    document.getElementById('back-to-subject-btn').addEventListener('click', showSubject);
    document.querySelectorAll('.delete-subject-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteSubject(btn.dataset.id));
    });
}

function addSubject() {
    const name = document.getElementById('new-subject-name').value;
    const maxQuestions = parseInt(document.getElementById('new-subject-max-questions').value);
    if (!name || isNaN(maxQuestions) || maxQuestions < 1) {
        alert("Please enter valid subject name and max questions.");
        return;
    }
    let data = loadData();
    const newId = Math.max(...Object.keys(data.subjects).map(Number)) + 1;
    data.subjects[newId] = {
        id: newId,
        name,
        max_questions: maxQuestions,
        chapters: {},
        pending_exams: []
    };
    saveData(data);
    showManageSubjects();
}

function deleteSubject(id) {
    let data = loadData();
    if (Object.keys(data.subjects).length <= 1) {
        alert("Cannot delete the last subject.");
        return;
    }
    delete data.subjects[id];
    currentSubject = data.subjects[Object.keys(data.subjects)[0]]; // Switch to remaining subject
    saveData(data);
    showManageSubjects();
}