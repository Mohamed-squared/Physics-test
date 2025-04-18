const DATA_KEY = 'test_generator_data';
const usedQuestions = {
    '1': [1, 15, 28], '2': [1, 12, 23, 34, 44, 55, 66, 77], '3': [1, 14, 26, 39],
    '4': [1, 13, 24, 35, 47], '5': [1, 12, 24, 35, 46, 58, 69], '6': [1, 11, 21, 31, 41, 51, 61, 71],
    '7': [1, 12, 23, 34, 45, 56, 67]
};

let data = loadData();
let currentSubject = Object.values(data.subjects)[0];
let charts = {};

// State for online testing
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 7200; // 2 hours in seconds
let questions = []; // Global to store questions during online test
let examId = ''; // Global to store current exam ID during online test

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function loadData() {
    let data = JSON.parse(localStorage.getItem(DATA_KEY));
    if (!data) {
        data = {
            "subjects": {
                "1": {
                    "name": "Fundamentals of Physics",
                    "max_questions": 42,
                    "chapters": {},
                    "studied_chapters": [],
                    "pending_exams": [],
                    "past_exams": []
                }
            }
        };
        saveData(data);
    } else if (!data.subjects) {
        data = {
            subjects: {
                '1': {
                    name: "Fundamentals of Physics",
                    max_questions: 42,
                    chapters: data.chapters || {},
                    studied_chapters: data.studied_chapters || [],
                    pending_exams: data.pending_exams || [],
                    past_exams: data.past_exams || []
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
    // Load chapters from MD file
    fetchChapters();
    return data;
}

// Create a chapter parser function that extracts chapters and problems from an MD file
function parseChapters(text) {
    const chapters = {};
    const chapterRegex = /###\s*Chapter\s*(\d+):/i;
    const lines = text.split('\n');
    let currentChapter = null;
    let problems = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const chapterMatch = line.match(chapterRegex);
        
        if (chapterMatch) {
            // Save previous chapter if exists
            if (currentChapter) {
                chapters[currentChapter] = {
                    total_questions: problems.length,
                    problems: problems,
                    total_attempted: 0,
                    total_wrong: 0,
                    mistake_history: [],
                    consecutive_mastery: 0,
                    available_questions: Array.from({length: problems.length}, (_, i) => i + 1)
                };
            }
            
            // Start new chapter
            currentChapter = chapterMatch[1];
            problems = [];
        } 
        else if (line.match(/^\d+\.\s+/) && currentChapter) {
            // This is a problem
            let problemText = line;
            
            // Include following lines until next problem or chapter
            while (i + 1 < lines.length && 
                   !lines[i + 1].trim().match(/^\d+\.\s+/) && 
                   !lines[i + 1].trim().match(chapterRegex)) {
                i++;
                problemText += '\n' + lines[i];
            }
            
            problems.push(problemText.trim());
        }
    }
    
    // Save the last chapter
    if (currentChapter) {
        chapters[currentChapter] = {
            total_questions: problems.length,
            problems: problems,
            total_attempted: 0,
            total_wrong: 0,
            mistake_history: [],
            consecutive_mastery: 0,
            available_questions: Array.from({length: problems.length}, (_, i) => i + 1)
        };
    }
    
    return chapters;
}

function fetchChapters() {
    showLoading("Loading chapters...");
    fetch('output.md')
        .then(response => {
            if (!response.ok) throw new Error('MD file not found');
            return response.text();
        })
        .then(text => {
            const chapters = parseChapters(text);
            if (Object.keys(chapters).length === 0) {
                throw new Error('No chapters found in MD file');
            }
            currentSubject.chapters = chapters;
            saveData(data);
            updateChapterList();
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading MD file:', error);
            document.getElementById('content').innerHTML = `<p class="text-red-500">${error.message}</p>`;
            hideLoading();
        });
}

function parseProblem(text) {
    const lines = text.split('\n');
    const questionLine = lines[0];
    const questionMatch = questionLine.match(/^(\d+\.\s+.*?)(?:\s+A\..*|$)/);
    const question = questionMatch ? questionMatch[1] : questionLine;
    const options = [];
    let answer = '';
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^[A-E]\./.test(line)) options.push(line);
        else if (line.startsWith('ans:')) answer = line.split(':')[1].trim();
    }
    return { question, options, answer };
}

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

function updateSubjectInfo() {
    document.getElementById('subject-info').innerHTML = `<p class="text-lg">Current Subject: ${currentSubject.name}</p>`;
}

function showMarkChapters() {
    document.getElementById('content').innerHTML = `
        <div id="chapters-studied" class="mb-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-2 text-primary-600 dark:text-primary-400">Chapters Studied</h2>
            <div id="chapter-list" class="space-y-2"></div>
        </div>
    `;
    updateChapterList();
}

function updateChapterList() {
    const chapterList = document.getElementById('chapter-list');
    if (!chapterList) return;
    chapterList.innerHTML = '';
    const chapters = currentSubject.chapters;
    for (const chapNum in chapters) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `chapter-${chapNum}`;
        checkbox.checked = currentSubject.studied_chapters.includes(chapNum);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (!currentSubject.studied_chapters.includes(chapNum)) {
                    currentSubject.studied_chapters.push(chapNum);
                }
            } else {
                currentSubject.studied_chapters = currentSubject.studied_chapters.filter(c => c !== chapNum);
            }
            saveData(data);
            chapterList.insertAdjacentHTML('beforeend', `<p class="text-green-500">Chapter ${chapNum} updated.</p>`);
            setTimeout(() => chapterList.querySelector('p')?.remove(), 2000);
        });
        const label = document.createElement('label');
        label.htmlFor = `chapter-${chapNum}`;
        label.textContent = `Chapter ${chapNum} (${chapters[chapNum].total_questions} questions)`;
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        chapterList.appendChild(div);
    }
}

function showExamDashboard() {
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Exam Dashboard</h2>
            <div class="space-y-4">
                <button onclick="generateTest('studied')" class="btn-primary w-full">
                    Test on Studied Material
                </button>
                <button onclick="showSpecificChaptersForm()" class="btn-primary w-full">
                    Test on Specific Chapters
                </button>
            </div>
        </div>
    `;
}

function showSpecificChaptersForm() {
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Select Chapters</h2>
            <div class="mb-4">
                <label for="chapters-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter chapter numbers (comma-separated)
                </label>
                <input id="chapters-input" type="text" placeholder="e.g., 1,2,3" 
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <button onclick="generateTest('specific')" class="btn-primary w-full">
                Continue
            </button>
        </div>
    `;
}

function generateTest(type) {
    showLoading("Generating Test...");
    setTimeout(() => {
        let chaptersToUse;
        if (type === 'studied') {
            chaptersToUse = currentSubject.studied_chapters;
            if (chaptersToUse.length === 0) {
                document.getElementById('content').innerHTML = '<p class="text-red-500">No studied chapters available.</p>';
                hideLoading();
                return;
            }
        } else {
            const input = document.getElementById('chapters-input').value;
            chaptersToUse = input.split(',').map(c => c.trim()).filter(c => c in currentSubject.chapters);
            if (chaptersToUse.length === 0) {
                document.getElementById('content').innerHTML = '<p class="text-red-500">Invalid or no chapters selected.</p>';
                hideLoading();
                return;
            }
        }
        const chapters = Object.fromEntries(
            Object.entries(currentSubject.chapters).filter(([chapNum]) => chaptersToUse.includes(chapNum))
        );
        const allocation = allocateQuestions(chapters, currentSubject.max_questions);
        const selectedQuestions = {};
        for (let chapNum in allocation) {
            const n = allocation[chapNum];
            if (n > 0) {
                const questions = selectNewQuestions(chapters[chapNum], n);
                selectedQuestions[chapNum] = questions;
            }
        }
        const exam_id = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
        currentSubject.pending_exams.push({
            id: exam_id,
            allocation,
            selectedQuestions,
            chapters: chaptersToUse,
            results_entered: false
        });
        saveData(data);
        showTestingOptions(exam_id);
        hideLoading();
    }, 500);
}

function showTestingOptions(exam_id) {
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Choose Testing Method for Exam ${exam_id}</h2>
            <div class="space-y-4">
                <button onclick="startOnlineTest('${exam_id}')" class="btn-primary w-full">
                    Online Testing
                </button>
                <button onclick="generatePDFTest('${exam_id}')" class="btn-primary w-full">
                    PDF Testing
                </button>
            </div>
        </div>
    `;
}

function startOnlineTest(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }
    
    // Set up global state for the test
    examId = exam_id;
    questions = [];
    
    // Prepare questions for the test
    for (let chapNum in exam.selectedQuestions) {
        const chap = currentSubject.chapters[chapNum];
        exam.selectedQuestions[chapNum].forEach(qNum => {
            const problemText = chap.problems[qNum - 1];
            const parsed = parseProblem(problemText);
            questions.push({ 
                chapNum, 
                qNum, 
                question: parsed.question,
                options: parsed.options,
                answer: parsed.answer
            });
        });
    }
    
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 7200; // 2 hours
    
    // Make sure MathJax is loaded for LaTeX rendering
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize the test interface
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endOnlineTest();
        return;
    }
    
    const q = questions[currentQuestionIndex];
    
    // Clean question text for display (remove answer)
    let questionText = q.question.replace(/ans:[A-E]/, '');
    
    // Prepare options HTML if available
    let optionsHTML = '';
    if (q.options && q.options.length > 0) {
        optionsHTML = '<div class="options-container mt-4">';
        q.options.forEach(option => {
            const letter = option.match(/^([A-E])\./)[1];
            optionsHTML += `
                <div class="option-item p-2 mb-2 border rounded">
                    <input type="radio" name="answer" id="option-${letter}" value="${letter}">
                    <label for="option-${letter}" class="ml-2">${option}</label>
                </div>
            `;
        });
        optionsHTML += '</div>';
    } else {
        // Free response input
        optionsHTML = `
            <div class="mt-4">
                <input id="free-answer-input" type="text" class="input-field w-full" 
                    placeholder="Enter your answer">
            </div>
        `;
    }
    
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
            <div class="question-text mb-4">${questionText}</div>
            ${optionsHTML}
            <div class="flex space-x-4 mt-4">
                ${currentQuestionIndex > 0 ? 
                    '<button onclick="navigateToPreviousQuestion()" class="btn-secondary">Previous</button>' : ''}
                <button onclick="submitAnswer()" class="btn-primary">
                    ${currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
            <p id="timer" class="mt-4">Time Left: ${formatTime(timeLeft)}</p>
        </div>
    `;
    
    // Render LaTeX if present
    if (window.MathJax) {
        window.MathJax.typeset();
    }
}

function submitAnswer() {
    const q = questions[currentQuestionIndex];
    let answer = '';
    
    // Get answer based on question type
    if (q.options && q.options.length > 0) {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            answer = selectedOption.value;
        }
    } else {
        answer = document.getElementById('free-answer-input').value.trim();
    }
    
    // Save answer
    userAnswers[`${q.chapNum}-${q.qNum}`] = answer;
    
    // Move to next question
    currentQuestionIndex++;
    displayQuestion();
}

function navigateToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function getExamById(exam_id) {
    return currentSubject.pending_exams.find(exam => exam.id === exam_id) ||
           currentSubject.past_exams.find(exam => exam.id === exam_id);
}

// Exam Management
function createExam() {
    const examId = `E${Date.now()}`; // Unique ID based on timestamp
    const selectedQuestions = {};
    // Example logic to select questions (customize as needed)
    currentSubject.chapters.forEach((chapter, index) => {
        if (chapter.problems.length > 0) {
            selectedQuestions[index] = [1]; // Select first problem as an example
        }
    });
    const newExam = { id: examId, selectedQuestions };
    currentSubject.pending_exams = currentSubject.pending_exams || [];
    currentSubject.pending_exams.push(newExam);
    saveData(data); // Assuming saveData is defined earlier
    showExamsDashboard();
}



// Online Testing
function startOnlineTest(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }
    examId = exam_id;
    questions = [];
    for (let chapNum in exam.selectedQuestions) {
        const chap = currentSubject.chapters[chapNum];
        exam.selectedQuestions[chapNum].forEach(qNum => {
            const parsed = parseProblem(chap.problems[qNum - 1]);
            questions.push({ chapNum, qNum, ...parsed });
        });
    }
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 7200; // 2 hours
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endOnlineTest();
        return;
    }
    const q = questions[currentQuestionIndex];
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
            <p class="mb-4">${q.qNum}. ${q.question}</p>
            <input id="answer-input" type="text" class="input-field mb-4" placeholder="Your answer">
            <div class="flex space-x-4">
                <button onclick="submitAnswer()" class="btn-primary">${currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}</button>
            </div>
            <p id="timer" class="mt-4">Time Left: ${formatTime(timeLeft)}</p>
        </div>
    `;
}

function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    const q = questions[currentQuestionIndex];
    userAnswers[`${q.chapNum}-${q.qNum}`] = answer;
    currentQuestionIndex++;
    displayQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${formatTime(timeLeft)}`;
        if (timeLeft <= 0) endOnlineTest();
    }, 1000);
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function endOnlineTest() {
    clearInterval(timerInterval);
    let score = 0;
    questions.forEach(q => {
        if (userAnswers[`${q.chapNum}-${q.qNum}`] === q.answer) score++;
    });
    const percentage = ((score / questions.length) * 100).toFixed(2);
    const exam = getExamById(examId);
    exam.results = { score, total: questions.length, percentage };
    currentSubject.past_exams.push(exam);
    currentSubject.pending_exams = currentSubject.pending_exams.filter(e => e.id !== examId);
    saveData(data);
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Exam ${examId} Results</h2>
            <p>Score: ${score} / ${questions.length} (${percentage}%)</p>
            <button onclick="showExamsDashboard()" class="btn-primary mt-4">Back to Dashboard</button>
        </div>
    `;
}

// Helper function to get exam by ID
function getExamById(exam_id) {
    return (currentSubject.pending_exams || []).concat(currentSubject.past_exams || []).find(exam => exam.id === exam_id);
}

// Exams Dashboard
function showExamsDashboard() {
    const pendingExams = currentSubject.pending_exams || [];
    const pastExams = currentSubject.past_exams || [];

    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Exams Dashboard</h2>
            
            <h3 class="text-lg font-medium mb-2">Pending Exams</h3>
            <div class="mb-6">
                ${pendingExams.length === 0 ? 
                    '<p class="text-gray-500">No pending exams</p>' : 
                    `<ul class="space-y-2 mb-4">
                        ${pendingExams.map(exam => `
                            <li class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <span>Exam ${exam.id}</span>
                                <div>
                                    <button onclick="enterResults('${exam.id}')" class="btn-primary mr-2">Enter Results</button>
                                    <button onclick="startOnlineTest('${exam.id}')" class="btn-secondary mr-2">Resume Test</button>
                                    <button onclick="generatePDFTest('${exam.id}')" class="btn-secondary mr-2">PDF</button>
                                    <button onclick="deleteExam('${exam.id}', 'pending')" class="btn-danger">Delete</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>`
                }
            </div>
            
            <h3 class="text-lg font-medium mb-2">Past Exams</h3>
            <div>
                ${pastExams.length === 0 ? 
                    '<p class="text-gray-500">No past exams</p>' : 
                    `<ul class="space-y-2">
                        ${pastExams.map(exam => `
                            <li class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <span>Exam ${exam.id} - Score: ${exam.results ? exam.results.percentage + '%' : 'N/A'}</span>
                                <div>
                                    <button onclick="viewStats('${exam.id}')" class="btn-primary mr-2">View Stats</button>
                                    <button onclick="alterResults('${exam.id}')" class="btn-secondary mr-2">Alter Results</button>
                                    <button onclick="deleteExam('${exam.id}', 'past')" class="btn-danger">Delete</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>`
                }
            </div>
            
            <button onclick="showExamDashboard()" class="btn-primary mt-6">Back to Exam Creation</button>
        </div>
    `;
}

function viewStats(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam || !exam.results) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No results available.</p>';
        return;
    }
    
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Exam ${exam_id} Stats</h2>
            
            <div class="stats-container mb-4">
                <p>Score: ${exam.results.score} / ${exam.results.total} (${exam.results.percentage}%)</p>
                <p>Date: ${new Date(exam.id.replace(/-/g, ':')).toLocaleDateString()}</p>
                <p>Chapters: ${exam.chapters.join(', ')}</p>
            </div>
            
            <div class="chapter-breakdown mb-6">
                <h3 class="text-lg font-medium mb-2">Chapter Breakdown</h3>
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="text-left">Chapter</th>
                            <th class="text-left">Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(exam.allocation).map(([chapNum, count]) => `
                            <tr>
                                <td>Chapter ${chapNum}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <button onclick="showExamsDashboard()" class="btn-primary">Back to Dashboard</button>
        </div>
    `;
}

function alterResults(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }
    
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Alter Results for Exam ${exam_id}</h2>
            
            <div class="mb-4">
                <label for="score" class="block text-sm font-medium mb-1">Score</label>
                <input id="score" type="number" min="0" value="${exam.results?.score || 0}" 
                    class="input-field mb-4" placeholder="Score">
            </div>
            
            <div class="mb-4">
                <label for="total" class="block text-sm font-medium mb-1">Total Questions</label>
                <input id="total" type="number" min="1" value="${exam.results?.total || questions.length}" 
                    class="input-field mb-4" placeholder="Total Questions">
            </div>
            
            <div class="flex space-x-4">
                <button onclick="updateResults('${exam_id}')" class="btn-primary">Update Results</button>
                <button onclick="showExamsDashboard()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    `;
}

function updateResults(exam_id) {
    const score = parseInt(document.getElementById('score').value);
    const total = parseInt(document.getElementById('total').value);
    
    if (isNaN(score) || isNaN(total) || score < 0 || total < 1 || score > total) {
        alert('Please enter valid score and total values');
        return;
    }
    
    const exam = getExamById(exam_id);
    if (!exam) return;
    
    const percentage = ((score / total) * 100).toFixed(2);
    exam.results = { score, total, percentage };
    
    // If this was a pending exam, move it to past exams
    if (currentSubject.pending_exams.some(e => e.id === exam_id)) {
        currentSubject.past_exams.push(exam);
        currentSubject.pending_exams = currentSubject.pending_exams.filter(e => e.id !== exam_id);
    }
    
    saveData(data);
    showExamsDashboard();
}

function enterResults(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Enter Results for Exam ${exam_id}</h2>
            <input id="score" type="number" min="0" class="input-field mb-4" placeholder="Score">
            <input id="total" type="number" min="0" class="input-field mb-4" placeholder="Total Questions">
            <button onclick="submitResults('${exam_id}')" class="btn-primary">Submit</button>
        </div>
    `;
}

function submitResults(exam_id) {
    const score = parseInt(document.getElementById('score').value);
    const total = parseInt(document.getElementById('total').value);
    if (isNaN(score) || isNaN(total) || score > total) {
        alert('Invalid input');
        return;
    }
    const percentage = ((score / total) * 100).toFixed(2);
    const exam = getExamById(exam_id);
    exam.results = { score, total, percentage };
    currentSubject.past_exams.push(exam);
    currentSubject.pending_exams = currentSubject.pending_exams.filter(e => e.id !== exam_id);
    saveData(data);
    showExamsDashboard();
}

function alterResults(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam || !exam.results) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No results to alter.</p>';
        return;
    }
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4">Alter Results for Exam ${exam_id}</h2>
            <input id="score" type="number" value="${exam.results.score}" class="input-field mb-4" placeholder="Score">
            <input id="total" type="number" value="${exam.results.total}" class="input-field mb-4" placeholder="Total Questions">
            <button onclick="submitResults('${exam_id}')" class="btn-primary">Update</button>
        </div>
    `;
}

function viewStats(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam || !exam.results) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No results available.</p>';
        return;
    }
    document.getElementById('content').innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Exam ${exam_id} Stats</h2>
            <p>Score: ${exam.results.score} / ${exam.results.total} (${exam.results.percentage}%)</p>
        </div>
    `;
}

function alterResults(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }
    // Placeholder for result alteration UI
    document.getElementById('content').innerHTML = `<p>Alter results for exam ${exam_id} (implement UI as needed)</p>`;
}

function deleteExam(exam_id, type) {
    if (confirm(`Are you sure you want to delete exam ${exam_id}?`)) {
        if (type === 'pending') {
            currentSubject.pending_exams = currentSubject.pending_exams.filter(exam => exam.id !== exam_id);
        } else {
            currentSubject.past_exams = currentSubject.past_exams.filter(exam => exam.id !== exam_id);
        }
        saveData(data);
        showExamsDashboard(); // Refresh dashboard
    }
}

// PDF Testing
function generatePDFTest(exam_id) {
    const exam = getExamById(exam_id);
    if (!exam) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">Exam not found.</p>';
        return;
    }

    const { jsPDF } = window.jspdf;
    const questionsDoc = new jsPDF();
    const solutionsDoc = new jsPDF();
    
    // Add LaTeX-like headers (simulation as we're using jsPDF)
    const latexHeader = 
        "\\documentclass[12pt]{article}\n" +
        "\\usepackage{enumitem}\n" +
        "\\usepackage[margin=1.5cm]{geometry}\n" +
        "\\usepackage{tikz}\n" +
        "\\usepackage{graphicx}\n" +
        "\\usepackage{amsmath}\n\n" +
        "\\begin{document}\n" +
        "\\title{Exam Questions}\n" +
        `\\date{${new Date().toLocaleDateString()}}\n` +
        "\\maketitle\n\n";
    
    questionsDoc.setFontSize(9);
    questionsDoc.text(latexHeader, 10, 10);
    
    solutionsDoc.setFontSize(9);
    solutionsDoc.text(latexHeader.replace("Exam Questions", "Solution Manual"), 10, 10);
    
    let y = 40; // Start after the header
    
    questionsDoc.setFontSize(12);
    solutionsDoc.setFontSize(12);

    // Add questions from each chapter
    for (let chapNum in exam.selectedQuestions) {
        const chap = currentSubject.chapters[chapNum];
        const questionNums = exam.selectedQuestions[chapNum];
        
        questionNums.forEach(qNum => {
            const problemText = chap.problems[qNum - 1];
            const parsed = parseProblem(problemText);
            
            // Question document
            if (y > 270) {
                questionsDoc.addPage();
                y = 20;
            }
            const questionOnly = parsed.question.replace(/ans:[A-E]/, '');
            questionsDoc.text(questionOnly, 10, y);
            
            // Solution document
            if (y > 270) {
                solutionsDoc.addPage();
                y = 20;
            }
            solutionsDoc.text(`${parsed.question} (Ans: ${parsed.answer})`, 10, y);
            
            y += 15; // Adjust spacing between questions
        });
    }
    
    // Add LaTeX footer
    const latexFooter = "\\end{document}";
    questionsDoc.text(latexFooter, 10, y);
    solutionsDoc.text(latexFooter, 10, y);

    const date = new Date().toISOString().split('T')[0];
    questionsDoc.save(`Questions_${exam_id}_${date}.pdf`);
    solutionsDoc.save(`Solution_manual_${exam_id}_${date}.pdf`);
    
    document.getElementById('content').innerHTML = '<p class="text-green-500">PDFs generated successfully.</p>';
}

// Utility Functions
function showLoading(message) {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateSubjectInfo(); // Assuming this exists from earlier messages
});

// Add a new subject
function addSubject(name, max_questions) {
    const subjectId = Object.keys(data.subjects).length + 1;
    data.subjects[subjectId] = {
        name: name,
        max_questions: max_questions,
        chapters: {},
        studied_chapters: [],
        pending_exams: [],
        past_exams: []
    };
    saveData(data);
    switchSubject(subjectId); // Switch to the newly added subject
}

// Switch to a different subject
function switchSubject(subjectId) {
    if (data.subjects[subjectId]) {
        currentSubject = data.subjects[subjectId];
        updateSubjectInfo();
        fetchChapters(); // Reload chapters for the new subject
    } else {
        console.error('Subject not found');
        document.getElementById('content').innerHTML = '<p class="text-red-500">Subject not found.</p>';
    }
}

// UI to manage subjects
function showSubjectManagement() {
    const subjects = data.subjects;
    let html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Subject Management</h2>
            <div class="mb-4">
                <input id="new-subject-name" type="text" placeholder="Subject Name" class="input-field mr-2">
                <input id="new-subject-max" type="number" placeholder="Max Questions" class="input-field mr-2">
                <button onclick="addSubject(document.getElementById('new-subject-name').value, parseInt(document.getElementById('new-subject-max').value))" class="btn-primary">Add Subject</button>
            </div>
            <h3 class="text-lg font-medium mb-2">Current Subjects</h3>
            <ul class="space-y-2">
    `;
    for (const [id, subject] of Object.entries(subjects)) {
        html += `
            <li class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span>${subject.name}</span>
                <button onclick="switchSubject('${id}')" class="btn-primary">Switch</button>
            </li>
        `;
    }
    html += '</ul></div>';
    document.getElementById('content').innerHTML = html;
}

function parseProblem(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return { question: 'Invalid problem', options: [], answer: '' };

    // Extract question (first line up to options or end)
    const questionMatch = lines[0].match(/^(\d+\.\s+.*?)(?=\s+[A-E]\.|$)/);
    const question = questionMatch ? questionMatch[1] : lines[0];
    
    const options = [];
    let answer = '';
    let inOptions = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^[A-E]\.\s+/.test(line)) {
            inOptions = true;
            options.push(line);
        } else if (line.startsWith('ans:') && !inOptions) {
            answer = line.split(':')[1].trim();
        } else if (inOptions && line.startsWith('ans:')) {
            answer = line.split(':')[1].trim();
        } else if (line && !inOptions) {
            // Append to question if no options yet
            question += '\n' + line;
        }
    }

    // Fallback: if no 'ans:' found, assume last option is correct (common in some formats)
    if (!answer && options.length > 0) {
        answer = options[options.length - 1].match(/^[A-E]/)[0];
    }

    return { question, options, answer };
}

function saveData(data) {
    try {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving data:', e);
        document.getElementById('content').innerHTML = '<p class="text-red-500">Failed to save data.</p>';
    }
}

function loadData() {
    let data = JSON.parse(localStorage.getItem(DATA_KEY));
    if (!data || typeof data !== 'object') {
        data = {
            subjects: {
                '1': {
                    name: "Fundamentals of Physics",
                    max_questions: 42,
                    chapters: {},
                    studied_chapters: [],
                    pending_exams: [],
                    past_exams: []
                }
            }
        };
    } else if (!data.subjects) {
        // Migrate old data format
        data = {
            subjects: {
                '1': {
                    name: "Fundamentals of Physics",
                    max_questions: 42,
                    chapters: data.chapters || {},
                    studied_chapters: data.studied_chapters || [],
                    pending_exams: data.pending_exams || [],
                    past_exams: data.past_exams || []
                }
            }
        };
    }

    // Validate and initialize chapter data
    for (const subject of Object.values(data.subjects)) {
        for (const chap of Object.values(subject.chapters)) {
            chap.mistake_history = chap.mistake_history || [];
            chap.consecutive_mastery = chap.consecutive_mastery || 0;
            chap.available_questions = chap.available_questions || 
                Array.from({ length: chap.total_questions || 0 }, (_, i) => i + 1);
            chap.total_attempted = chap.total_attempted || 0;
            chap.total_wrong = chap.total_wrong || 0;
        }
    }

    saveData(data);
    fetchChapters(); // Load chapters into the first subject by default
    return data;
}