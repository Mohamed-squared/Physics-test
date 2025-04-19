const DATA_KEY = 'test_generator_data_v2'; // Changed key for new structure
// Remove usedQuestions - selection logic will handle this
// const usedQuestions = { ... };

// --- Configuration ---
// REPLACE WITH THE RAW URL OF YOUR MARKDOWN FILE ON GITHUB
const MARKDOWN_FILE_URL = 'chapters.md';
const LATEX_PDF_HEADER = `\\documentclass[12pt]{article}
\\usepackage{enumitem} % For customizing list labels
\\usepackage[margin=1.5cm]{geometry}
\\usepackage{tikz}
\\usepackage{graphicx}
\\usepackage{amsmath} % For mathematical expressions
\\usepackage{amsfonts} % Common math fonts
\\usepackage{amssymb} % More symbols
\\usepackage{xcolor}  % For colors if needed
\\usepackage{hyperref} % For clickable links if needed
\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=magenta}

\\begin{document}
`;
const LATEX_PDF_FOOTER = `\\end{document}`;
const ONLINE_TEST_DURATION_MINUTES = 120; // 2 hours

// Default structure if no data exists
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

// --- Core Data & State ---
let data = null; // Loaded in initializeApp
let currentSubject = null; // Set in initializeApp
let markdownContentCache = null; // Cache for the fetched MD file
let charts = {}; // For the progress dashboard
let currentOnlineTestState = null; // Holds state during an online test

// --- Utility Functions ---
function saveData(dataToSave) {
    localStorage.setItem(DATA_KEY, JSON.stringify(dataToSave));
}

async function loadData() {
    console.log("Loading data...");
    let loadedData = JSON.parse(localStorage.getItem(DATA_KEY));
    if (!loadedData || !loadedData.subjects || Object.keys(loadedData.subjects).length === 0) {
        console.log("No valid data found in localStorage, initializing...");
        loadedData = JSON.parse(JSON.stringify(initialData));
        // Ensure default subject has necessary fields
        if (!loadedData.subjects["1"]) {
           loadedData.subjects["1"] = JSON.parse(JSON.stringify(initialData.subjects["1"]));
        }
    } else {
        console.log("Data loaded from localStorage.");
        // --- Data Migration/Validation ---
        for (const subjectId in loadedData.subjects) {
            const subject = loadedData.subjects[subjectId];
            subject.id = subject.id || subjectId; // Ensure ID exists
            subject.studied_chapters = subject.studied_chapters || [];
            subject.pending_exams = subject.pending_exams || [];
            subject.exam_history = subject.exam_history || [];
            subject.max_questions_per_test = subject.max_questions_per_test || 42;
            subject.chapters = subject.chapters || {};

            for (const chapNum in subject.chapters) {
                const chap = subject.chapters[chapNum];
                // Keep existing stats, but total_questions will be updated from MD
                chap.total_attempted = chap.total_attempted || 0;
                chap.total_wrong = chap.total_wrong || 0;
                chap.mistake_history = chap.mistake_history || [];
                chap.consecutive_mastery = chap.consecutive_mastery || 0;
                // available_questions will be repopulated after MD parse
            }
        }
    }

    // --- Fetch and Parse Markdown ---
    try {
        console.log("Fetching Markdown file:", MARKDOWN_FILE_URL);
        const response = await fetch(MARKDOWN_FILE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        markdownContentCache = await response.text();
        console.log("Markdown file fetched successfully.");

        // Update chapter info in all subjects based on MD
        for (const subjectId in loadedData.subjects) {
             updateChaptersFromMarkdown(loadedData.subjects[subjectId], markdownContentCache);
        }
        saveData(loadedData); // Save potentially updated chapter counts/availability
        console.log("Chapter data updated from Markdown.");

    } catch (error) {
        console.error("Error fetching or parsing Markdown file:", error);
        markdownContentCache = null; // Ensure cache is null on error
        // Decide how to handle failure: load without MD? Show error?
        // For now, continue with potentially stale chapter data if loadedData exists
        if (!loadedData) { // If initialization failed AND fetch failed
             alert("FATAL: Could not initialize data or load chapters from Markdown. Please check the URL and network connection.");
             return null; // Indicate fatal error
        } else {
             alert("Warning: Could not fetch or parse the chapter Markdown file. Using potentially outdated chapter information. Please check the URL and network connection.");
        }
    }

    return loadedData;
}

function showLoading(message) {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

function renderLatex() {
    if (window.renderMathInElement) {
        try {
            window.renderMathInElement(document.getElementById('content'), {
                 delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
             window.renderMathInElement(document.getElementById('online-test-area'), { // Also render in test area
                 delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        } catch (error) {
            console.error("KaTeX rendering error:", error);
        }
    } else {
        console.warn("KaTeX auto-render not loaded yet.");
    }
}

// --- Markdown Parsing ---

function updateChaptersFromMarkdown(subject, mdContent) {
    const parsedChapters = parseChaptersFromMarkdown(mdContent);
    const existingChapters = subject.chapters || {};
    const updatedChapters = {};

    for (const chapNum in parsedChapters) {
        const parsedChap = parsedChapters[chapNum];
        if (existingChapters[chapNum]) {
            // Update total_questions, keep existing stats
            updatedChapters[chapNum] = {
                ...existingChapters[chapNum],
                total_questions: parsedChap.total_questions,
                // Recalculate available_questions based on new total and existing attempts
                // This is complex. Simpler: just reset available if total changes?
                // Safer approach: Reset available questions if total changes.
                available_questions: (existingChapters[chapNum].total_questions !== parsedChap.total_questions)
                    ? Array.from({ length: parsedChap.total_questions }, (_, j) => j + 1)
                    : existingChapters[chapNum].available_questions || Array.from({ length: parsedChap.total_questions }, (_, j) => j + 1),
            };
             // Ensure available_questions doesn't contain numbers > new total_questions
             if (updatedChapters[chapNum].available_questions) {
                updatedChapters[chapNum].available_questions = updatedChapters[chapNum].available_questions.filter(q => q <= parsedChap.total_questions);
             }

        } else {
            // New chapter found in MD
            updatedChapters[chapNum] = {
                total_questions: parsedChap.total_questions,
                total_attempted: 0,
                total_wrong: 0,
                available_questions: Array.from({ length: parsedChap.total_questions }, (_, j) => j + 1),
                mistake_history: [],
                consecutive_mastery: 0
            };
        }
    }

     // Handle chapters that were in data but NOT in MD (optional: mark as inactive or remove?)
     // For now, let's keep them but maybe log a warning.
     for (const chapNum in existingChapters) {
         if (!parsedChapters[chapNum]) {
             console.warn(`Chapter ${chapNum} exists in data but not found in the Markdown file. Keeping existing data.`);
             // Optionally remove or mark inactive:
             // delete updatedChapters[chapNum];
             // Or add a flag: updatedChapters[chapNum].isActive = false;
              if (!updatedChapters[chapNum]) { // Keep it if it wasn't already handled (e.g., total changed)
                 updatedChapters[chapNum] = existingChapters[chapNum];
             }
         }
     }


    subject.chapters = updatedChapters;
}

// --- Markdown Parsing (REVISED) ---

function parseChaptersFromMarkdown(mdContent) {
    const chapters = {};
    if (!mdContent) return chapters;

    const lines = mdContent.split('\n');
    let currentChapter = null;
    let questionCount = 0;

    // Regex to find chapter lines: Allow optional leading text/numbers before "Chapter"
    // Matches "### Chapter X: TITLE", "XXX Chapter X: TITLE", etc. Case-insensitive for "Chapter".
    const chapterRegex = /^(?:.*?\s+)?###\s+Chapter\s+(\d+):?.*?$/i;
    // Question regex: starts with number(.) or number() followed by space. Allows leading whitespace.
    const questionRegex = /^\s*\d+[\.\)]\s+.*/;

    for (const line of lines) {
        const trimmedLine = line.trim();
        const chapterMatch = trimmedLine.match(chapterRegex);

        if (chapterMatch) {
            // Finalize previous chapter's count if one was active
            if (currentChapter !== null && questionCount > 0) {
                 // Ensure the chapter entry exists before assigning count
                 if (!chapters[currentChapter]) {
                     chapters[currentChapter] = { number: currentChapter, total_questions: 0 };
                 }
                 chapters[currentChapter].total_questions = questionCount;
                 console.log(`---> Finalized Chapter ${currentChapter} with ${questionCount} questions.`);
            }
            // Start new chapter
            currentChapter = chapterMatch[1]; // Chapter number is group 1
            questionCount = 0; // Reset question count
            // Initialize chapter entry if it doesn't exist
            if (!chapters[currentChapter]) {
                 chapters[currentChapter] = { number: currentChapter, total_questions: 0 };
            }
            console.log(`---> Found Chapter ${currentChapter}`);
        } else if (currentChapter !== null && questionRegex.test(line)) {
             // Count line as a question only if we are inside a chapter
             // and the line matches the question format.
            questionCount++;
             // console.log(`    Q${questionCount} in Ch ${currentChapter}: ${line.substring(0, 30)}...`);
        }
    }

    // Finalize the last chapter's count
    if (currentChapter !== null && questionCount > 0) {
         if (!chapters[currentChapter]) { // Ensure entry exists
             chapters[currentChapter] = { number: currentChapter, total_questions: 0 };
         }
         chapters[currentChapter].total_questions = questionCount;
         console.log(`---> Finalized LAST Chapter ${currentChapter} with ${questionCount} questions.`);
    }

     console.log("Final Parsed Chapters Object:", JSON.stringify(chapters, null, 2));
    if (Object.keys(chapters).length === 0) {
        console.error("ERROR: No chapters were parsed. Check chapterRegex and MD format.");
    }
    return chapters;
}

// --- (updateChaptersFromMarkdown remains the same as before) ---

function extractQuestionsFromMarkdown(mdContent, selectedQuestionsMap) {
    // selectedQuestionsMap = { "chapterNumString": [qNumInt1, qNumInt2], ... }
    const extracted = {
        questions: [], // { id, chapter, number, text, image, answer } <- Storing answer here temporarily
        answers: {}    // { "c<chapter>q<question>": "A", ... }
    };
    if (!markdownContentCache) { // Use the global cache
        console.error("Markdown content cache is empty in extractQuestionsFromMarkdown");
        return extracted;
    }
    if (!selectedQuestionsMap || Object.keys(selectedQuestionsMap).length === 0) {
         console.error("selectedQuestionsMap is empty or invalid");
        return extracted;
    }

    console.log("Extracting questions for map:", JSON.stringify(selectedQuestionsMap));

    const lines = markdownContentCache.split('\n');
    let currentChapter = null;
    let currentQuestionNumber = null;
    let currentQuestionLines = [];
    let inQuestion = false;

    // Regex needs to match the actual chapter headings in *this* file
    const chapterRegex = /^###\s+Chapter\s+(\d+):?.*?$/i;
     // Regex to find the start of a question (number. or number) )
     const questionStartRegex = /^\s*(\d+)\s*[\.\)]\s*(.*)/;
     // Regex to find the answer line - more robust to capture only the letter/number
     // Allows optional leading/trailing text as long as "ans:" or "answer:" is present
     const answerRegex = /^(.*?)(?:ans|answer)\s*:\s*([a-zA-Z\d])(?:\s+.*)?$/i;
     const imageRegex = /!\[(.*?)\]\((.*?)\)/; // Basic Markdown image

    function finalizeQuestion() {
        if (inQuestion && currentChapter && currentQuestionNumber) {
            let combinedText = currentQuestionLines.join('\n').trim();
            let answer = null;
            let cleanText = combinedText; // Start with full text

            // Check if the *last line* contains the answer pattern
            if (currentQuestionLines.length > 0) {
                const lastLine = currentQuestionLines[currentQuestionLines.length - 1].trim();
                const answerMatch = lastLine.match(answerRegex);
                if (answerMatch) {
                    // Extract the answer letter/digit
                    answer = answerMatch[2].toUpperCase();
                    // Remove the matched answer part (and potentially preceding text on the same line)
                    // from the *last line* before rejoining.
                    // This is safer than removing the whole last line.
                    currentQuestionLines[currentQuestionLines.length - 1] = answerMatch[1].trim(); // Keep text before "ans:"
                    cleanText = currentQuestionLines.join('\n').trim();
                }
            }

            const questionId = `c${currentChapter}q${currentQuestionNumber}`;
            const imageMatch = cleanText.match(imageRegex);
            const imageUrl = imageMatch ? imageMatch[2] : null;

            extracted.questions.push({
                id: questionId,
                chapter: currentChapter, // string
                number: currentQuestionNumber, // number
                text: cleanText,
                image: imageUrl,
                answer: answer // Temporarily store answer with question data
            });
            // console.log(`Extracted Q: ${questionId} (Ch: ${currentChapter}, Num: ${currentQuestionNumber}), Answer: ${answer}`);
        }
        // Reset for next potential question
        inQuestion = false;
        currentQuestionLines = [];
        // Keep currentChapter, reset currentQuestionNumber
        currentQuestionNumber = null;
    }


    for (let i = 0; i < lines.length; i++) {
         const line = lines[i];
         const trimmedLine = line.trim();

        const chapterMatch = trimmedLine.match(chapterRegex);
        if (chapterMatch) {
            finalizeQuestion(); // Finalize any question from the previous chapter
            currentChapter = chapterMatch[1]; // This is a string
            // console.log(`--> Switched to Chapter ${currentChapter}`);
            continue; // Move to next line, don't process chapter header as question content
        }

         if (currentChapter === null) continue; // Skip lines before the first chapter header

        const questionMatch = line.match(questionStartRegex); // Match against original line to preserve indentation maybe?
        if (questionMatch) {
            // Found a potential start of a new question
            finalizeQuestion(); // Finalize the previous question first

            const qNum = parseInt(questionMatch[1], 10);
            const firstLineText = questionMatch[2].trim();

            // Check if this chapter and question number are needed
            const chapterKey = String(currentChapter); // Ensure we use string key for lookup
            if (selectedQuestionsMap[chapterKey] && selectedQuestionsMap[chapterKey].includes(qNum)) {
                 // console.log(`--> Starting selected question: Ch ${chapterKey} Q ${qNum}`);
                 inQuestion = true;
                 currentQuestionNumber = qNum;
                 currentQuestionLines.push(line.trim()); // Add the first line (already trimmed somewhat)
            } else {
                 // This line starts a question, but not one we selected
                 inQuestion = false;
            }
        } else if (inQuestion) {
            // This line is part of the currently processed question
            // Don't add blank lines unless intended (e.g., for code blocks)
             if (trimmedLine.length > 0 || line.length > 0) { // Add line even if only whitespace, might be intended format
               currentQuestionLines.push(line); // Preserve original spacing/indentation
             }
        }
    }
    finalizeQuestion(); // Finalize the very last question after the loop

     // Separate answers into the answers map
     extracted.questions.forEach(q => {
         if (q.answer) {
             extracted.answers[q.id] = q.answer;
         }
         // delete q.answer; // Remove temporary answer storage from question object
     });

    console.log(`Extraction finished. Found ${extracted.questions.length} questions.`);
    if (extracted.questions.length === 0 && Object.keys(selectedQuestionsMap).length > 0) {
         console.error("Extraction failed: No questions extracted despite selection map.");
    }
    return extracted;
}

// --- (extractFullQuestionTextForPdf remains the same as before, but ensure it uses the correct chapterRegex) ---
function extractFullQuestionTextForPdf(mdContent, chapterNumber, questionNumber) {
    // Extracts the full text including the answer line for a specific question
    if (!mdContent) return "";

    const lines = mdContent.split('\n');
    let inTargetChapter = false;
    let inTargetQuestion = false;
    let questionLines = [];
    let foundQuestion = false;

    // Use the same regex as the main extractors
    const chapterRegex = /^###\s+Chapter\s+(\d+):?.*?$/i;
    const questionStartRegex = /^\s*(\d+)\s*[\.\)]\s+.*/; // Match start, don't capture text here

    for (const line of lines) {
        const trimmedLine = line.trim();
        const chapterMatch = trimmedLine.match(chapterRegex);

        if (chapterMatch) {
            if (inTargetQuestion) break; // Moved past the question's chapter
            inTargetChapter = (chapterMatch[1] === String(chapterNumber));
            inTargetQuestion = false; // Reset question flag when chapter changes
             // console.log(`PDF Extractor: Checking Chapter ${chapterMatch[1]}. Target Chapter: ${chapterNumber}. Match: ${inTargetChapter}`);
        } else if (inTargetChapter) {
            const questionMatch = line.match(questionStartRegex);
            if (questionMatch) {
                // This line starts *a* question within the target chapter
                if (inTargetQuestion) break; // Found the start of the *next* question

                const qNum = parseInt(questionMatch[1], 10);
                 // console.log(`PDF Extractor: Found Q line for Q ${qNum}. Target Q: ${questionNumber}.`);
                if (qNum === questionNumber) {
                    // console.log(`PDF Extractor: MATCH! Starting Q ${qNum}.`);
                    inTargetQuestion = true;
                    foundQuestion = true;
                    questionLines.push(line); // Add the first line
                }
            } else if (inTargetQuestion) {
                // Append line if inside the target question block
                questionLines.push(line);
            }
        }
    }
    return foundQuestion ? questionLines.join('\n').trim() : ""; // Return joined text if found
}


// --- Difficulty & Allocation ---

function calculateDifficulty(chap) {
    // Clamp total_wrong to be <= total_attempted if data is inconsistent
    const attempted = Math.max(chap.total_attempted || 0, 0);
    const wrong = Math.min(Math.max(chap.total_wrong || 0, 0), attempted);

    if (attempted > 0) {
        let error_rate = wrong / attempted;
        // Ensure base difficulty is at least 10, even with 0 errors after attempts
        let base_difficulty = Math.max(error_rate * 100, 10);

        // Calculate consecutive mistakes from the *end* of the history
        let consecutive_mistakes = 0;
        if (chap.mistake_history && chap.mistake_history.length > 0) {
            for (let i = chap.mistake_history.length - 1; i >= 0; i--) {
                if (chap.mistake_history[i] > 0) {
                    consecutive_mistakes++;
                } else {
                    break; // Stop at the first non-mistake (0 wrong answers)
                }
            }
        }
        // Increase difficulty significantly for consecutive mistakes
        let difficultyScore = base_difficulty + (consecutive_mistakes * 20);
        return Math.min(difficultyScore, 150); // Cap difficulty (e.g., at 150%)
    }
    // If never attempted, assume maximum difficulty to prioritize it
    return 100; // Use 100 as default for unattempted
}


function allocateQuestions(chaptersToConsider, total_test_questions) {
    // chaptersToConsider: object { chapNum: chapterData, ... } already filtered
    let weights = {};
    let availableChapterCount = 0;

    for (let chap_num in chaptersToConsider) {
        let chap = chaptersToConsider[chap_num];
        // Only consider chapters that actually have questions defined
        if (chap.total_questions > 0) {
             availableChapterCount++;
             let mastery = chap.consecutive_mastery || 0;
             // Adjust weight based on mastery: lower weight if mastered
             let weight_factor = mastery >= 6 ? 0.3 : mastery >= 3 ? 0.6 : 1.0; // More aggressive reduction
             // Consider available questions count - chapters with fewer available shouldn't dominate
             // let availability_factor = Math.min((chap.available_questions?.length || 0) / chap.total_questions, 1.0);
             // Weight based on difficulty and mastery. Base weight can be difficulty score.
             weights[chap_num] = calculateDifficulty(chap) * weight_factor;
        }
    }

    let sum_w = Object.values(weights).reduce((a, b) => a + b, 0);

    // Handle edge cases: no chapters or zero total weight
    if (availableChapterCount === 0 || sum_w === 0) {
        // Cannot allocate if no chapters available or all have zero weight (e.g., all mastered heavily)
        // Fallback: distribute evenly among chapters that *have* questions, ignoring weight/mastery
        const chaptersWithQuestions = Object.keys(chaptersToConsider).filter(c => chaptersToConsider[c].total_questions > 0);
         if (chaptersWithQuestions.length === 0) return {}; // Truly no chapters
         const questionsPerChapter = Math.floor(total_test_questions / chaptersWithQuestions.length);
         let remainder = total_test_questions % chaptersWithQuestions.length;
         const fallbackAllocations = {};
         chaptersWithQuestions.forEach((c, index) => {
             fallbackAllocations[c] = questionsPerChapter + (index < remainder ? 1 : 0);
             // Ensure allocation doesn't exceed total questions in chapter
             fallbackAllocations[c] = Math.min(fallbackAllocations[c], chaptersToConsider[c].total_questions);
         });
         // Redistribute if capping caused total to be less than requested
         let currentTotal = Object.values(fallbackAllocations).reduce((a, b) => a + b, 0);
         let deficit = total_test_questions - currentTotal;
         while (deficit > 0 && chaptersWithQuestions.some(c => fallbackAllocations[c] < chaptersToConsider[c].total_questions)) {
             for (const c of chaptersWithQuestions) {
                 if (deficit <= 0) break;
                 if (fallbackAllocations[c] < chaptersToConsider[c].total_questions) {
                     fallbackAllocations[c]++;
                     deficit--;
                 }
             }
         }
         console.warn("Allocation fallback: distributing evenly due to zero weight or no chapters.");
         return fallbackAllocations;
    }


    let proportions = Object.fromEntries(Object.entries(weights).map(([k, w]) => [k, w / sum_w]));
    let expected = Object.fromEntries(Object.entries(proportions).map(([k, p]) => [k, total_test_questions * p]));

    // Initial allocation (floor) + ensure min 1 question if weight > 0 and chapter has questions
    let allocations = {};
    for (const k in expected) {
         allocations[k] = Math.floor(expected[k]);
         if (weights[k] > 0 && chaptersToConsider[k].total_questions > 0 && allocations[k] === 0) {
             // Give at least one question if it has weight and questions available, unless total is already met by others
              // This logic is tricky with the remainder distribution. Let's rely on remainder distribution first.
             // allocations[k] = 1;
         }
         // Cap allocation at the total number of questions in the chapter
         allocations[k] = Math.min(allocations[k], chaptersToConsider[k].total_questions);
    }

    let total_allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
    let remaining = total_test_questions - total_allocated;

    // Distribute remaining based on fractional parts (remainders)
    if (remaining > 0) {
        let remainders = Object.fromEntries(Object.keys(chaptersToConsider)
           .filter(c => chaptersToConsider[c].total_questions > 0) // Only consider chapters with questions
           .map(c => [c, expected[c] - allocations[c]]));

        let sorted_chaps = Object.entries(remainders).sort((a, b) => b[1] - a[1]);

        for (let i = 0; i < remaining; i++) {
            // Cycle through sorted chapters, skipping those already at their max question count
            let foundChapter = false;
            for (let j = 0; j < sorted_chaps.length; j++) {
                 const chap_num = sorted_chaps[(i + j) % sorted_chaps.length][0]; // Cycle through sorted
                 if (allocations[chap_num] < chaptersToConsider[chap_num].total_questions) {
                     allocations[chap_num]++;
                     foundChapter = true;
                     break; // Allocate one and move to next remaining question
                 }
            }
             if (!foundChapter) {
                 // This should theoretically not happen if remaining > 0 and there are chapters below their max
                 console.warn("Could not allocate remaining questions. Total allocated might be less than requested.");
                 break; // Stop if no chapter can accept more questions
             }
        }
    }

     // Final check: Ensure no chapter exceeds its total questions (should be handled, but belt-and-suspenders)
     for (const chap_num in allocations) {
         allocations[chap_num] = Math.min(allocations[chap_num], chaptersToConsider[chap_num].total_questions);
     }

     // Final check: If total allocated is still less than requested (due to capping), log it.
     let final_allocated_sum = Object.values(allocations).reduce((a, b) => a + b, 0);
     if (final_allocated_sum < total_test_questions) {
          console.warn(`Final allocation (${final_allocated_sum}) is less than requested (${total_test_questions}) due to limits in chapter question counts.`);
     }


    return allocations;
}


// --- Question Selection ---

function selectQuestions(available, n, totalChapterQuestions) {
    // available: array of available question numbers [2, 5, 10, ...]
    // n: number of questions to select
    // totalChapterQuestions: total number of questions in this chapter (e.g., 50)

    if (n <= 0) return [];
    if (available.length === 0) {
        console.warn("selectQuestions called with no available questions.");
        return []; // Cannot select if none are available
    }

    const numAvailable = available.length;
    const actualN = Math.min(n, numAvailable); // Cannot select more than available

    if (actualN === 0) return [];
    if (actualN === numAvailable) return available.slice().sort((a, b) => a - b); // Return all available if n >= available

    // Strategy: Prioritize spreading out across the *entire chapter range*
    // rather than just the available range. This avoids clustering if many
    // early questions were answered.

    // Create indices spanning the *total* question range
    const step = (totalChapterQuestions - 1) / (actualN - 1) || 1; // Avoid division by zero if n=1
    let targetIndices = Array.from({ length: actualN }, (_, i) => Math.round(i * step));
    targetIndices = [...new Set(targetIndices)].sort((a,b)=>a-b); // Ensure unique, sorted indices

    // Map target indices (0 to total-1) to target question numbers (1 to total)
    let targetQuestions = targetIndices.map(idx => idx + 1);

    // Find the *closest available* question for each target question
    let selected = [];
    let usedAvailableIndices = new Set();

    for (const targetQ of targetQuestions) {
        let bestMatch = -1;
        let minDistance = Infinity;
        let bestIndex = -1;

        for (let i = 0; i < available.length; i++) {
            if (!usedAvailableIndices.has(i)) {
                const dist = Math.abs(available[i] - targetQ);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = available[i];
                    bestIndex = i;
                } else if (dist === minDistance) {
                    // Tie-breaking: prefer lower question number? Or doesn't matter?
                    // Let's stick with the first one found for simplicity.
                }
            }
        }

        if (bestIndex !== -1) {
            selected.push(bestMatch);
            usedAvailableIndices.add(bestIndex);
        }
    }

     // If we selected fewer than actualN (due to duplicates or weird distribution)
     // fill the remainder greedily from unused available questions.
     let currentSelectedCount = selected.length;
     if (currentSelectedCount < actualN) {
         const remainingAvailable = available.filter((_, index) => !usedAvailableIndices.has(index));
         selected.push(...remainingAvailable.slice(0, actualN - currentSelectedCount));
     }


    return selected.sort((a, b) => a - b);
}

function selectNewQuestionsAndUpdate(chap, n) {
    // Selects n questions AND updates chap.available_questions
    if (n <= 0) return [];

    // Ensure available_questions is initialized and valid
    if (!chap.available_questions || !Array.isArray(chap.available_questions)) {
        chap.available_questions = Array.from({ length: chap.total_questions }, (_, i) => i + 1);
    }
     // Clean up available_questions: remove duplicates and sort
     chap.available_questions = [...new Set(chap.available_questions)].sort((a,b) => a-b);

    let available = chap.available_questions.slice(); // Work with a copy
    let selected = [];

    if (available.length >= n) {
        // Use the improved selection logic
        selected = selectQuestions(available, n, chap.total_questions);
        // Update the chapter's actual available list
        chap.available_questions = available.filter(q => !selected.includes(q));
    } else {
        // Not enough available, select all available and maybe recycle?
        console.warn(`Chapter ${chap.number || 'Unknown'}: Not enough unique available questions (${available.length}) for request (${n}). Selecting all available.`);
        selected = available.slice(); // Select all available
        chap.available_questions = []; // Mark all as used for this round

        // --- Recycling Strategy (Optional) ---
        // If you *must* return 'n' questions, you need to recycle previously answered ones.
        // This is complex: which ones to recycle? Least recently wrong? Randomly?
        // For now, let's just return fewer than requested if not enough unique are available.
        // let remainingNeeded = n - selected.length;
        // if (remainingNeeded > 0) {
        //    // Implement recycling logic here if needed
        //    // e.g., pick from all questions minus the 'selected' ones
        //    console.log(`Need to recycle ${remainingNeeded} questions.`);
        // }
    }

    return selected.sort((a, b) => a - b);
}


// --- UI Functions ---

function updateSubjectInfo() {
    if (currentSubject) {
        document.getElementById('subject-info').innerHTML = `<p class="text-lg">Current Subject: ${currentSubject.name}</p>`;
    } else {
         document.getElementById('subject-info').innerHTML = `<p class="text-lg text-red-500">No Subject Selected</p>`;
    }
}

function displayContent(html) {
    document.getElementById('content').innerHTML = html;
    // Attempt to render LaTeX if content might contain it
    requestAnimationFrame(renderLatex);
}

function clearContent() {
    document.getElementById('content').innerHTML = '';
     document.getElementById('online-test-area').classList.add('hidden');
     document.getElementById('online-test-area').innerHTML = ''; // Clear test area too
     document.getElementById('menu').classList.remove('hidden'); // Ensure main menu is visible
     document.getElementById('dashboard').classList.add('hidden'); // Hide progress dashboard
}

// --- Test Generation ---

function showTestGenerationDashboard() {
    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Generate New Test</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Choose the scope of your test:</p>
            <div class="space-y-3">
                <button onclick="promptTestType('studied')" class="w-full btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0114.5 16c-1.255 0-2.443-.29-3.5-.804V4.804A7.968 7.968 0 0114.5 4z"/></svg>
                    Test Studied Chapters Only
                </button>
                <button onclick="promptChapterSelectionForTest()" class="w-full btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm8.707 3.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    Test Specific Chapters
                </button>
            </div>
        </div>
    `;
    displayContent(html);
}

function promptChapterSelectionForTest() {
    const chapters = currentSubject.chapters;
    const chapterNumbers = Object.keys(chapters).sort((a, b) => parseInt(a) - parseInt(b));

    if (chapterNumbers.length === 0) {
        displayContent('<p class="text-red-500">No chapters available in this subject to select from.</p>');
        return;
    }

    let chapterOptionsHtml = chapterNumbers.map(num => `
        <div class="flex items-center">
            <input id="test-chap-${num}" type="checkbox" value="${num}" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
            <label for="test-chap-${num}" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Chapter ${num} (${chapters[num].total_questions} questions)
            </label>
        </div>
    `).join('');

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Select Chapters for Test</h2>
            <div class="space-y-2 mb-6 max-h-60 overflow-y-auto p-2 border dark:border-gray-600 rounded">
                ${chapterOptionsHtml}
            </div>
            <button onclick="getSelectedChaptersAndPromptTestType()" class="w-full btn-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                Continue
            </button>
             <button onclick="showTestGenerationDashboard()" class="w-full btn-secondary mt-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                Back
            </button>
        </div>
    `;
    displayContent(html);
}

function getSelectedChaptersAndPromptTestType() {
    const selectedChapters = [];
    const checkboxes = document.querySelectorAll('input[id^="test-chap-"]:checked');
    checkboxes.forEach(cb => selectedChapters.push(cb.value));

    if (selectedChapters.length === 0) {
        alert("Please select at least one chapter.");
        return;
    }
    promptTestType('specific', selectedChapters);
}

function promptTestType(mode, selectedChapters = null) {
    // mode: 'studied' or 'specific'
    // selectedChapters: array of chapter numbers if mode is 'specific'

    let chapterScopeDescription = "";
    let relevantChapters = {};
    let chapterCount = 0;

    if (mode === 'studied') {
        const studied = currentSubject.studied_chapters || [];
        if (studied.length === 0) {
            displayContent('<p class="text-red-500">No chapters marked as studied. Please mark some chapters first or choose specific chapters.</p><button onclick="showManageStudiedChapters()" class="btn-secondary mt-4">Manage Studied Chapters</button>');
            return;
        }
        studied.forEach(chapNum => {
            if (currentSubject.chapters[chapNum]) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
            }
        });
        chapterCount = studied.length;
        chapterScopeDescription = `Based on your ${chapterCount} studied chapter(s).`;
    } else if (mode === 'specific' && selectedChapters) {
        selectedChapters.forEach(chapNum => {
            if (currentSubject.chapters[chapNum]) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
            }
        });
        chapterCount = selectedChapters.length;
        chapterScopeDescription = `Based on the ${chapterCount} selected chapter(s).`;
    } else {
         displayContent('<p class="text-red-500">Invalid test mode or chapter selection.</p>');
         return;
    }

     if (Object.keys(relevantChapters).length === 0) {
          displayContent('<p class="text-red-500">Could not find data for the selected/studied chapters.</p>');
         return;
     }

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Choose Test Format</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">${chapterScopeDescription}</p>
            <div class="space-y-3">
                <button onclick='startTestGeneration(${JSON.stringify(mode)}, ${JSON.stringify(selectedChapters)}, "online")' class="w-full btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    Online Test (MCQ Only)
                </button>
                <button onclick='startTestGeneration(${JSON.stringify(mode)}, ${JSON.stringify(selectedChapters)}, "pdf")' class="w-full btn-secondary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    PDF Test (Download .tex)
                </button>
            </div>
             <button onclick="showTestGenerationDashboard()" class="w-full btn-secondary mt-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                Back to Scope Selection
            </button>
        </div>
    `;
    displayContent(html);
}

function startTestGeneration(mode, selectedChapters, testType) {
     showLoading(`Generating ${testType === 'online' ? 'Online' : 'PDF'} Test...`);
     setTimeout(async () => { // Use async for potential await inside
         let relevantChapters = {};
         if (mode === 'studied') {
             const studied = currentSubject.studied_chapters || [];
             studied.forEach(chapNum => {
                 if (currentSubject.chapters[chapNum]) relevantChapters[chapNum] = currentSubject.chapters[chapNum];
             });
         } else if (mode === 'specific' && selectedChapters) {
             selectedChapters.forEach(chapNum => {
                 if (currentSubject.chapters[chapNum]) relevantChapters[chapNum] = currentSubject.chapters[chapNum];
             });
         }

          if (Object.keys(relevantChapters).length === 0) {
             hideLoading();
             displayContent('<p class="text-red-500">Error: No relevant chapters found for test generation.</p>');
             return;
         }

         const totalQuestionsForTest = currentSubject.max_questions_per_test || 42;
         const allocation = allocateQuestions(relevantChapters, totalQuestionsForTest);
         const totalAllocated = Object.values(allocation).reduce((a,b) => a+b, 0);

          if (totalAllocated === 0) {
              hideLoading();
              displayContent(`<p class="text-red-500">Error: Could not allocate any questions based on the selected chapters and difficulty. There might be no questions available or all chapters have zero weight.</p>`);
              return;
          }

         console.log("Allocation:", allocation);

         const selectedQuestionsMap = {}; // { chapNum: [q1, q2], ... }
         let allocationDetails = "";
         for (const chapNum in allocation) {
             const n = allocation[chapNum];
             if (n > 0) {
                 const questions = selectNewQuestionsAndUpdate(currentSubject.chapters[chapNum], n);
                 if (questions.length > 0) {
                    selectedQuestionsMap[chapNum] = questions;
                    allocationDetails += `<p>Chapter ${chapNum}: ${questions.length} questions - IDs: ${questions.join(', ')}</p>`;
                 } else {
                      allocationDetails += `<p>Chapter ${chapNum}: 0 questions selected (requested ${n}, none available/selected).</p>`;
                 }
             }
         }

         const examId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);

         if (testType === 'online') {
             // --- Generate Online Test ---
             if (!markdownContentCache) {
                 hideLoading();
                 displayContent('<p class="text-red-500">Error: Markdown content not available for online test.</p>');
                 return;
             }
             const { questions, answers } = extractQuestionsFromMarkdown(markdownContentCache, selectedQuestionsMap);

             if (questions.length === 0) {
                 hideLoading();
                 displayContent('<p class="text-red-500">Error: Failed to extract any questions for the online test from the Markdown file based on the allocation.</p>');
                 return;
             }
              if (questions.length !== totalAllocated) {
                   console.warn(`Online Test: Allocated ${totalAllocated} questions, but extracted ${questions.length}. There might be issues with question parsing or selection.`);
               }


             // Check if all extracted questions have answers (assuming MCQ)
             const allMcq = questions.every(q => answers[q.id]);
             if (!allMcq) {
                  hideLoading();
                  displayContent('<p class="text-red-500">Error: Online testing currently only supports questions with clear answers (e.g., "ans:A") in the Markdown. Some selected questions seem to be missing answers.</p>');
                  // Optionally revert available questions? Complex.
                  return;
              }


             currentOnlineTestState = {
                 examId: examId,
                 questions: questions, // Array of {id, chapter, number, text, image}
                 correctAnswers: answers, // { "c1q5": "A", ... }
                 userAnswers: {}, // { "c1q5": "B", ... }
                 allocation: allocation, // Original allocation {chap: count}
                 startTime: Date.now(),
                 timerInterval: null,
                 currentQuestionIndex: 0
             };

             saveData(data); // Save updated available_questions
             hideLoading();
             launchOnlineTestUI();

         } else {
             // --- Generate PDF Test (.tex files) ---
              if (!markdownContentCache) {
                 hideLoading();
                 displayContent('<p class="text-red-500">Error: Markdown content not available for PDF generation.</p>');
                 return;
             }

             let questionsTex = `${LATEX_PDF_HEADER}\\section*{Exam: ${examId.replace(/_/g, '\\_')}}\n\\begin{enumerate}[label=\\arabic*.]\n`;
             let solutionsTex = `${LATEX_PDF_HEADER}\\section*{Solutions: ${examId.replace(/_/g, '\\_')}}\n\\begin{enumerate}[label=\\arabic*.]\n`;
             let questionCounter = 0;

             // Iterate through selected questions preserving order somewhat
            const sortedChapters = Object.keys(selectedQuestionsMap).sort((a, b) => parseInt(a) - parseInt(b));

             for (const chapNum of sortedChapters) {
                  const questionNumbers = selectedQuestionsMap[chapNum].sort((a,b) => a - b);
                   for (const qNum of questionNumbers) {
                       questionCounter++;
                       const fullQText = extractFullQuestionTextForPdf(markdownContentCache, chapNum, qNum);

                       if (!fullQText) {
                           console.warn(`Could not extract text for Chapter ${chapNum}, Question ${qNum}`);
                           questionsTex += `\\item [Question ${questionCounter} from Ch. ${chapNum}, Q.${qNum} - Error loading text]\n`;
                           solutionsTex += `\\item [Question ${questionCounter} from Ch. ${chapNum}, Q.${qNum} - Error loading text]\n`;
                           continue;
                       }

                       // Basic processing for LaTeX compatibility (very simplistic)
                       // Need a more robust Markdown-to-LaTeX converter for complex content
                       let processedQText = fullQText
                           .replace(/&/g, '\\&')
                           .replace(/%/g, '\\%')
                           .replace(/_/g, '\\_')
                           .replace(/#/g, '\\#')
                           // Handle basic bold/italic - simplistic
                           .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
                           .replace(/\*(.*?)\*/g, '\\textit{$1}')
                           // Handle images - assumes image URL is directly usable
                           .replace(/!\[.*?\]\((.*?)\)/g, '\\begin{center}\\includegraphics[width=0.6\\textwidth]{$1}\\end{center}');


                         // Find and separate the answer part for the questions file
                        const answerRegexPdf = /(\n\s*(?:ans|answer)[:\s]+[a-zA-Z\d]+\s*)$/i;
                        let questionOnlyText = processedQText.replace(answerRegexPdf, '');
                        let solutionText = processedQText; // Keep answer for solutions

                       questionsTex += `\\item ${questionOnlyText}\n\n`;
                       solutionsTex += `\\item ${solutionText}\n\n`;
                    }
             }

             questionsTex += `\\end{enumerate}\n${LATEX_PDF_FOOTER}`;
             solutionsTex += `\\end{enumerate}\n${LATEX_PDF_FOOTER}`;

             // Add to pending exams
             currentSubject.pending_exams.push({
                 id: examId,
                 allocation: allocation, // Store the actual number selected per chapter
                 results_entered: false
             });

             saveData(data); // Save updated available_questions and pending exam
             hideLoading();

             const questionsFilename = `Exam_${examId}.tex`;
             const solutionsFilename = `SolutionManual_${examId}.tex`;

             displayContent(`
                <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in mb-4">
                    <p class="font-medium">PDF Test (.tex files) Generated!</p>
                    <p>Exam ID: ${examId}</p>
                    <p>Total Questions: ${questionCounter}</p>
                </div>
                 <div class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-4">
                    <p class="font-medium">Action Required:</p>
                    <p>Download the .tex files below and compile them using a LaTeX distribution (like MiKTeX, TeX Live) or an online service (like Overleaf) to get the final PDFs.</p>
                 </div>
                <div class="space-y-3">
                    <button onclick="downloadTexFile('${questionsFilename}', \`${btoa(unescape(encodeURIComponent(questionsTex)))}\`)" class="w-full btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Download Questions (${questionsFilename})
                    </button>
                    <button onclick="downloadTexFile('${solutionsFilename}', \`${btoa(unescape(encodeURIComponent(solutionsTex)))}\`)" class="w-full btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Download Solutions (${solutionsFilename})
                    </button>
                 </div>
                 <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">This exam has been added to the pending exams list. Enter results manually once completed.</p>
                 <div class="mt-4">${allocationDetails}</div>
             `);
         }
     }, 500); // Timeout to allow loading indicator to show
}

function downloadTexFile(filename, base64Content) {
     try {
         const content = decodeURIComponent(escape(atob(base64Content)));
         const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
     } catch (e) {
         console.error("Error creating/downloading .tex file:", e);
         alert("Failed to prepare the download file. See console for details.");
     }
}

// --- Online Test UI & Logic ---

function launchOnlineTestUI() {
    document.getElementById('menu').classList.add('hidden'); // Hide main menu
    const testArea = document.getElementById('online-test-area');
    testArea.classList.remove('hidden'); // Show test container

    const totalQuestions = currentOnlineTestState.questions.length;
    const durationMillis = ONLINE_TEST_DURATION_MINUTES * 60 * 1000;
    currentOnlineTestState.endTime = currentOnlineTestState.startTime + durationMillis;

    testArea.innerHTML = `
        <div class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow z-10 border-b dark:border-gray-700">
            <div class="container mx-auto flex justify-between items-center">
                <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">Online Test</span>
                <div id="timer" class="text-lg font-mono px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">--:--:--</div>
                 <button id="force-submit-btn" onclick="confirmForceSubmit()" class="btn-danger-small hidden">Submit Now</button>
            </div>
        </div>
        <div id="question-container" class="pt-20 pb-20 container mx-auto px-4">
            </div>
        <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow-up z-10 border-t dark:border-gray-700">
             <div class="container mx-auto flex justify-between items-center">
                 <button id="prev-btn" onclick="navigateQuestion(-1)" class="btn-secondary" disabled>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                     Previous
                 </button>
                <span id="question-counter" class="text-sm text-gray-600 dark:text-gray-400">Question 1 / ${totalQuestions}</span>
                 <button id="next-btn" onclick="navigateQuestion(1)" class="btn-primary">
                     Next
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-1"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                 </button>
                 <button id="submit-btn" onclick="confirmSubmitOnlineTest()" class="btn-success hidden">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                     Submit Test
                 </button>
            </div>
        </div>
    `;

    startTimer();
    displayCurrentQuestion();
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    if (currentOnlineTestState.timerInterval) {
        clearInterval(currentOnlineTestState.timerInterval);
    }

    function updateTimerDisplay() {
        const now = Date.now();
        const remaining = currentOnlineTestState.endTime - now;

        if (remaining <= 0) {
            clearInterval(currentOnlineTestState.timerInterval);
            timerElement.textContent = "00:00:00";
            timerElement.classList.add('text-red-500');
            alert("Time's up! Submitting your test automatically.");
            submitOnlineTest();
        } else {
            const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);
            const seconds = Math.floor((remaining / 1000) % 60);
             timerElement.textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

             // Show force submit button in the last 5 minutes or so
             if (remaining < 5 * 60 * 1000) {
                 document.getElementById('force-submit-btn')?.classList.remove('hidden');
             }
        }
    }

    updateTimerDisplay(); // Initial display
    currentOnlineTestState.timerInterval = setInterval(updateTimerDisplay, 1000);
}

function displayCurrentQuestion() {
    const index = currentOnlineTestState.currentQuestionIndex;
    const question = currentOnlineTestState.questions[index];
    const container = document.getElementById('question-container');
    const totalQuestions = currentOnlineTestState.questions.length;

    // Basic structure - assumes MCQ A, B, C, D for now
    // Needs more robust handling for different answer types if necessary
    let optionsHtml = ['A', 'B', 'C', 'D'].map(opt => `
        <label class="flex items-center space-x-3 p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <input type="radio" name="mcqOption" value="${opt}" class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                   ${currentOnlineTestState.userAnswers[question.id] === opt ? 'checked' : ''}
                   onchange="recordAnswer('${question.id}', this.value)">
            <span class="font-medium">${opt}</span>
        </label>
    `).join('');

    container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Chapter ${question.chapter} - Question ${question.number}</p>
            <div class="prose dark:prose-invert max-w-none mb-6" id="question-text-area">
                ${question.text}
                 ${question.image ? `<img src="${question.image}" alt="Question Image" class="max-w-full h-auto mx-auto my-4 border dark:border-gray-600 rounded">` : ''}
            </div>
            <div class="space-y-3">
                ${optionsHtml}
            </div>
        </div>
    `;

    // Update navigation buttons and counter
    document.getElementById('question-counter').textContent = `Question ${index + 1} / ${totalQuestions}`;
    document.getElementById('prev-btn').disabled = (index === 0);
    if (index === totalQuestions - 1) {
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        document.getElementById('next-btn').classList.remove('hidden');
        document.getElementById('submit-btn').classList.add('hidden');
    }

    requestAnimationFrame(renderLatex); // Render LaTeX after content update
}

function navigateQuestion(direction) {
    const newIndex = currentOnlineTestState.currentQuestionIndex + direction;
    const totalQuestions = currentOnlineTestState.questions.length;

    if (newIndex >= 0 && newIndex < totalQuestions) {
        currentOnlineTestState.currentQuestionIndex = newIndex;
        displayCurrentQuestion();
    }
}

function recordAnswer(questionId, answer) {
    currentOnlineTestState.userAnswers[questionId] = answer;
    // No need to save to localStorage here, only on final submit
}

function confirmSubmitOnlineTest() {
    const unanswered = currentOnlineTestState.questions.filter(q => !currentOnlineTestState.userAnswers[q.id]).length;
    let confirmationMessage = "Are you sure you want to submit your test?";
    if (unanswered > 0) {
        confirmationMessage += `\n\nYou have ${unanswered} unanswered question(s).`;
    }

    if (confirm(confirmationMessage)) {
        submitOnlineTest();
    }
}
function confirmForceSubmit() {
     if (confirm("Are you sure you want to submit the test now?")) {
         submitOnlineTest();
     }
}


function submitOnlineTest() {
    showLoading("Submitting and Grading...");
    if (currentOnlineTestState.timerInterval) {
        clearInterval(currentOnlineTestState.timerInterval);
    }
     document.getElementById('online-test-area').classList.add('hidden'); // Hide test UI

    setTimeout(() => {
        const results = {
            examId: currentOnlineTestState.examId,
            subjectId: currentSubject.id,
            timestamp: new Date().toISOString(),
            durationMinutes: Math.round((Date.now() - currentOnlineTestState.startTime) / 60000),
            questions: [], // { id, chapter, number, text, image, userAnswer, correctAnswer, isCorrect }
            score: 0,
            totalQuestions: currentOnlineTestState.questions.length,
            resultsByChapter: {} // { chapNum: { attempted, correct, wrong } }
        };

        let totalCorrect = 0;

        // Initialize resultsByChapter
         for (const chapNum in currentOnlineTestState.allocation) {
             results.resultsByChapter[chapNum] = { attempted: 0, correct: 0, wrong: 0 };
         }


        currentOnlineTestState.questions.forEach(q => {
            const userAnswer = currentOnlineTestState.userAnswers[q.id] || null;
            const correctAnswer = currentOnlineTestState.correctAnswers[q.id];
            const isCorrect = userAnswer === correctAnswer;

             // Record question-level result
            results.questions.push({
                id: q.id,
                chapter: q.chapter,
                number: q.number,
                text: q.text, // Keep text for review
                 image: q.image,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            });

             // Update chapter-level results
             const chapResult = results.resultsByChapter[q.chapter];
             if (chapResult) { // Should always exist if allocation was correct
                chapResult.attempted++; // Count every question in the test as attempted for this exam's scope
                if (isCorrect) {
                    chapResult.correct++;
                    totalCorrect++;
                } else {
                    chapResult.wrong++;
                }
             } else {
                  console.error(`Chapter ${q.chapter} not found in exam allocation during result processing.`);
             }

            // --- Update Global Chapter Statistics ---
            const globalChap = currentSubject.chapters[q.chapter];
            if (globalChap) {
                globalChap.total_attempted = (globalChap.total_attempted || 0) + 1;
                const questionWrong = isCorrect ? 0 : 1;
                globalChap.total_wrong = (globalChap.total_wrong || 0) + questionWrong;

                 // Update mistake history for the *chapter*, recording if *this specific question* was wrong
                 // This is tricky. The current mistake_history tracks *number wrong in a test session for that chapter*.
                 // Maybe change mistake_history to track correctness per attempt?
                 // Let's stick to the original logic: push the number wrong *for this chapter in this test*.
                 // We need to calculate this *after* iterating all questions for the chapter.

                // Update consecutive mastery based on *this specific question*?
                 // No, consecutive mastery should be based on the *entire chapter's performance in a test session*.
                 // We'll update this after processing all results.

                 // Remove the question from available_questions if it wasn't already removed during selection
                 // (It should have been removed by selectNewQuestionsAndUpdate)
                 if (globalChap.available_questions) {
                     const qIndex = globalChap.available_questions.indexOf(q.number);
                     if (qIndex > -1) {
                          console.warn(`Question ${q.chapter}-${q.number} was still in available_questions after test.`);
                          globalChap.available_questions.splice(qIndex, 1);
                     }
                 }

            } else {
                 console.error(`Chapter ${q.chapter} not found in global data during statistics update.`);
            }
        });

         // --- Finalize Global Chapter Stats (Mistake History & Mastery) ---
         for (const chapNum in results.resultsByChapter) {
              const globalChap = currentSubject.chapters[chapNum];
              const chapResult = results.resultsByChapter[chapNum];
              if (globalChap && chapResult) {
                  const numWrongInChapter = chapResult.wrong;
                  globalChap.mistake_history = globalChap.mistake_history || [];
                  globalChap.mistake_history.push(numWrongInChapter);
                  // Keep history length reasonable (e.g., last 20 sessions)
                   if (globalChap.mistake_history.length > 20) {
                        globalChap.mistake_history.shift();
                   }

                  // Update consecutive mastery
                  globalChap.consecutive_mastery = (numWrongInChapter === 0)
                      ? (globalChap.consecutive_mastery || 0) + 1
                      : 0;
              }
         }


        results.score = totalCorrect;
        currentSubject.exam_history = currentSubject.exam_history || [];
        currentSubject.exam_history.push(results);
        // Limit history size?
        // if (currentSubject.exam_history.length > 50) {
        //     currentSubject.exam_history.shift();
        // }

        saveData(data); // Save updated chapter stats and exam history
        hideLoading();
        displayOnlineTestResults(results);
        currentOnlineTestState = null; // Clear test state

    }, 500);
}


function displayOnlineTestResults(results) {
    clearContent(); // Clear main content area first
    document.getElementById('menu').classList.remove('hidden'); // Show menu again

    const percentage = results.totalQuestions > 0 ? ((results.score / results.totalQuestions) * 100).toFixed(1) : 0;

    let chapterSummaryHtml = Object.entries(results.resultsByChapter).map(([chapNum, chapRes]) => {
        const chapPercentage = chapRes.attempted > 0 ? ((chapRes.correct / chapRes.attempted) * 100).toFixed(1) : 0;
        return `
            <li class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span>Chapter ${chapNum}</span>
                <span class="font-medium ${chapRes.wrong > 0 ? 'text-red-500' : 'text-green-500'}">
                    ${chapRes.correct} / ${chapRes.attempted} (${chapPercentage}%)
                </span>
            </li>`;
    }).join('');

     // Basic review section (can be expanded)
     let reviewHtml = results.questions.slice(0, 5).map((q, index) => `
         <div class="p-3 border dark:border-gray-600 rounded mb-2">
             <p class="text-sm font-medium">Q${index + 1} (Ch.${q.chapter}-${q.number}): Your Answer: ${q.userAnswer || 'N/A'}, Correct: ${q.correctAnswer}
                <span class="${q.isCorrect ? 'text-green-500' : 'text-red-500'}">${q.isCorrect ? '✔' : '✘'}</span>
             </p>
             </div>
     `).join('');
     if (results.questions.length > 5) {
         reviewHtml += `<p class="text-sm text-gray-500 dark:text-gray-400">Showing first 5 questions. Full details available in Exams Dashboard.</p>`
     }

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4 animate-fade-in">
            <h2 class="text-2xl font-semibold mb-4 text-center text-primary-600 dark:text-primary-400">Test Results: ${results.examId}</h2>
            <div class="text-center mb-6">
                 <p class="text-4xl font-bold ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}">
                    ${results.score} / ${results.totalQuestions} (${percentage}%)
                 </p>
                 <p class="text-gray-600 dark:text-gray-400">Duration: ${results.durationMinutes} minutes</p>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Chapter Performance</h3>
                <ul class="space-y-1">
                    ${chapterSummaryHtml}
                </ul>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Quick Review (First 5 Questions)</h3>
                 ${reviewHtml}
            </div>

             <button onclick="showExamsDashboard()" class="w-full btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08H4.123a.878.878 0 0 0-.878.878V18a2.25 2.25 0 0 0 2.25 2.25h3.879a.75.75 0 0 1 0 1.5H6.75a3.75 3.75 0 0 1-3.75-3.75V5.625a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 5.625V16.5a2.25 2.25 0 0 1-2.25 2.25h-3.879a.75.75 0 0 1 0-1.5Z" /></svg>
                View All Exams
            </button>
        </div>
    `;
    displayContent(html);
}


// --- PDF Exam Result Entry (Largely unchanged, but adapted) ---

function showEnterResults() { // Now part of Exams Dashboard, but can be called directly
    const pending_exams = currentSubject.pending_exams || [];
    if (pending_exams.length === 0) {
        return '<p class="text-sm text-gray-500 dark:text-gray-400 mt-4">No pending PDF exams to enter results for.</p>';
    }

    let output = '<h3 class="text-lg font-semibold mb-3 mt-6 text-yellow-600 dark:text-yellow-400">Pending PDF Exams</h3><div class="space-y-2">';
    pending_exams.forEach((exam, i) => {
        // Find the index relative to the original array for correct deletion/update
        const originalIndex = (currentSubject.pending_exams || []).findIndex(p => p.id === exam.id);
        if (originalIndex === -1) return; // Should not happen

        output += `
        <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex justify-between items-center">
             <span class="text-sm font-medium">${exam.id}</span>
             <div>
                 <button onclick="enterResultsForm(${originalIndex})" class="btn-primary-small mr-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    Enter Results
                 </button>
                  <button onclick="confirmDeletePendingExam(${originalIndex})" class="btn-danger-small">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                     Delete
                  </button>
            </div>
        </div>`;
    });
    output += '</div>';
    return output;
}

function enterResultsForm(index) {
    const exam = currentSubject.pending_exams[index];
    const allocation = exam.allocation; // {chapNum: count, ...}
    let formHtml = `<p class="font-bold mb-4">Entering results for PDF exam ${exam.id}:</p><div class="space-y-4">`;
    let inputs = [];

    const sortedChaps = Object.keys(allocation).sort((a, b) => parseInt(a) - parseInt(b));

    for (let chap_num of sortedChaps) {
        let n = allocation[chap_num];
        if (n > 0) {
            formHtml += `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label for="wrong-${chap_num}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chapter ${chap_num}: Number of WRONG answers (0 to ${n})
                </label>
                <input id="wrong-${chap_num}" type="number" min="0" max="${n}" value="0" required
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            </div>`;
            inputs.push(chap_num);
        }
    }
    formHtml += `</div>
    <div class="mt-6 flex space-x-3">
        <button onclick="submitPendingResults(${index}, ${JSON.stringify(inputs)})"
            class="flex-1 btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Submit Results
        </button>
         <button onclick="showExamsDashboard()" class="flex-1 btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
             Cancel
         </button>
    </div>`;
    displayContent(formHtml);
}

function submitPendingResults(index, chap_nums) {
    showLoading("Saving PDF Results...");
    setTimeout(() => {
        const exam = currentSubject.pending_exams[index];
        const chapters = currentSubject.chapters;
        let allInputsValid = true;
        let chapterResults = {}; // To calculate mastery based on whole chapter session

        for (let chap_num of chap_nums) {
            const n = exam.allocation[chap_num]; // Number of questions attempted in this chapter
             if (n === 0) continue; // Skip if no questions allocated

            const inputElement = document.getElementById(`wrong-${chap_num}`);
            let wrong = parseInt(inputElement.value);

            if (isNaN(wrong) || wrong < 0 || wrong > n) {
                hideLoading();
                alert(`Invalid input for Chapter ${chap_num}. Must be between 0 and ${n}.`);
                // Add visual indicator to the invalid field
                 inputElement.classList.add('border-red-500', 'ring-red-500');
                 inputElement.focus();
                allInputsValid = false;
                break; // Stop processing on first error
            } else {
                 inputElement.classList.remove('border-red-500', 'ring-red-500'); // Clear error style if valid
                 chapterResults[chap_num] = { attempted: n, wrong: wrong };
             }
        }

         if (!allInputsValid) {
            hideLoading();
            return; // Don't proceed if any input was invalid
         }

        // If all inputs are valid, update global stats
        for (let chap_num in chapterResults) {
             const result = chapterResults[chap_num];
             const chap = chapters[chap_num];

             if (chap) {
                chap.total_attempted = (chap.total_attempted || 0) + result.attempted;
                chap.total_wrong = (chap.total_wrong || 0) + result.wrong;
                chap.mistake_history = chap.mistake_history || [];
                chap.mistake_history.push(result.wrong);
                 // Limit history size
                if (chap.mistake_history.length > 20) {
                     chap.mistake_history.shift();
                }
                // Update mastery based on whether *any* were wrong in this chapter session
                chap.consecutive_mastery = (result.wrong === 0)
                    ? (chap.consecutive_mastery || 0) + 1
                    : 0;
             } else {
                 console.error(`Chapter ${chap_num} not found in global data when submitting PDF results.`);
             }
        }

        // Remove exam from pending list
        currentSubject.pending_exams.splice(index, 1);
        saveData(data);
        hideLoading();
        showExamsDashboard(); // Show the updated dashboard
         // Add a success message at the top of the dashboard?
         const successMsg = `
            <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md mb-4 animate-fade-in">
                <p class="font-medium">Results for exam ${exam.id} entered successfully!</p>
             </div>`;
         // Prepend success message to dashboard content
         const dashboardContent = document.getElementById('content').innerHTML;
         displayContent(successMsg + dashboardContent);


    }, 500);
}


// --- Chapter Management (Studied Status) --- REMOVED Add Chapters

function showManageStudiedChapters() {
    const chapters = currentSubject.chapters;
    const chapterNumbers = Object.keys(chapters).sort((a, b) => parseInt(a) - parseInt(b));
    const studied = currentSubject.studied_chapters || [];

    if (chapterNumbers.length === 0) {
        displayContent('<p class="text-red-500">No chapters found for this subject. Check the Markdown file configuration.</p>');
        return;
    }

    let chapterCheckboxesHtml = chapterNumbers.map(num => `
        <div class="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <input id="studied-chap-${num}" type="checkbox" value="${num}"
                   class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                   ${studied.includes(num) ? 'checked' : ''}
                   onchange="toggleStudiedChapter('${num}', this.checked)">
            <label for="studied-chap-${num}" class="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-300">
                Chapter ${num} <span class="text-xs text-gray-500 dark:text-gray-400">(${chapters[num].total_questions || 0} questions)</span>
            </label>
        </div>
    `).join('');

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Manage Studied Chapters</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the chapters you have studied. This will be used for the "Test Studied Chapters" option.</p>
            <div class="space-y-2 max-h-80 overflow-y-auto p-2 border dark:border-gray-600 rounded">
                ${chapterCheckboxesHtml}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">Changes are saved automatically.</p>
        </div>
    `;
    displayContent(html);
}

function toggleStudiedChapter(chapNum, isChecked) {
    currentSubject.studied_chapters = currentSubject.studied_chapters || [];
    const index = currentSubject.studied_chapters.indexOf(chapNum);

    if (isChecked && index === -1) {
        currentSubject.studied_chapters.push(chapNum);
         currentSubject.studied_chapters.sort((a, b) => parseInt(a) - parseInt(b)); // Keep sorted
    } else if (!isChecked && index > -1) {
        currentSubject.studied_chapters.splice(index, 1);
    }
    saveData(data); // Save immediately on change
    // Optional: Add a small visual confirmation?
}

// --- Exams Dashboard --- REPLACES Delete Exam

function showExamsDashboard() {
    const pendingHtml = showEnterResults(); // Get HTML for pending exams section
    const completedHtml = showCompletedExams(); // Get HTML for completed exams

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Exams Dashboard</h2>
            ${pendingHtml}
            ${completedHtml}
        </div>
    `;
    displayContent(html);
}

function showCompletedExams() {
    const completed_exams = (currentSubject.exam_history || []).slice().reverse(); // Show newest first

    if (completed_exams.length === 0) {
        return '<p class="text-sm text-gray-500 dark:text-gray-400 mt-4">No completed online test history.</p>';
    }

    let output = '<h3 class="text-lg font-semibold mb-3 mt-6 text-green-600 dark:text-green-400">Completed Online Exams</h3><div class="space-y-2">';
    completed_exams.forEach((exam, revIndex) => {
         // Find the index in the original non-reversed array for correct deletion/update
         const originalIndex = (currentSubject.exam_history || []).length - 1 - revIndex;
         if (originalIndex < 0) return; // Should not happen

        const percentage = exam.totalQuestions > 0 ? ((exam.score / exam.totalQuestions) * 100).toFixed(1) : 0;
        const date = new Date(exam.timestamp).toLocaleString();

        output += `
        <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
             <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium">${exam.examId}</span>
                 <span class="text-xs text-gray-500 dark:text-gray-400">${date}</span>
             </div>
             <div class="flex justify-between items-center">
                 <span class="font-semibold ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}">
                    ${exam.score} / ${exam.totalQuestions} (${percentage}%)
                 </span>
                 <div>
                     <button onclick="showExamDetails(${originalIndex})" class="btn-secondary-small mr-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.458-4.458a1.012 1.012 0 0 1 1.414 0l4.458 4.458a1.012 1.012 0 0 1 0 .639l-4.458 4.458a1.012 1.012 0 0 1-1.414 0l-4.458-4.458Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                         Details
                    </button>
                    <button onclick="confirmDeleteCompletedExam(${originalIndex})" class="btn-danger-small">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                         Delete
                    </button>
                    </div>
            </div>
        </div>`;
        // Add Edit button later if needed:
        // <button onclick="editExamResults(${originalIndex})" class="btn-secondary-small mr-2">Edit</button>
    });
    output += '</div>';
    return output;
}

function showExamDetails(index) {
    const exam = currentSubject.exam_history[index];
    if (!exam) return;

    const percentage = exam.totalQuestions > 0 ? ((exam.score / exam.totalQuestions) * 100).toFixed(1) : 0;
    const date = new Date(exam.timestamp).toLocaleString();

    let questionsHtml = exam.questions.map((q, i) => `
        <div class="p-4 border dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800 shadow-sm">
            <p class="font-semibold mb-2">Question ${i + 1} (Chapter ${q.chapter} - ${q.number})</p>
            <div class="prose dark:prose-invert max-w-none text-sm mb-3" id="details-q-${i}-text">
                 ${q.text}
                 ${q.image ? `<img src="${q.image}" alt="Question Image" class="max-w-xs h-auto my-2 border dark:border-gray-600 rounded">` : ''}
            </div>
            <div class="text-sm space-y-1">
                <p>Your Answer: <span class="font-medium">${q.userAnswer || 'N/A'}</span></p>
                <p>Correct Answer: <span class="font-medium">${q.correctAnswer}</span></p>
                <p>Result: <span class="font-bold ${q.isCorrect ? 'text-green-500' : 'text-red-500'}">${q.isCorrect ? 'Correct ✔' : 'Incorrect ✘'}</span></p>
            </div>
        </div>
    `).join('');

    const html = `
        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner mb-4">
            <h2 class="text-xl font-semibold mb-2 text-primary-600 dark:text-primary-400">Exam Details: ${exam.examId}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${date} - Duration: ${exam.durationMinutes} min</p>
            <p class="text-lg font-bold mb-4">Overall Score: ${exam.score} / ${exam.totalQuestions} (${percentage}%)</p>

            <h3 class="text-lg font-semibold mb-3 mt-5">Question Breakdown</h3>
            <div class="max-h-96 overflow-y-auto pr-2">
                ${questionsHtml}
            </div>

            <button onclick="showExamsDashboard()" class="mt-6 w-full btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                 Back to Exams Dashboard
            </button>
        </div>
    `;
    displayContent(html);
     // Render LaTeX after displaying content
     requestAnimationFrame(() => {
        exam.questions.forEach((q, i) => {
            const element = document.getElementById(`details-q-${i}-text`);
            if (element && window.renderMathInElement) {
                 try {
                     window.renderMathInElement(element, { delimiters: [ { left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false } ]});
                 } catch(e) { console.error("Katex error on details:", e)}
            }
        });
    });
}

function confirmDeletePendingExam(index) {
    const exam = currentSubject.pending_exams[index];
    if (!exam) return;
     const confirmation = confirm(`Are you sure you want to delete the PENDING exam "${exam.id}"?\nThis exam's results have not been entered yet.`);
    if (confirmation) {
        deletePendingExam(index);
    }
}

function deletePendingExam(index) {
     showLoading("Deleting Pending Exam...");
    setTimeout(() => {
        const exam = currentSubject.pending_exams[index];
        // IMPORTANT: Should deleting a pending exam return the questions to 'available'?
        // This is complex because we don't know *which* questions were selected without storing it.
        // Current implementation *does not* return questions to available pool.
        // If needed, the 'allocation' would need to store the actual question numbers selected.
        currentSubject.pending_exams.splice(index, 1);
        saveData(data);
        hideLoading();
        showExamsDashboard(); // Refresh dashboard
         const successMsg = `
            <div class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-4 animate-fade-in">
                <p class="font-medium">Pending exam ${exam.id} deleted.</p>
             </div>`;
         const dashboardContent = document.getElementById('content').innerHTML;
         displayContent(successMsg + dashboardContent);
    }, 300);
}

function confirmDeleteCompletedExam(index) {
    const exam = currentSubject.exam_history[index];
    if (!exam) return;
    const confirmation = confirm(`Are you sure you want to delete the history for COMPLETED exam "${exam.examId}"?\n\nWARNING: This action is irreversible and will remove the record of this exam. It will NOT automatically adjust your overall chapter statistics.`);
    if (confirmation) {
        deleteCompletedExam(index);
    }
}

function deleteCompletedExam(index) {
     showLoading("Deleting Exam History...");
    setTimeout(() => {
        const exam = currentSubject.exam_history[index];
        // Decision: Deleting history does NOT revert chapter stats.
        // Reverting stats would require complex reverse calculations and could corrupt data easily.
        currentSubject.exam_history.splice(index, 1);
        saveData(data);
        hideLoading();
        showExamsDashboard(); // Refresh dashboard
         const successMsg = `
            <div class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md mb-4 animate-fade-in">
                <p class="font-medium">Completed exam ${exam.examId} history deleted.</p>
             </div>`;
         const dashboardContent = document.getElementById('content').innerHTML;
         displayContent(successMsg + dashboardContent);
    }, 300);
}


// --- Subject Management (Largely Unchanged, but uses new data structure) ---

function showManageSubjects() {
     let output = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Manage Subjects</h2>
            <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-medium mb-3 text-gray-700 dark:text-gray-300">Current Subjects</h3>
                <div class="space-y-2">
                    ${Object.entries(data.subjects).map(([id, subject]) => `
                        <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded shadow-sm">
                            <span class="${currentSubject && currentSubject.id === id ? 'font-bold text-primary-600 dark:text-primary-400' : ''}">${subject.name}</span>
                            <div class="flex space-x-2">
                                <button onclick="selectSubject('${id}')" title="Select Subject" class="p-1 text-primary-500 hover:text-primary-600 dark:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed" ${currentSubject && currentSubject.id === id ? 'disabled' : ''}>
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                </button>
                                <button onclick="editSubject('${id}')" title="Edit Subject" class="p-1 text-blue-500 hover:text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                </button>
                                <button onclick="confirmDeleteSubject('${id}')" title="Delete Subject" class="p-1 text-red-500 hover:text-red-600 dark:text-red-400 ${Object.keys(data.subjects).length <= 1 ? 'hidden' : ''}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
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
                    <input id="subject-name" type="text" placeholder="Enter subject name" required
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="mb-3">
                    <label for="max-questions" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Maximum Questions per Test</label>
                    <input id="max-questions" type="number" min="1" value="42" placeholder="Enter maximum questions" required
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <button onclick="addSubject()" class="btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" /></svg>
                    Add Subject
                </button>
            </div>
        </div>
    `;
    displayContent(output);
}

function selectSubject(id) {
    showLoading("Switching Subject...");
    setTimeout(() => {
        if (data.subjects[id]) {
            currentSubject = data.subjects[id];
            updateSubjectInfo();
            clearContent(); // Clear the main content area after switching
            displayContent(`
            <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
                <p class="font-medium">Subject changed to ${currentSubject.name}</p>
            </div>`);
        } else {
            displayContent('<p class="text-red-500">Error: Could not find selected subject.</p>');
        }
        hideLoading();
    }, 300);
}

function editSubject(id) {
    let subject = data.subjects[id];
    displayContent(`
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
            <h2 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Edit Subject: ${subject.name}</h2>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="mb-3">
                    <label for="edit-subject-name" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Name</label>
                    <input id="edit-subject-name" type="text" value="${subject.name}" required
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="mb-3">
                    <label for="edit-max-questions" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Maximum Questions per Test</label>
                    <input id="edit-max-questions" type="number" min="1" value="${subject.max_questions_per_test}" required
                        class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div class="flex space-x-3 mt-4">
                    <button onclick="updateSubject('${id}')" class="btn-primary flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                        Save Changes
                    </button>
                    <button onclick="showManageSubjects()" class="btn-secondary flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `);
}

function updateSubject(id) {
    showLoading("Updating Subject...");
    setTimeout(() => {
        let name = document.getElementById('edit-subject-name').value.trim();
        let max_questions = parseInt(document.getElementById('edit-max-questions').value);
        if (!name || isNaN(max_questions) || max_questions < 1) {
            hideLoading();
            alert("Please enter valid subject name and maximum questions.");
            return;
        }
        data.subjects[id].name = name;
        data.subjects[id].max_questions_per_test = max_questions;
        // If currently selected subject was edited, update the global variable and info display
        if (currentSubject && currentSubject.id === id) {
            currentSubject = data.subjects[id]; // Update reference
            updateSubjectInfo();
        }
        saveData(data);
        hideLoading();
        showManageSubjects(); // Go back to the list
    }, 300);
}

function addSubject() {
    showLoading("Adding Subject...");
    setTimeout(() => {
        let name = document.getElementById('subject-name').value.trim();
        let max_questions = parseInt(document.getElementById('max-questions').value);
        if (!name || isNaN(max_questions) || max_questions < 1) {
            hideLoading();
            alert("Please enter valid subject name and maximum questions.");
            return;
        }

        // Find a unique ID (simple increment, could be UUID)
        let newId = 1;
        while (data.subjects[String(newId)]) {
            newId++;
        }
        const newIdStr = String(newId);

        data.subjects[newIdStr] = {
            id: newIdStr,
            name: name,
            max_questions_per_test: max_questions,
            chapters: {}, // Chapters will be populated on next load/refresh via MD
            studied_chapters: [],
            pending_exams: [],
            exam_history: []
        };

         // Immediately try to populate chapters from cached markdown if available
         if (markdownContentCache) {
             updateChaptersFromMarkdown(data.subjects[newIdStr], markdownContentCache);
         }


        saveData(data);
        hideLoading();
        showManageSubjects(); // Refresh the list
    }, 300);
}


function confirmDeleteSubject(id) {
     if (Object.keys(data.subjects).length <= 1) {
         alert("Cannot delete the last subject.");
         return;
     }
    let subject = data.subjects[id];
    displayContent(`
        <div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p class="font-bold text-red-600 dark:text-red-400 text-lg mb-2">Delete Subject</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete the subject "${subject.name}" and ALL its associated data (chapters stats, studied status, pending exams, exam history)?<br>This action cannot be undone.</p>
            <div class="flex justify-center space-x-3">
                <button onclick="deleteSubject('${id}')" class="btn-danger flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    Delete Subject Permanently
                </button>
                <button onclick="showManageSubjects()" class="btn-secondary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function deleteSubject(id) {
    showLoading("Deleting Subject...");
    setTimeout(() => {
        if (Object.keys(data.subjects).length <= 1) {
            hideLoading();
            alert("Cannot delete the last subject.");
            showManageSubjects();
            return;
        }
        // Check if deleting the current subject
        if (currentSubject && currentSubject.id === id) {
            // Switch to another subject before deleting
            let otherSubjectId = Object.keys(data.subjects).find(sid => sid !== id);
            if (otherSubjectId) {
                 currentSubject = data.subjects[otherSubjectId];
            } else {
                 currentSubject = null; // Should not happen if length > 1
            }
            updateSubjectInfo();
        }
        // Delete the subject data
        delete data.subjects[id];
        saveData(data);
        hideLoading();
        showManageSubjects(); // Refresh the list
    }, 500);
}

// --- Progress Dashboard ---

function showProgressDashboard() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('online-test-area').classList.add('hidden'); // Ensure test area is hidden

    let chapters = currentSubject.chapters;
    if (!chapters || Object.keys(chapters).length === 0) {
        document.getElementById('dashboard-content').innerHTML = `
         <p class="text-red-500 p-4">No chapter data available for this subject to display in dashboard. Check Markdown file and subject setup.</p>
         <button onclick="closeDashboard()" class="btn-secondary m-4">Close</button>
         `;
        return;
    }
     // Ensure dashboard content area exists or add it dynamically if needed
     if (!document.getElementById('dashboard-content')) {
         document.getElementById('dashboard').innerHTML += '<div id="dashboard-content"></div>';
     }

    // Prepare chart containers
    document.getElementById('dashboard-content').innerHTML = `
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
             <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                 <h3 class="text-lg font-semibold mb-2 text-center">Difficulty Score</h3>
                 <div class="h-64"><canvas id="difficultyChart"></canvas></div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                 <h3 class="text-lg font-semibold mb-2 text-center">Consecutive Mastery</h3>
                 <div class="h-64"><canvas id="masteryChart"></canvas></div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                 <h3 class="text-lg font-semibold mb-2 text-center">Questions Attempted</h3>
                 <div class="h-64"><canvas id="attemptedChart"></canvas></div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                 <h3 class="text-lg font-semibold mb-2 text-center">Wrong Answers</h3>
                 <div class="h-64"><canvas id="wrongChart"></canvas></div>
             </div>
         </div>
     `;
     // Add close button inside dashboard-content if it's not part of the main dashboard structure
     if (!document.getElementById('close-dashboard')) {
        document.getElementById('dashboard-content').innerHTML += `
         <div class="text-center p-4">
             <button onclick="closeDashboard()" class="btn-secondary">Close Dashboard</button>
         </div>`;
     }


    renderCharts(); // Render charts into the containers
}

function closeDashboard() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    clearContent(); // Also clear the main content area
}

function renderCharts() {
    let chapters = currentSubject.chapters;
    let chapterNumbers = Object.keys(chapters)
                           .filter(num => chapters[num].total_questions > 0) // Only chart chapters with questions
                           .sort((a, b) => parseInt(a) - parseInt(b));

     if (chapterNumbers.length === 0) {
         console.log("No chapters with questions to render charts for.");
         document.getElementById('dashboard-content').innerHTML = '<p class="text-center p-4 text-gray-500 dark:text-gray-400">No chapter data with questions to display charts.</p>';
         return;
     }


    // Destroy existing charts if they exist
    Object.values(charts).forEach(chart => chart?.destroy());
    charts = {};

    try {
        let attempted = chapterNumbers.map(num => chapters[num].total_attempted || 0);
        let wrong = chapterNumbers.map(num => chapters[num].total_wrong || 0);
        let mastery = chapterNumbers.map(num => chapters[num].consecutive_mastery || 0);
        let difficulty = chapterNumbers.map(num => calculateDifficulty(chapters[num]));

        const commonOptions = (title) => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: false, text: title }, // Keep it clean, title is above chart
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Chapter ${tooltipItems[0].label.substring(3)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                     grid: { color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                     ticks: { color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#4b5563'} // slate-300 dark, slate-600 light
                },
                x: {
                     grid: { display: false },
                     ticks: { color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#4b5563'}
                 }
            }
        });

        let attemptedCtx = document.getElementById('attemptedChart')?.getContext('2d');
        if (attemptedCtx) {
            charts.attemptedChart = new Chart(attemptedCtx, {
                type: 'bar',
                data: { labels: chapterNumbers.map(num => `Ch ${num}`), datasets: [{ data: attempted, backgroundColor: 'rgba(59, 130, 246, 0.7)', borderColor: 'rgb(59, 130, 246)', borderWidth: 1 }] },
                options: commonOptions('Questions Attempted')
            });
        }

        let wrongCtx = document.getElementById('wrongChart')?.getContext('2d');
        if (wrongCtx) {
            charts.wrongChart = new Chart(wrongCtx, {
                type: 'bar',
                data: { labels: chapterNumbers.map(num => `Ch ${num}`), datasets: [{ data: wrong, backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: 'rgb(239, 68, 68)', borderWidth: 1 }] },
                options: commonOptions('Wrong Answers')
            });
        }

        let masteryCtx = document.getElementById('masteryChart')?.getContext('2d');
        if (masteryCtx) {
            charts.masteryChart = new Chart(masteryCtx, {
                type: 'bar',
                data: { labels: chapterNumbers.map(num => `Ch ${num}`), datasets: [{ data: mastery, backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgb(34, 197, 94)', borderWidth: 1 }] },
                options: { ...commonOptions('Consecutive Mastery'), scales: { ...commonOptions().scales, y: {...commonOptions().scales.y, suggestedMax: 7}}} // Suggest max for mastery
            });
        }

        let difficultyCtx = document.getElementById('difficultyChart')?.getContext('2d');
         if (difficultyCtx) {
            charts.difficultyChart = new Chart(difficultyCtx, {
                type: 'bar',
                data: {
                    labels: chapterNumbers.map(num => `Ch ${num}`),
                    datasets: [{
                        label: 'Difficulty Score',
                        data: difficulty,
                        backgroundColor: difficulty.map(d => d >= 100 ? 'rgba(239, 68, 68, 0.7)' : d >= 50 ? 'rgba(234, 179, 8, 0.7)' : 'rgba(34, 197, 94, 0.7)'),
                        borderColor: difficulty.map(d => d >= 100 ? 'rgb(239, 68, 68)' : d >= 50 ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)'),
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions('Difficulty Score'),
                    scales: {
                        ...commonOptions().scales,
                         y: {
                             ...commonOptions().scales.y,
                             max: 150, // Match max difficulty from calculation
                             ticks: {
                                 ...commonOptions().scales.y.ticks,
                                 callback: function(value) { return value + '%'; }
                             }
                         }
                     },
                    plugins: {
                        ...commonOptions().plugins,
                         tooltip: {
                             callbacks: {
                                 title: function(tooltipItems) { return `Chapter ${tooltipItems[0].label.substring(3)}`; },
                                 label: function(tooltipItem) { return `Difficulty: ${tooltipItem.raw.toFixed(1)}%`; }
                             }
                         }
                     }
                }
            });
         }
         console.log("Charts rendered successfully.");

    } catch (error) {
        console.error("Error rendering charts:", error);
         document.getElementById('dashboard-content').innerHTML = '<p class="text-center p-4 text-red-500">Error rendering charts. See console for details.</p>';
    }
}


// --- Import / Export / Exit ---

function exportData() {
    showLoading("Exporting Data...");
    setTimeout(() => {
        const dataToExport = JSON.parse(localStorage.getItem(DATA_KEY)); // Get current data
        if (!dataToExport) {
            displayContent('<p class="text-red-500">No data to export.</p>');
            hideLoading();
            return;
        }
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test_generator_data_${currentSubject?.name?.replace(/\s+/g, '_') || 'export'}_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        displayContent(`
        <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
             <p class="font-medium">Data exported successfully!</p>
        </div>`);
        hideLoading();
    }, 500);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async function(event) { // Make async
        const file = event.target.files[0];
        if (!file) {
            return; // No file selected
        }
         showLoading("Importing Data...");
        const reader = new FileReader();
        reader.onload = async function(e) { // Make async
            try {
                const importedJson = e.target.result;
                const importedData = JSON.parse(importedJson);

                // Basic validation: check if it has a 'subjects' structure
                if (!importedData || typeof importedData.subjects !== 'object' || importedData.subjects === null) {
                    throw new Error("Invalid data format. Expected 'subjects' object.");
                }

                 // More robust validation/migration could be added here if needed

                // --- CRITICAL: Re-sync with Markdown after import ---
                 if (markdownContentCache) {
                     console.log("Re-syncing imported data with cached Markdown...");
                     for (const subjectId in importedData.subjects) {
                         updateChaptersFromMarkdown(importedData.subjects[subjectId], markdownContentCache);
                     }
                 } else {
                     // If MD cache isn't available, try fetching it again
                     console.log("Markdown cache empty, attempting fetch for re-sync...");
                     try {
                         const response = await fetch(MARKDOWN_FILE_URL);
                         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                         const mdContent = await response.text();
                         markdownContentCache = mdContent; // Cache it now
                          for (const subjectId in importedData.subjects) {
                              updateChaptersFromMarkdown(importedData.subjects[subjectId], markdownContentCache);
                          }
                         console.log("Re-sync with fetched Markdown successful.");
                     } catch (fetchError) {
                          console.error("Failed to fetch Markdown during import re-sync:", fetchError);
                          alert("Warning: Imported data successfully, but could not re-synchronize chapter totals from the Markdown file. Chapter counts might be inaccurate until the next successful load.");
                     }
                 }

                 // Save the potentially modified imported data
                saveData(importedData);
                // Reload internal state from the newly saved data
                data = importedData; // Update in-memory data
                // Select the first subject from the imported data as current
                const firstSubjectId = Object.keys(data.subjects)[0];
                currentSubject = firstSubjectId ? data.subjects[firstSubjectId] : null;

                updateSubjectInfo();
                clearContent();
                displayContent(`
                <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md animate-fade-in">
                     <p class="font-medium">Data imported successfully!</p>
                     ${markdownContentCache ? '' : '<p class="text-sm">Note: Chapter totals re-synchronized with Markdown.</p>'}
                 </div>`);
                hideLoading();

            } catch (err) {
                console.error("Error importing data:", err);
                displayContent('<p class="text-red-500">Error importing data: ' + err.message + '</p>');
                hideLoading();
            }
        };
        reader.onerror = function() {
             displayContent('<p class="text-red-500">Error reading the selected file.</p>');
             hideLoading();
        }
        reader.readAsText(file);
    };
    input.click();
}


function exit() {
    // For a web app, 'exit' usually means navigating away or just providing a final message.
    // window.close() might not work depending on browser security settings.
    displayContent(`
        <div class="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4 rounded-md text-center">
            <p class="font-medium">Thank you for using the Test Generator!</p>
            <p class="text-sm mt-2">You can close this browser tab.</p>
        </div>`);
    // Optionally disable buttons etc.
}

// --- Initialization ---

async function initializeApp() {
     showLoading("Initializing and loading chapters...");
     data = await loadData();

     if (data) {
         // Set the first subject as current initially
         const firstSubjectId = Object.keys(data.subjects)[0];
         if (firstSubjectId) {
             currentSubject = data.subjects[firstSubjectId];
         } else {
              // Handle case where data exists but has no subjects (e.g., after deletion)
             console.warn("Loaded data has no subjects. Creating default.");
              data = JSON.parse(JSON.stringify(initialData));
              // Try to populate chapters for the new default subject if MD is available
               if (markdownContentCache) {
                   updateChaptersFromMarkdown(data.subjects["1"], markdownContentCache);
               }
              saveData(data);
               currentSubject = data.subjects["1"];
         }
         updateSubjectInfo();
         clearContent(); // Clear any previous state/content
         console.log("Initialization complete. Current Subject:", currentSubject?.name);
     } else {
         // loadData handled the fatal error alert
         console.error("Initialization failed: loadData returned null.");
          displayContent('<p class="text-red-500 font-bold p-4 text-center">Application failed to initialize. Please check the console for errors and ensure the Markdown file URL is correct.</p>');
     }
     hideLoading();

     // Set up theme toggle listener once
     const themeToggle = document.getElementById('theme-toggle');
     if (themeToggle && !themeToggle.dataset.listenerAttached) {
         themeToggle.addEventListener('click', () => {
             document.documentElement.classList.toggle('dark');
             localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
             // Re-render charts if dashboard is visible, as grid/tick colors might change
             if (!document.getElementById('dashboard').classList.contains('hidden')) {
                  renderCharts();
             }
         });
         themeToggle.dataset.listenerAttached = 'true'; // Prevent multiple listeners
     }

     // Apply initial theme
     if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
         document.documentElement.classList.add('dark');
     } else {
         document.documentElement.classList.remove('dark');
     }
}

// --- Global Event Listeners / Startup ---

// Use DOMContentLoaded to ensure HTML is ready before interacting with it
document.addEventListener('DOMContentLoaded', initializeApp);