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
                        28, 29, 30, 31, 32, 33, 34, /IR37, 38, 39, 40, 41, 42, 43, 44, 47, 48, 49, 50,
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
        // Initialize with provided JSON data
        data = JSON.parse(JSON.stringify(initialData));
        saveData(data);
    } else if (!data.subjects) {
        // Migrate old data format
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

let data = loadData();
let currentSubject = Object.values(data.subjects)[0];

function updateSubjectInfo() {
    document.getElementById('subject-info').innerHTML = `<p class="text-lg">Current Subject: ${currentSubject.name}</p>`;
}

function generateTest() {
    let chapters = currentSubject.chapters;
    let max_questions = currentSubject.max_questions;
    if (Object.keys(chapters).length === 0) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No chapters available. Please add chapters first.</p>';
        return;
    }
    let allocation = allocateQuestions(chapters, max_questions);
    let exam_id = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
    let output = `<p class="font-bold">Generating test for exam ID: ${exam_id}</p>`;
    output += `<p>Today’s test allocation (${max_questions} questions total):</p>`;
    for (let chap_num in allocation) {
        let n = allocation[chap_num];
        if (n > 0) {
            let questions = selectNewQuestions(chapters[chap_num], n);
            output += `<p>Chapter ${chap_num}: ${n} questions - select questions ${questions.join(', ')}</p>`;
        }
    }
    currentSubject.pending_exams.push({id: exam_id, allocation, results_entered: false});
    saveData(data);
    document.getElementById('content').innerHTML = output;
}

function showEnterResults() {
    let pending_exams = currentSubject.pending_exams;
    if (pending_exams.length === 0) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No pending exams to enter results for.</p>';
        return;
    }
    let output = '<p class="font-bold">Select an exam to enter results for:</p>';
    pending_exams.forEach((exam, i) => {
        output += `<p><button onclick="enterResults(${i})" class="text-blue-500 underline">${i + 1}. ${exam.id}</button></p>`;
    });
    document.getElementById('content').innerHTML = output;
}

function enterResults(index) {
    let exam = currentSubject.pending_exams[index];
    let allocation = exam.allocation;
    let output = `<p class="font-bold">Entering results for exam ${exam.id}:</p>`;
    let inputs = [];
    for (let chap_num in allocation) {
        let n = allocation[chap_num];
        if (n > 0) {
            output += `<p>Chapter ${chap_num}: number of wrong answers (0 to ${n}): <input id="wrong-${chap_num}" type="number" min="0" max="${n}" class="border rounded px-2 py-1"></p>`;
            inputs.push(chap_num);
        }
    }
    output += `<button onclick="submitResults(${index}, ${JSON.stringify(inputs)})" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>`;
    document.getElementById('content').innerHTML = output;
}

function submitResults(index, chap_nums) {
    let exam = currentSubject.pending_exams[index];
    let chapters = currentSubject.chapters;
    for (let chap_num of chap_nums) {
        let n = exam.allocation[chap_num];
        let wrong = parseInt(document.getElementById(`wrong-${chap_num}`).value);
        if (isNaN(wrong) || wrong < 0 || wrong > n) {
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
    document.getElementById('content').innerHTML = '<p class="text-green-500">Results entered successfully.</p>';
}

function showAddChapters() {
    let output = `
        <p class="font-bold">Add New Chapters</p>
        <p>Number of new chapters: <input id="num-chapters" type="number" min="1" class="border rounded px-2 py-1"></p>
        <button onclick="addChaptersForm()" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Next</button>
    `;
    document.getElementById('content').innerHTML = output;
}

function addChaptersForm() {
    let num_chapters = parseInt(document.getElementById('num-chapters').value);
    if (isNaN(num_chapters) || num_chapters < 1) {
        alert("Please enter a positive integer.");
        return;
    }
    let output = '<p class="font-bold">Enter Chapter Details</p>';
    let inputs = [];
    for (let i = 0; i < num_chapters; i++) {
        output += `
            <p>Chapter number: <input id="chap-num-${i}" type="text" class="border rounded px-2 py-1"></p>
            <p>Total questions: <input id="chap-questions-${i}" type="number" min="1" class="border rounded px-2 py-1"></p>
        `;
        inputs.push(i);
    }
    output += `<button onclick="submitChapters(${JSON.stringify(inputs)})" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>`;
    document.getElementById('content').innerHTML = output;
}

function submitChapters(indices) {
    let chapters = currentSubject.chapters;
    for (let i of indices) {
        let chap_num = document.getElementById(`chap-num-${i}`).value;
        let total_questions = parseInt(document.getElementById(`chap-questions-${i}`).value);
        if (chap_num in chapters) {
            alert(`Chapter ${chap_num} already exists.`);
            return;
        }
        if (!chap_num || isNaN(total_questions) || total_questions < 1) {
            alert("Please enter valid chapter number and questions.");
            return;
        }
        chapters[chap_num] = {
            total_questions,
            total_attempted: 0,
            total_wrong: 0,
            available_questions: Array.from({length: total_questions}, (_, j) => j + 1),
            mistake_history: [],
            consecutive_mastery: 0
        };
    }
    saveData(data);
    document.getElementById('content').innerHTML = '<p class="text-green-500">New chapters added!</p>';
}

function showDeleteExam() {
    let pending_exams = currentSubject.pending_exams;
    if (pending_exams.length === 0) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No pending exams to delete.</p>';
        return;
    }
    let output = '<p class="font-bold">Select an exam to delete:</p>';
    pending_exams.forEach((exam, i) => {
        output += `<p><button onclick="deleteExam(${i})" class="text-blue-500 underline">${i + 1}. ${exam.id}</button></p>`;
    });
    document.getElementById('content').innerHTML = output;
}

function deleteExam(index) {
    let exam = currentSubject.pending_exams[index];
    let chapters = currentSubject.chapters;
    if (exam.results_entered) {
        let output = `<p class="font-bold">Exam ${exam.id} has results entered. Enter original wrong answers:</p>`;
        let inputs = [];
        for (let chap_num in exam.allocation) {
            let n = exam.allocation[chap_num];
            if (n > 0) {
                output += `<p>Chapter ${chap_num}: original wrong answers (0 to ${n}): <input id="wrong-${chap_num}" type="number" min="0" max="${n}" class="border rounded px-2 py-1"></p>`;
                inputs.push(chap_num);
            }
        }
        output += `<button onclick="submitDelete(${index}, ${JSON.stringify(inputs)})" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>`;
        document.getElementById('content').innerHTML = output;
    } else {
        currentSubject.pending_exams.splice(index, 1);
        saveData(data);
        document.getElementById('content').innerHTML = `<p class="text-green-500">Exam ${exam.id} deleted successfully.</p>`;
    }
}

function submitDelete(index, chap_nums) {
    let exam = currentSubject.pending_exams[index];
    let chapters = currentSubject.chapters;
    for (let chap_num of chap_nums) {
        let n = exam.allocation[chap_num];
        let wrong = parseInt(document.getElementById(`wrong-${chap_num}`).value);
        if (isNaN(wrong) || wrong < 0 || wrong > n) {
            alert(`Invalid input for Chapter ${chap_num}. Must be between 0 and ${n}.`);
            return;
        }
        chapters[chap_num].total_attempted -= n;
        chapters[chap_num].total_wrong -= wrong;
        if (chapters[chap_num].mistake_history.length > 0) {
            chapters[chap_num].mistake_history.pop();
        }
    }
    currentSubject.pending_exams.splice(index, 1);
    saveData(data);
    document.getElementById('content').innerHTML = `<p class="text-green-500">Exam ${exam.id} deleted successfully.</p>`;
}

function showManageSubjects() {
    let output = `
        <p class="font-bold">Subject Management</p>
        <p><button onclick="addSubject()" class="text-blue-500 underline">1. Add new subject</button></p>
        <p><button onclick="editSubject()" class="text-blue-500 underline">2. Edit existing subject</button></p>
        <p><button onclick="selectSubject()" class="text-blue-500 underline">3. Select subject</button></p>
        <p><button onclick="updateSubjectInfo(); document.getElementById('content').innerHTML = '';" class="text-blue-500 underline">4. Back to main menu</button></p>
    `;
    document.getElementById('content').innerHTML = output;
}

function addSubject() {
    let output = `
        <p class="font-bold">Add New Subject</p>
        <p>Name: <input id="subject-name" type="text" class="border rounded px-2 py-1"></p>
        <p>Max questions for tests: <input id="max-questions" type="number" min="1" class="border rounded px-2 py-1"></p>
        <button onclick="submitSubject()" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>
    `;
    document.getElementById('content').innerHTML = output;
}

function submitSubject() {
    let name = document.getElementById('subject-name').value;
    let max_questions = parseInt(document.getElementById('max-questions').value);
    if (!name || isNaN(max_questions) || max_questions < 1) {
        alert("Please enter a valid name and positive number of questions.");
        return;
    }
    let subject_id = (Math.max(...Object.keys(data.subjects).map(Number), 0) + 1).toString();
    data.subjects[subject_id] = {name, max_questions, chapters: {}, pending_exams: []};
    saveData(data);
    document.getElementById('content').innerHTML = `<p class="text-green-500">Subject ${name} (ID: ${subject_id}) added!</p>`;
}

function editSubject() {
    let subjects = data.subjects;
    let output = '<p class="font-bold">Edit Subject</p>';
    for (let sid in subjects) {
        output += `<p><button onclick="editSubjectForm('${sid}')" class="text-blue-500 underline">${sid}. ${subjects[sid].name} (Max Questions: ${subjects[sid].max_questions})</button></p>`;
    }
    document.getElementById('content').innerHTML = output;
}

function editSubjectForm(sid) {
    let subject = data.subjects[sid];
    let output = `
        <p class="font-bold">Edit Subject ${subject.name}</p>
        <p>New name: <input id="subject-name" type="text" value="${subject.name}" class="border rounded px-2 py-1"></p>
        <p>New max questions: <input id="max-questions" type="number" min="1" value="${subject.max_questions}" class="border rounded px-2 py-1"></p>
        <button onclick="submitEditSubject('${sid}')" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>
    `;
    document.getElementById('content').innerHTML = output;
}

function submitEditSubject(sid) {
    let name = document.getElementById('subject-name').value;
    let max_questions = parseInt(document.getElementById('max-questions').value);
    if (!name || isNaN(max_questions) || max_questions < 1) {
        alert("Please enter a valid name and positive number of questions.");
        return;
    }
    data.subjects[sid].name = name;
    data.subjects[sid].max_questions = max_questions;
    saveData(data);
    if (currentSubject === data.subjects[sid]) {
        currentSubject = data.subjects[sid];
        updateSubjectInfo();
    }
    document.getElementById('content').innerHTML = '<p class="text-green-500">Subject updated!</p>';
}

function selectSubject() {
    let subjects = data.subjects;
    let output = '<p class="font-bold">Select a Subject</p>';
    for (let sid in subjects) {
        output += `<p><button onclick="setSubject('${sid}')" class="text-blue-500 underline">${sid}. ${subjects[sid].name}</button></p>`;
    }
    document.getElementById('content').innerHTML = output;
}

function setSubject(sid) {
    currentSubject = data.subjects[sid];
    updateSubjectInfo();
    document.getElementById('content').innerHTML = '<p class="text-green-500">Subject selected!</p>';
}

function exit() {
    document.getElementById('content').innerHTML = '<p class="text-green-500">Goodbye!</p>';
    setTimeout(() => window.close(), 1000);
}

function exportData() {
    const data = JSON.parse(localStorage.getItem(DATA_KEY));
    if (!data) {
        document.getElementById('content').innerHTML = '<p class="text-red-500">No data to export.</p>';
        return;
    }
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_generator_data_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('content').innerHTML = '<p class="text-green-500">Data exported successfully.</p>';
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData.subjects) {
                    document.getElementById('content').innerHTML = '<p class="text-red-500">Invalid data format. Must contain "subjects".</p>';
                    return;
                }
                if (confirm("Are you sure you want to import this data? This will overwrite the existing data.")) {
                    localStorage.setItem(DATA_KEY, JSON.stringify(importedData));
                    location.reload(); // Reload to apply new data
                }
            } catch (error) {
                document.getElementById('content').innerHTML = '<p class="text-red-500">Invalid JSON file.</p>';
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

updateSubjectInfo();