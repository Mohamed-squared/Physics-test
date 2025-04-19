const DATA_KEY = 'test_generator_data_v2'; // Changed key for new structure
const PDF_GENERATION_OPTIONS = {
    margin: 1.5, // Margin in cm
    filename: 'exam.pdf', // Default filename, will be updated
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false }, // Improve quality, allow cross-origin images if needed
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Better page breaking
};
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
            "id": "1",
            "name": "Fundamentals of Physics",
            "max_questions_per_test": 42,
            "chapters": {}, // Will be populated by MD parse
            "studied_chapters": [],
            "pending_exams": [],
            "exam_history": []
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
    try {
        localStorage.setItem(DATA_KEY, JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
        alert("Error saving data. Your progress might not be saved. LocalStorage might be full or disabled.");
    }
}

async function loadData() {
    console.log("Loading data...");
    let loadedData = null;
    try {
        const storedData = localStorage.getItem(DATA_KEY);
        if (storedData) {
            loadedData = JSON.parse(storedData);
        }
    } catch (e) {
        console.error("Error parsing data from localStorage:", e);
        alert("Error reading saved data. Starting with initial data.");
        loadedData = null; // Force reinitialization
    }


    if (!loadedData || !loadedData.subjects || typeof loadedData.subjects !== 'object' || Object.keys(loadedData.subjects).length === 0) {
        console.log("No valid data found in localStorage or error parsing, initializing...");
        loadedData = JSON.parse(JSON.stringify(initialData)); // Deep copy
    } else {
        console.log("Data loaded from localStorage.");
        // --- Data Migration/Validation ---
        for (const subjectId in loadedData.subjects) {
            const subject = loadedData.subjects[subjectId];
            subject.id = subject.id || subjectId; // Ensure ID exists
            subject.name = subject.name || `Subject ${subjectId}`;
            subject.studied_chapters = subject.studied_chapters || [];
            // Validate pending exams: ensure allocation is object, not just count
            subject.pending_exams = (subject.pending_exams || []).map(exam => ({
                 ...exam,
                 allocation: (typeof exam.allocation === 'object' && exam.allocation !== null) ? exam.allocation : {},
                 results_entered: exam.results_entered || false
            }));
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
                 chap.available_questions = chap.available_questions || []; // Ensure it's at least an empty array
            }
        }
    }

    // --- Fetch and Parse Markdown ---
    try {
        console.log("Fetching Markdown file:", MARKDOWN_FILE_URL);
        // Add cache-busting query parameter to URL to avoid stale cache issues
        const url = `${MARKDOWN_FILE_URL}?t=${new Date().getTime()}`;
        const response = await fetch(url);
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
        if (Object.keys(loadedData.subjects).length === 0 || Object.keys(loadedData.subjects["1"]?.chapters || {}).length === 0) { // Check if data is truly empty
             alert("FATAL: Could not initialize data or load chapters from Markdown. Please check the URL and network connection.");
             return null; // Indicate fatal error
        } else {
             alert("Warning: Could not fetch or parse the chapter Markdown file. Using potentially outdated chapter information. Please check the URL and network connection.");
        }
    }

    return loadedData;
}

function showLoading(message) {
    const msgElement = document.getElementById('loading-message');
    if (msgElement) msgElement.textContent = message;
    document.getElementById('loading-overlay')?.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay')?.classList.add('hidden');
}

// Helper for rendering LaTeX in a specific element or the whole document body
function renderLatexInElement(element = document.body) {
    if (!element) return;
    if (window.renderMathInElement) {
       try {
           window.renderMathInElement(element, {
                delimiters: [
                   { left: '$$', right: '$$', display: true },
                   { left: '$', right: '$', display: false },
                   { left: '\\(', right: '\\)', display: false },
                   { left: '\\[', right: '\\]', display: true }
               ],
               throwOnError: false,
               //trust: true // Use if rendering complex user-provided content, handle security implications
           });
       } catch (error) {
           console.error("KaTeX rendering error in element:", element, error);
       }
   } else {
       // console.warn("KaTeX auto-render not loaded yet.");
   }
}


// --- Markdown Parsing ---

function updateChaptersFromMarkdown(subject, mdContent) {
    const parsedChapters = parseChaptersFromMarkdown(mdContent); // Gets { number: total_questions }
    const existingChapters = subject.chapters || {};
    const updatedChapters = {};
    const allKnownChapterNumbers = new Set([...Object.keys(existingChapters), ...Object.keys(parsedChapters)]);

    allKnownChapterNumbers.forEach(chapNum => {
        const parsedChapData = parsedChapters[chapNum];
        const existingChapData = existingChapters[chapNum];
        const newTotal = parsedChapData?.total_questions ?? 0; // Total from MD (or 0 if not in MD)

        if (existingChapData) {
            // Chapter exists in data
            updatedChapters[chapNum] = { ...existingChapData }; // Start with existing data

            if (parsedChapData) {
                // Chapter also exists in MD, update total and maybe available
                if (existingChapData.total_questions !== newTotal) {
                    console.log(`Chapter ${chapNum}: Total questions changed from ${existingChapData.total_questions} to ${newTotal}. Resetting available questions.`);
                    updatedChapters[chapNum].total_questions = newTotal;
                    // Reset available questions: start with all, then remove attempted ones IF we still have history?
                    // Safest: Just reset to all questions up to the new total.
                    updatedChapters[chapNum].available_questions = Array.from({ length: newTotal }, (_, j) => j + 1);
                    // Note: This loses the 'attempted' status if total changes. A more complex merge could preserve it.
                } else {
                    // Total is the same, ensure available_questions is valid
                    updatedChapters[chapNum].total_questions = newTotal; // Ensure total is set
                    updatedChapters[chapNum].available_questions = (existingChapData.available_questions || Array.from({ length: newTotal }, (_, j) => j + 1))
                        .filter(q => q > 0 && q <= newTotal) // Ensure valid range
                        .sort((a, b) => a - b);
                    updatedChapters[chapNum].available_questions = [...new Set(updatedChapters[chapNum].available_questions)]; // Remove duplicates
                }
            } else {
                // Chapter exists in data BUT NOT in MD anymore
                console.warn(`Chapter ${chapNum} exists in data but not found in the Markdown file. Marking total_questions as 0.`);
                updatedChapters[chapNum].total_questions = 0;
                updatedChapters[chapNum].available_questions = [];
            }

        } else if (parsedChapData) {
            // New chapter found ONLY in MD
            console.log(`Chapter ${chapNum}: Found new chapter in Markdown with ${newTotal} questions.`);
            updatedChapters[chapNum] = {
                total_questions: newTotal,
                total_attempted: 0,
                total_wrong: 0,
                available_questions: Array.from({ length: newTotal }, (_, j) => j + 1),
                mistake_history: [],
                consecutive_mastery: 0
            };
        }
         // Ensure essential fields exist even if modified
         updatedChapters[chapNum].total_attempted = updatedChapters[chapNum]?.total_attempted ?? 0;
         updatedChapters[chapNum].total_wrong = updatedChapters[chapNum]?.total_wrong ?? 0;
         updatedChapters[chapNum].mistake_history = updatedChapters[chapNum]?.mistake_history ?? [];
         updatedChapters[chapNum].consecutive_mastery = updatedChapters[chapNum]?.consecutive_mastery ?? 0;
    });

    subject.chapters = updatedChapters;
}


function parseChaptersFromMarkdown(mdContent) {
    const chapters = {}; // Store as { chapNumString: { total_questions: count } }
    if (!mdContent) return chapters;

    const lines = mdContent.split('\n');
    let currentChapterNum = null;
    let questionCount = 0;

    const chapterRegex = /^(?:.*?\s+)?###\s+Chapter\s+(\d+):?.*?$/i;
    const questionRegex = /^\s*\d+[\.\)]\s+.*/;

    for (const line of lines) {
        const trimmedLine = line.trim();
        const chapterMatch = trimmedLine.match(chapterRegex);

        if (chapterMatch) {
            // Finalize previous chapter's count
            if (currentChapterNum !== null) {
                if (!chapters[currentChapterNum]) chapters[currentChapterNum] = {};
                chapters[currentChapterNum].total_questions = questionCount;
                // console.log(`---> Finalized Chapter ${currentChapterNum} with ${questionCount} questions.`);
            }
            // Start new chapter
            currentChapterNum = chapterMatch[1]; // Chapter number (string)
            questionCount = 0; // Reset question count
            if (!chapters[currentChapterNum]) {
                 chapters[currentChapterNum] = { total_questions: 0 };
            }
            // console.log(`---> Found Chapter ${currentChapterNum}`);
        } else if (currentChapterNum !== null && questionRegex.test(line)) {
            questionCount++;
        }
    }

    // Finalize the last chapter's count
    if (currentChapterNum !== null) {
         if (!chapters[currentChapterNum]) chapters[currentChapterNum] = {};
         chapters[currentChapterNum].total_questions = questionCount;
         // console.log(`---> Finalized LAST Chapter ${currentChapterNum} with ${questionCount} questions.`);
    }

    if (Object.keys(chapters).length === 0) {
        console.error("ERROR: No chapters were parsed. Check chapterRegex and MD format.");
    } else {
        // console.log("Final Parsed Chapters Object:", JSON.stringify(chapters, null, 2));
    }
    return chapters; // Return { "1": { total_questions: 28 }, "2": { total_questions: 77 }, ... }
}


function extractQuestionsFromMarkdown(mdContent, selectedQuestionsMap) {
    const extracted = {
        questions: [], // { id, chapter, number, text, options: [{letter: 'A', text: '...'}], image, answer }
        answers: {}    // { "c<chapter>q<question>": "A", ... }
    };
    if (!markdownContentCache || !selectedQuestionsMap || Object.keys(selectedQuestionsMap).length === 0) {
        console.error("Markdown content or selection map invalid for extraction.");
        return extracted;
    }

    // console.log("Extracting questions for map:", JSON.stringify(selectedQuestionsMap));

    const lines = markdownContentCache.split('\n');
    let currentChapter = null;
    let currentQuestion = null; // Holds { number, textLines: [], options: [], answerLine: null }
    let processingState = 'seeking_chapter'; // 'seeking_chapter', 'seeking_question', 'in_question_text', 'in_options', 'found_answer'

    const chapterRegex = /^###\s+Chapter\s+(\d+):?.*?$/i;
    // Question Regex: Matches start of line, optional space, number, dot/paren, optional space, captures rest of line.
    const questionStartRegex = /^\s*(\d+)\s*[\.\)]\s*(.*)/;
    // Option Regex: Matches start of line, optional space, A-E, dot/paren, OPTIONAL space (\s*), captures rest of line.
    const optionRegex = /^\s*([A-Ea-e])[\.\)]\s*(.*)/; // Made space OPTIONAL
     // Answer Regex: Matches 'ans:' or 'answer:' at the end of a trimmed line.
     const answerRegex = /(?:ans|answer)\s*:\s*([a-zA-Z\d])\s*$/i;
    const imageRegex = /!\[(.*?)\]\((.*?)\)/;

    function finalizeQuestion() {
        if (currentQuestion && currentChapter) {
            const questionId = `c${currentChapter}q${currentQuestion.number}`;
            let fullText = currentQuestion.textLines.join('\n').trim();
            let answer = null;

            if (currentQuestion.answerLine) {
                const answerMatch = currentQuestion.answerLine.match(answerRegex);
                if (answerMatch) {
                    answer = answerMatch[1].toUpperCase();
                }
            }

            // Remove answer line from text if necessary (check last element)
            if (currentQuestion.answerLine && currentQuestion.textLines.length > 0 &&
                currentQuestion.textLines[currentQuestion.textLines.length - 1].trim() === currentQuestion.answerLine) {
                 currentQuestion.textLines.pop();
                 fullText = currentQuestion.textLines.join('\n').trim();
            }


            const imageMatch = fullText.match(imageRegex);
            const imageUrl = imageMatch ? imageMatch[2] : null;
            // Remove image markdown from text for cleaner display?
            // if (imageUrl) fullText = fullText.replace(imageRegex, '').trim();

            const formattedOptions = currentQuestion.options.map(opt => ({
                letter: opt.letter,
                text: opt.text.trim()
            }));

            extracted.questions.push({
                id: questionId,
                chapter: currentChapter,
                number: currentQuestion.number,
                text: fullText,
                options: formattedOptions,
                image: imageUrl,
                answer: answer
            });

            if (answer) {
                extracted.answers[questionId] = answer;
            }
        }
        currentQuestion = null;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]; // Process raw line
        const trimmedLine = line.trim();

        const chapterMatch = trimmedLine.match(chapterRegex);
        // Match question start on the raw line to preserve potential initial indent
        const questionMatch = line.match(questionStartRegex);
         // Match options and answers on the trimmed line
        const optionMatch = trimmedLine.match(optionRegex);
        const answerMatch = trimmedLine.match(answerRegex);

        if (chapterMatch) {
            finalizeQuestion();
            currentChapter = chapterMatch[1];
            processingState = 'seeking_question';
            // console.log(`Switched to Chapter ${currentChapter}`);
            continue;
        }

        if (processingState === 'seeking_chapter') continue;

        if (questionMatch) {
            finalizeQuestion();
            const qNum = parseInt(questionMatch[1], 10);
             // Capture text AFTER the number/dot/space pattern from the raw line
            const firstLineText = questionMatch[2];

            const chapterKey = String(currentChapter);
            if (selectedQuestionsMap[chapterKey] && selectedQuestionsMap[chapterKey].includes(qNum)) {
                currentQuestion = {
                    number: qNum,
                    textLines: [firstLineText], // Start with captured text
                    options: [],
                    answerLine: null
                };
                processingState = 'in_question_text';
                // console.log(`Starting selected Q: Ch ${chapterKey} Q ${qNum}`);
            } else {
                processingState = 'seeking_question'; // Skip lines until next selected Q
                currentQuestion = null;
            }
            continue; // Move to next line
        }

        // --- Processing lines *within* a selected question ---
        if (currentQuestion) {
             // Check answer line FIRST
             if (answerMatch) {
                 currentQuestion.answerLine = trimmedLine;
                 processingState = 'found_answer';
                  // console.log(`Found answer line: ${trimmedLine}`);
             } else if (optionMatch && processingState !== 'found_answer') {
                 // Found an option line (check on trimmed line)
                 processingState = 'in_options';
                 currentQuestion.options.push({
                     letter: optionMatch[1].toUpperCase(),
                     text: optionMatch[2] // Store captured text, might be multi-line
                 });
                 // console.log(`Added option ${optionMatch[1]}`);
             } else if (trimmedLine.length === 0 && processingState !== 'found_answer') {
                  // Handle blank lines within the question block (before answer)
                  if (processingState === 'in_question_text') {
                      currentQuestion.textLines.push(''); // Add blank line to question text
                  } else if (processingState === 'in_options' && currentQuestion.options.length > 0) {
                      // Add blank line to the current option's text
                      currentQuestion.options[currentQuestion.options.length - 1].text += '\n';
                  }
             } else if (trimmedLine.length > 0 && processingState !== 'found_answer') {
                 // It's a continuation line (part of question or option)
                 if (processingState === 'in_options' && currentQuestion.options.length > 0) {
                     // Append raw line to the *last* option's text
                     currentQuestion.options[currentQuestion.options.length - 1].text += '\n' + line;
                 } else {
                     // Append raw line to question text
                     processingState = 'in_question_text'; // Ensure state
                     currentQuestion.textLines.push(line);
                 }
             }
             // Ignore lines if state is 'found_answer'
        }
    }
    finalizeQuestion(); // Finalize the very last question

    console.log(`Extraction finished. Found ${extracted.questions.length} questions.`);
    // Add more detailed logging if errors persist:
    if (extracted.questions.length > 0) {
         // console.log("Sample Extracted Q1:", JSON.stringify(extracted.questions[0], null, 2));
    }
     const totalSelectedCount = Object.values(selectedQuestionsMap).reduce((sum, arr) => sum + arr.length, 0);
     if (extracted.questions.length === 0 && totalSelectedCount > 0) {
         console.error("Extraction Error: Selected questions but extracted none. Check Regex and MD format near selected questions. Common issues: incorrect spacing after number/letter, answer line format.");
     } else if (extracted.questions.length < totalSelectedCount) {
          console.warn(`Extraction Warning: Selected ${totalSelectedCount} questions but only extracted ${extracted.questions.length}. Some questions might have formatting issues.`);
     }

    return extracted;
}


// --- Difficulty & Allocation (No change needed from previous working version) ---

function calculateDifficulty(chap) {
    const attempted = Math.max(chap.total_attempted || 0, 0);
    const wrong = Math.min(Math.max(chap.total_wrong || 0, 0), attempted);

    if (attempted > 0) {
        let error_rate = wrong / attempted;
        let base_difficulty = Math.max(error_rate * 100, 10);
        let consecutive_mistakes = 0;
        if (chap.mistake_history && chap.mistake_history.length > 0) {
            for (let i = chap.mistake_history.length - 1; i >= 0; i--) {
                if (chap.mistake_history[i] > 0) consecutive_mistakes++; else break;
            }
        }
        let difficultyScore = base_difficulty + (consecutive_mistakes * 20);
        return Math.min(difficultyScore, 150);
    }
    return 100;
}

function allocateQuestions(chaptersToConsider, total_test_questions) {
    let weights = {};
    let chapterDetails = []; // Store { chap_num, weight, available, total }

    for (let chap_num in chaptersToConsider) {
        let chap = chaptersToConsider[chap_num];
        if (chap.total_questions > 0) {
            let mastery = chap.consecutive_mastery || 0;
            let weight_factor = mastery >= 6 ? 0.3 : mastery >= 3 ? 0.6 : 1.0;
            let difficulty = calculateDifficulty(chap);
            let weight = difficulty * weight_factor;
            weights[chap_num] = weight;
             chapterDetails.push({
                chap_num: chap_num,
                weight: weight,
                available: chap.available_questions?.length || 0, // Use current available count
                total: chap.total_questions
            });
        }
    }

    let sum_w = Object.values(weights).reduce((a, b) => a + b, 0);

    // Fallback if no weight or no chapters
    if (chapterDetails.length === 0) return {};
    if (sum_w === 0) {
        console.warn("Allocation fallback: distributing evenly due to zero total weight.");
        const chaptersWithQuestions = chapterDetails.filter(c => c.total > 0);
        if (chaptersWithQuestions.length === 0) return {};
        const questionsPerChapter = Math.floor(total_test_questions / chaptersWithQuestions.length);
        let remainder = total_test_questions % chaptersWithQuestions.length;
        const fallbackAllocations = {};
        let currentTotal = 0;
        chaptersWithQuestions.forEach((c, index) => {
            let num = questionsPerChapter + (index < remainder ? 1 : 0);
             num = Math.min(num, c.available); // Cap at available questions
            fallbackAllocations[c.chap_num] = num;
            currentTotal += num;
        });
         // Simple redistribution if capping caused shortfall (may not be perfect)
         let deficit = total_test_questions - currentTotal;
         for (let i = 0; deficit > 0 && i < chaptersWithQuestions.length; i++) {
            const c = chaptersWithQuestions[i];
             if (fallbackAllocations[c.chap_num] < c.available) {
                 fallbackAllocations[c.chap_num]++;
                 deficit--;
             }
         }
        return fallbackAllocations;
    }


    let proportions = Object.fromEntries(Object.entries(weights).map(([k, w]) => [k, w / sum_w]));
    let expected = Object.fromEntries(Object.entries(proportions).map(([k, p]) => [k, total_test_questions * p]));

    // Initial allocation (floor)
    let allocations = {};
     chapterDetails.forEach(c => {
         allocations[c.chap_num] = Math.floor(expected[c.chap_num] || 0);
          // Cap initial allocation at available questions
         allocations[c.chap_num] = Math.min(allocations[c.chap_num], c.available);
     });

    let total_allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
    let remaining = total_test_questions - total_allocated;

    // Distribute remaining based on fractional parts, respecting availability
    if (remaining > 0) {
        // Calculate remainders only for chapters with remaining capacity
         let remainders = chapterDetails
           .filter(c => allocations[c.chap_num] < c.available) // Only consider if not already at max available
           .map(c => ({
               chap_num: c.chap_num,
               remainder_val: (expected[c.chap_num] || 0) - allocations[c.chap_num],
               available: c.available
           }))
           .sort((a, b) => b.remainder_val - a.remainder_val); // Sort by descending remainder

        for (let i = 0; i < remaining && remainders.length > 0; i++) {
             // Find the chapter with the highest remainder that still has capacity
             let allocated = false;
             for (let j = 0; j < remainders.length; j++) {
                 const chap_info = remainders[j];
                 if (allocations[chap_info.chap_num] < chap_info.available) {
                     allocations[chap_info.chap_num]++;
                      allocated = true;
                      // Re-sort or just cycle? Cycling is simpler and often good enough.
                      // Move this chapter to the end for next round of allocation? Let's just cycle.
                      break; // Allocate one and move to next remaining question
                 }
             }
             if (!allocated) {
                  // This happens if total remaining > total available slots across all chapters
                  console.warn(`Could not allocate all remaining ${remaining - i} questions due to availability limits.`);
                  break; // Stop if no chapter can accept more questions
             }
        }
    }

    // Final check: Cap at available (should be redundant but safe)
    for (const chap_num in allocations) {
         const chap = chaptersToConsider[chap_num];
         allocations[chap_num] = Math.min(allocations[chap_num], chap.available_questions?.length || 0);
    }

    let final_allocated_sum = Object.values(allocations).reduce((a, b) => a + b, 0);
    if (final_allocated_sum < total_test_questions) {
         console.warn(`Final allocation (${final_allocated_sum}) is less than requested (${total_test_questions}) due to limits in chapter question counts or availability.`);
    }

    return allocations;
}

// --- Question Selection (No change needed from previous working version) ---

function selectQuestions(available, n, totalChapterQuestions) {
    if (n <= 0) return [];
    if (available.length === 0) return [];
    const numAvailable = available.length;
    const actualN = Math.min(n, numAvailable);
    if (actualN === 0) return [];
    if (actualN === numAvailable) return available.slice().sort((a, b) => a - b);

    const step = (totalChapterQuestions - 1) / (actualN - 1) || 1;
    let targetIndices = Array.from({ length: actualN }, (_, i) => Math.round(i * step));
    targetIndices = [...new Set(targetIndices)].sort((a,b)=>a-b);
    let targetQuestions = targetIndices.map(idx => idx + 1);

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
                }
            }
        }
        if (bestIndex !== -1) {
            selected.push(bestMatch);
            usedAvailableIndices.add(bestIndex);
        }
    }

    let currentSelectedCount = selected.length;
    if (currentSelectedCount < actualN) {
        const remainingAvailable = available.filter((_, index) => !usedAvailableIndices.has(index));
        // Shuffle remaining available to avoid always picking lowest numbers
        for (let i = remainingAvailable.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingAvailable[i], remainingAvailable[j]] = [remainingAvailable[j], remainingAvailable[i]];
        }
        selected.push(...remainingAvailable.slice(0, actualN - currentSelectedCount));
    }

    return selected.sort((a, b) => a - b);
}

function selectNewQuestionsAndUpdate(chap, n) {
    if (n <= 0) return [];
    if (!chap.available_questions || !Array.isArray(chap.available_questions)) {
        chap.available_questions = Array.from({ length: chap.total_questions }, (_, i) => i + 1);
    }
    chap.available_questions = [...new Set(chap.available_questions)].sort((a,b) => a-b);

    let available = chap.available_questions.slice();
    let selected = selectQuestions(available, n, chap.total_questions); // Use the selection logic

    // Update the chapter's actual available list
    chap.available_questions = chap.available_questions.filter(q => !selected.includes(q));

     if (selected.length < n) {
         console.warn(`Chapter ${chap.number || 'Unknown'}: Selected only ${selected.length} questions out of requested ${n} due to availability.`);
     }

    return selected.sort((a, b) => a - b);
}


// --- UI Functions ---

function updateSubjectInfo() {
    const infoEl = document.getElementById('subject-info');
    if (infoEl) {
        if (currentSubject) {
            infoEl.innerHTML = `<p class="text-lg">Current Subject: ${currentSubject.name}</p>`;
        } else {
            infoEl.innerHTML = `<p class="text-lg text-red-500">No Subject Selected</p>`;
        }
    }
}

function displayContent(html) {
    document.getElementById('content').innerHTML = html;
    // Attempt to render LaTeX after content is injected
    requestAnimationFrame(() => renderLatexInElement(document.getElementById('content')));
}

function clearContent() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('online-test-area').classList.add('hidden');
    document.getElementById('online-test-area').innerHTML = '';
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
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
    const chapterNumbers = Object.keys(chapters).filter(num => chapters[num].total_questions > 0).sort((a, b) => parseInt(a) - parseInt(b));

    if (chapterNumbers.length === 0) {
        displayContent('<p class="text-red-500">No chapters with questions available in this subject to select from.</p>');
        return;
    }

    let chapterOptionsHtml = chapterNumbers.map(num => `
        <div class="flex items-center">
            <input id="test-chap-${num}" type="checkbox" value="${num}" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
            <label for="test-chap-${num}" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Chapter ${num} (${chapters[num].available_questions?.length || 0} available / ${chapters[num].total_questions} total)
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
    let totalAvailableInScope = 0;


    if (mode === 'studied') {
        const studied = currentSubject.studied_chapters || [];
        if (studied.length === 0) {
            displayContent('<p class="text-red-500">No chapters marked as studied. Please mark some chapters first or choose specific chapters.</p><button onclick="showManageStudiedChapters()" class="btn-secondary mt-4">Manage Studied Chapters</button>');
            return;
        }
        studied.forEach(chapNum => {
            if (currentSubject.chapters[chapNum] && currentSubject.chapters[chapNum].total_questions > 0) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
                 totalAvailableInScope += currentSubject.chapters[chapNum].available_questions?.length || 0;
            }
        });
        chapterCount = Object.keys(relevantChapters).length;
        chapterScopeDescription = `Based on your ${chapterCount} studied chapter(s) (${totalAvailableInScope} questions available).`;
    } else if (mode === 'specific' && selectedChapters) {
        selectedChapters.forEach(chapNum => {
            if (currentSubject.chapters[chapNum] && currentSubject.chapters[chapNum].total_questions > 0) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
                 totalAvailableInScope += currentSubject.chapters[chapNum].available_questions?.length || 0;
            }
        });
        chapterCount = Object.keys(relevantChapters).length;
        chapterScopeDescription = `Based on the ${chapterCount} selected chapter(s) (${totalAvailableInScope} questions available).`;
    } else {
         displayContent('<p class="text-red-500">Invalid test mode or chapter selection.</p>');
         return;
    }

     if (chapterCount === 0) {
          displayContent('<p class="text-red-500">Could not find data for the selected/studied chapters, or they contain no questions.</p>');
         return;
     }
     if (totalAvailableInScope === 0) {
        displayContent('<p class="text-yellow-500">The selected/studied chapters currently have no available questions to generate a test from.</p>');
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
                 <button onclick='startTestGeneration(${JSON.stringify(mode)}, ${JSON.stringify(selectedChapters)}, "pdf")' class="w-full btn-primary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                     PDF Test (Download PDF / .tex)
                </button>
            </div>
             <button onclick="${mode === 'specific' ? 'promptChapterSelectionForTest()' : 'showTestGenerationDashboard()'}" class="w-full btn-secondary mt-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                 Back
             </button>
        </div>
    `;
    displayContent(html);
}

// Helper function to generate styled HTML for PDF conversion
function generatePdfHtml(examId, questions) {
    let questionHtml = '';
    let solutionHtml = '';
    let questionCounter = 0;

    // Define some basic CSS styles directly in the HTML string
    const styles = `
        <style>
            @import url('https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css'); /* Import KaTeX CSS */
            body { font-family: sans-serif; line-height: 1.4; font-size: 11pt; margin: 0; padding: 0;}
            .container { padding: 1.5cm; }
            .exam-header { text-align: center; margin-bottom: 1.5em; font-size: 14pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 0.5em; }
            .question-list { list-style-type: none; padding-left: 0; margin-left: 0; }
            .question-item { margin-bottom: 1.2em; padding-left: 0; page-break-inside: avoid; display: flex; }
            .question-number { font-weight: bold; width: 2em; flex-shrink: 0; } /* Fixed width for number */
            .question-content { flex-grow: 1; }
            .question-text { margin-bottom: 0.8em; }
            .options-list { list-style-type: none; padding-left: 0; margin-top: 0.5em; margin-bottom: 0.5em; }
            .option-item { margin-bottom: 0.3em; display: flex; align-items: baseline;}
            .option-letter { font-weight: bold; margin-right: 0.5em; width: 1.5em; display: inline-block; text-align: right; flex-shrink: 0; }
            .option-text { flex-grow: 1; }
            .question-image { max-width: 90%; max-height: 150px; height: auto; display: block; margin: 0.8em 0; border: 1px solid #eee; padding: 2px; }
            .solution { color: #006400; font-weight: bold; margin-top: 0.5em; padding-top: 0.3em; border-top: 1px dashed #ddd;}
            .katex-display > .katex { text-align: left !important; } /* Force left align display math */
            .katex { font-size: 1em !important; } /* Ensure KaTeX size matches body */
            /* Ensure lists inside prose don't interfere */
            .prose ul, .prose ol { margin-left: 0; padding-left: 0; list-style-type: none; }
             /* Handle multi-line options reasonably */
             .option-text p { margin: 0; } /* Remove default paragraph margins if options contain them */
        </style>
    `;

    // Sort questions by chapter then number for consistent order
    questions.sort((a, b) => {
        const chapDiff = parseInt(a.chapter) - parseInt(b.chapter);
        if (chapDiff !== 0) return chapDiff;
        return a.number - b.number;
    });

    questions.forEach(q => {
        questionCounter++;
        // Sanitize HTML within text/options - basic example, needs robust library for security if source is untrusted
        let qTextForHtml = q.text.replace(/</g, "<").replace(/>/g, ">");
        let optionsForHtml = (q.options || []).map(opt => {
            let optTextForHtml = opt.text.replace(/</g, "<").replace(/>/g, ">");
             // Replace markdown newlines with <br> for HTML display
             optTextForHtml = optTextForHtml.replace(/\n/g, '<br>');
            return `<li class="option-item"><span class="option-letter">${opt.letter}.</span><span class="option-text">${optTextForHtml}</span></li>`;
        }).join('');
        let imageHtml = q.image ? `<img src="${q.image}" alt="Question Image - Ch ${q.chapter} Q ${q.number}" class="question-image">` : '';

        // Question HTML Item
        questionHtml += `
            <li class="question-item">
                <div class="question-number">${questionCounter}.</div>
                <div class="question-content">
                    <div class="question-text prose">${qTextForHtml}</div>
                    ${imageHtml}
                    ${optionsForHtml ? `<ul class="options-list">${optionsForHtml}</ul>` : ''}
                 </div>
            </li>
        `;

        // Solution HTML Item
         solutionHtml += `
            <li class="question-item">
                 <div class="question-number">${questionCounter}.</div>
                 <div class="question-content">
                    <div class="question-text prose">${qTextForHtml}</div>
                    ${imageHtml}
                    ${optionsForHtml ? `<ul class="options-list">${optionsForHtml}</ul>` : ''}
                    <div class="solution">Answer: ${q.answer || 'N/A'}</div>
                </div>
            </li>
         `;
    });

    // We need KaTeX CSS linked in the generated HTML for html2pdf to render math correctly
    const katexCSSLink = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">`;

    const fullQuestionHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">${katexCSSLink}${styles}</head><body><div class="container"><div class="exam-header">Exam: ${examId}</div><ol class="question-list">${questionHtml}</ol></div></body></html>`;
    const fullSolutionHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">${katexCSSLink}${styles}</head><body><div class="container"><div class="exam-header">Solutions: ${examId}</div><ol class="question-list">${solutionHtml}</ol></div></body></html>`;

    return { questionHtml: fullQuestionHtml, solutionHtml: fullSolutionHtml };
}


// Modified function to trigger PDF generation
async function generateAndDownloadPdf(htmlContent, baseFilename) {
    showLoading(`Generating ${baseFilename}...`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI update

    // Create a temporary, hidden iframe to isolate rendering (safer)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '210mm'; // A4 width
    iframe.style.height = '1px'; // Minimal height
    iframe.style.left = '-9999px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Write the HTML content to the iframe
    iframe.contentDocument.open();
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();

    // Add KaTeX script to the iframe's head to render math within it
     const katexScript = iframe.contentDocument.createElement('script');
     katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js";
     katexScript.defer = true;
     const renderScript = iframe.contentDocument.createElement('script');
     renderScript.defer = true;
     renderScript.textContent = `
         document.addEventListener("DOMContentLoaded", function() {
             // Include the auto-render script dynamically if needed, or call manually
              const autoRenderScript = document.createElement('script');
              autoRenderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js";
              autoRenderScript.defer = true;
              autoRenderScript.onload = () => {
                  try {
                     renderMathInElement(document.body, {
                         delimiters: [
                             {left: "$$", right: "$$", display: true}, {left: "$", right: "$", display: false},
                             {left: "\\\\(", right: "\\\\)", display: false}, {left: "\\\\[", right: "\\\\]", display: true}
                         ],
                         throwOnError: false
                     });
                     console.log('KaTeX rendered inside iframe.');
                      // Notify parent window that rendering is done (optional but good)
                      window.parent.postMessage('katexRendered', '*');
                  } catch(e) {
                      console.error('Error rendering KaTeX in iframe:', e);
                      window.parent.postMessage('katexError', '*');
                  }
              };
              document.head.appendChild(autoRenderScript);
         });
     `;

     iframe.contentDocument.head.appendChild(katexScript);
     iframe.contentDocument.head.appendChild(renderScript);


    // Wait for KaTeX to render (use postMessage or a timeout)
     await new Promise(resolve => {
         const timeout = setTimeout(() => {
             console.warn("KaTeX rendering timeout in iframe.");
             resolve(); // Proceed even if timeout occurs
         }, 5000); // 5 second timeout

          const messageHandler = (event) => {
             if (event.source === iframe.contentWindow && (event.data === 'katexRendered' || event.data === 'katexError')) {
                 clearTimeout(timeout);
                 window.removeEventListener('message', messageHandler);
                 resolve();
             }
         };
         window.addEventListener('message', messageHandler);
         // Fallback if postMessage fails or isn't received
         // setTimeout(resolve, 3000); // Wait ~3 seconds as fallback
     });


    // Configure html2pdf
    const options = { ...PDF_GENERATION_OPTIONS };
    options.filename = `${baseFilename}.pdf`;

    // Generate PDF from the iframe's content
    try {
        console.log(`Starting html2pdf generation for ${options.filename} from iframe`);
        // Target the body of the iframe's document
        const pdfWorker = html2pdf().set(options).from(iframe.contentDocument.body);
        await pdfWorker.save(); // Triggers download
        console.log(`PDF generation likely successful for ${options.filename}`);
    } catch (error) {
        console.error(`Error generating PDF ${options.filename}:`, error);
        alert(`Failed to generate PDF: ${options.filename}. Error: ${error.message}. Please try downloading the .tex source instead.`);
    } finally {
        // Clean up the iframe
        document.body.removeChild(iframe);
        hideLoading();
    }
}



async function startTestGeneration(mode, selectedChapters, testType) { // Make async
    showLoading(`Generating ${testType === 'online' ? 'Online' : 'Test Files'}...`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI update

    let relevantChapters = {};
    if (mode === 'studied') {
        const studied = currentSubject.studied_chapters || [];
        studied.forEach(chapNum => {
            if (currentSubject.chapters[chapNum] && currentSubject.chapters[chapNum].total_questions > 0) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
            }
        });
    } else if (mode === 'specific' && selectedChapters) {
        selectedChapters.forEach(chapNum => {
             if (currentSubject.chapters[chapNum] && currentSubject.chapters[chapNum].total_questions > 0) {
                relevantChapters[chapNum] = currentSubject.chapters[chapNum];
            }
        });
    }

    if (Object.keys(relevantChapters).length === 0) {
        hideLoading();
        displayContent('<p class="text-red-500">Error: No relevant chapters with questions found.</p>');
        return;
    }

     const totalQuestionsForTest = currentSubject.max_questions_per_test || 42;
     const allocationCounts = allocateQuestions(relevantChapters, totalQuestionsForTest); // Returns {chapNum: count}
     const totalAllocatedCount = Object.values(allocationCounts).reduce((a, b) => a + b, 0);

     if (totalAllocatedCount === 0) {
         hideLoading();
         displayContent(`<p class="text-yellow-500">Warning: Could not allocate any questions based on the selected chapters and difficulty/availability.</p>`);
         return;
     }

     console.log("Allocation Counts:", allocationCounts);

     // Select actual questions and get the map { chapNum: [q1, q2], ... }
     const selectedQuestionsMap = {};
     let allocationDetails = "";
     let actualTotalSelected = 0;
     for (const chapNum in allocationCounts) {
         const n = allocationCounts[chapNum];
         if (n > 0) {
             const questionsSelected = selectNewQuestionsAndUpdate(currentSubject.chapters[chapNum], n);
             if (questionsSelected.length > 0) {
                 selectedQuestionsMap[chapNum] = questionsSelected;
                 actualTotalSelected += questionsSelected.length;
                 allocationDetails += `<p>Chapter ${chapNum}: ${questionsSelected.length} questions selected.</p>`;
             } else {
                  allocationDetails += `<p>Chapter ${chapNum}: 0 questions selected (requested ${n}, none available/selected).</p>`;
             }
         }
     }


     if (actualTotalSelected === 0) {
          hideLoading();
          displayContent(`<p class="text-red-500">Error: No questions could be selected from the available pool for the allocated chapters.</p>`);
          saveData(data); // Save updated available_questions lists
          return;
     }
     if (actualTotalSelected < totalAllocatedCount) {
         console.warn(`Requested ${totalAllocatedCount} questions, but only selected ${actualTotalSelected} due to availability limits.`);
     }

     const examId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);

     // Extract full question data using the improved parser
     if (!markdownContentCache) {
         hideLoading();
         displayContent('<p class="text-red-500">Error: Markdown content cache is empty, cannot extract questions.</p>');
         return;
     }
     const { questions: extractedQuestionsData, answers } = extractQuestionsFromMarkdown(markdownContentCache, selectedQuestionsMap);

     if (extractedQuestionsData.length !== actualTotalSelected) {
          console.warn(`Selection resulted in ${actualTotalSelected} questions, but extraction found ${extractedQuestionsData.length}. Check parsing.`);
          if (extractedQuestionsData.length === 0) {
              hideLoading();
              displayContent('<p class="text-red-500">Error: Failed to extract any questions from the Markdown file based on the selection. Check parsing logic and Markdown format.</p>');
              saveData(data); // Save state
              return;
          }
     }


     if (testType === 'online') {
         // --- Generate Online Test ---
         const allMcq = extractedQuestionsData.every(q => answers[q.id] && q.options && q.options.length > 0); // Check for answers AND options
         if (!allMcq) {
             hideLoading();
             displayContent('<p class="text-red-500">Error: Online testing requires questions to have both options (A, B, C...) and a clear answer (e.g., "ans: A"). Some selected questions are missing one or both.</p>');
             saveData(data); // Save state
             return;
         }

         currentOnlineTestState = {
             examId: examId,
             questions: extractedQuestionsData,
             correctAnswers: answers,
             userAnswers: {},
             allocation: selectedQuestionsMap, // Store the *actual* selection map
             startTime: Date.now(),
             timerInterval: null,
             currentQuestionIndex: 0
         };

         saveData(data); // Save updated available_questions
         hideLoading();
         launchOnlineTestUI();

     } else {
         // --- Generate PDF Test ---

         // 1. Generate HTML content for PDF
         const { questionHtml, solutionHtml } = generatePdfHtml(examId, extractedQuestionsData);

         // 2. Add to pending exams in data structure
         currentSubject.pending_exams.push({
             id: examId,
             allocation: selectedQuestionsMap, // Store the *actual* selected map
             results_entered: false
         });

         // 3. Save updated data
         saveData(data);

         // 4. Display download buttons
         const questionsPdfFilename = `Exam_${examId}`;
         const solutionsPdfFilename = `SolutionManual_${examId}`;
         const questionsTexFilename = `Exam_${examId}.tex`;
         const solutionsTexFilename = `SolutionManual_${examId}.tex`;

         // Generate .tex source as fallback/option
         const { questionsTex, solutionsTex } = generateTexSource(examId, extractedQuestionsData);

         displayContent(`
            <div class="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-md mb-4">
                <p class="font-medium">PDF Test Files Ready</p>
                <p>Exam ID: ${examId}</p>
                <p>Total Questions: ${actualTotalSelected}</p>
            </div>
             <div class="space-y-3">
                 <button id="download-pdf-q" class="w-full btn-primary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                     Download Questions PDF
                 </button>
                 <button id="download-pdf-s" class="w-full btn-primary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                     Download Solutions PDF
                 </button>
                 <button onclick="downloadTexFile('${questionsTexFilename}', \`${btoa(unescape(encodeURIComponent(questionsTex)))}\`)" class="w-full btn-secondary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                     Download Questions .tex (Source)
                 </button>
                  <button onclick="downloadTexFile('${solutionsTexFilename}', \`${btoa(unescape(encodeURIComponent(solutionsTex)))}\`)" class="w-full btn-secondary">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                     Download Solutions .tex (Source)
                 </button>
             </div>
             <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">This exam has been added to the pending exams list. Enter results manually once completed using the Exams Dashboard.</p>
             <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">${allocationDetails}</div>
         `);

         // Add event listeners AFTER the buttons are in the DOM
         document.getElementById('download-pdf-q')?.addEventListener('click', () => generateAndDownloadPdf(questionHtml, questionsPdfFilename));
         document.getElementById('download-pdf-s')?.addEventListener('click', () => generateAndDownloadPdf(solutionHtml, solutionsPdfFilename));

         hideLoading(); // Hide loading indicator AFTER setting up the UI
     }
}


// Function to generate basic .tex source (Reconstructing from parsed data)
function generateTexSource(examId, questions) {
    let questionsTex = `${LATEX_PDF_HEADER}\\section*{Exam: ${examId.replace(/_/g, '\\_')}}\n\\begin{enumerate}[label=\\arabic*.]\n`;
    let solutionsTex = `${LATEX_PDF_HEADER}\\section*{Solutions: ${examId.replace(/_/g, '\\_')}}\n\\begin{enumerate}[label=\\arabic*.]\n`;
    let questionCounter = 0;

    // Sort questions by chapter then number for consistent order
    questions.sort((a, b) => {
        const chapDiff = parseInt(a.chapter) - parseInt(b.chapter);
        if (chapDiff !== 0) return chapDiff;
        return a.number - b.number;
    });

    for (const q of questions) {
        questionCounter++;

        // Reconstruct the question text for TeX source
        let qTextForTex = q.text; // Start with parsed text
        if (q.image) {
             // Add image command if needed, adjust path/options as necessary
             qTextForTex += `\n\\begin{center}\\includegraphics[width=0.6\\textwidth]{${q.image}}\\end{center}\n`;
        }

        // Add options
        let optionsText = (q.options || []).map(opt => `\\item[${opt.letter}.] ${opt.text}`).join('\n');
        if (optionsText) {
             qTextForTex += `\n\\begin{enumerate}[label=\\Alph*., itemsep=0pt, parsep=0pt]\n${optionsText}\n\\end{enumerate}\n`;
        }

        // Basic LaTeX escaping (very simplistic, needs improvement for complex content)
        const escapeLatex = (str) => str
            .replace(/\\/g, '\\textbackslash{}') // Must escape backslashes first
            .replace(/([{}&%$#_])/g, '\\$1') // Escape special characters
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');

         let processedQText = escapeLatex(qTextForTex);
         // Note: This simplistic escaping will break existing LaTeX commands ($...$, \command, etc.)
         // A more sophisticated Markdown-to-LaTeX converter is needed for robust TeX generation.
         // For now, we assume the parsed text *doesn't* contain raw LaTeX that needs preserving.


        // Add answer for solutions file
        let solutionText = processedQText;
        if (q.answer) {
            solutionText += `\n\n\\textbf{Answer: ${q.answer}}`;
        }

        questionsTex += `\\item ${processedQText}\n\n`;
        solutionsTex += `\\item ${solutionText}\n\n`;
    }

    questionsTex += `\\end{enumerate}\n${LATEX_PDF_FOOTER}`;
    solutionsTex += `\\end{enumerate}\n${LATEX_PDF_FOOTER}`;
    return { questionsTex, solutionsTex };
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
    document.getElementById('menu').classList.add('hidden');
    const testArea = document.getElementById('online-test-area');
    testArea.innerHTML = ''; // Clear previous test
    testArea.classList.remove('hidden');

    const totalQuestions = currentOnlineTestState.questions.length;
    const durationMillis = ONLINE_TEST_DURATION_MINUTES * 60 * 1000;
    currentOnlineTestState.endTime = currentOnlineTestState.startTime + durationMillis;

    testArea.innerHTML = `
        <div class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow z-40 border-b dark:border-gray-700">
            <div class="container mx-auto flex justify-between items-center">
                <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">Online Test</span>
                <div id="timer" class="text-lg font-mono px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">--:--:--</div>
                 <button id="force-submit-btn" onclick="confirmForceSubmit()" class="btn-danger-small hidden">Submit Now</button>
            </div>
        </div>
        <div id="question-container" class="pt-20 pb-24 container mx-auto px-4"> {/* Increased bottom padding */}
            </div>
        <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow-up z-40 border-t dark:border-gray-700">
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
    if (!timerElement) return; // Exit if element not found
    if (currentOnlineTestState.timerInterval) {
        clearInterval(currentOnlineTestState.timerInterval);
    }

    function updateTimerDisplay() {
        if (!currentOnlineTestState || !currentOnlineTestState.endTime) {
             clearInterval(currentOnlineTestState?.timerInterval);
             return;
        }
        const now = Date.now();
        const remaining = currentOnlineTestState.endTime - now;

        if (remaining <= 0) {
            clearInterval(currentOnlineTestState.timerInterval);
            timerElement.textContent = "00:00:00";
            timerElement.classList.add('text-red-500');
            // Avoid alert loops if submit fails or takes time
            if (currentOnlineTestState.status !== 'submitting') {
                 currentOnlineTestState.status = 'submitting'; // Mark as submitting
                 alert("Time's up! Submitting your test automatically.");
                 submitOnlineTest(); // Will hide loading overlay
            }
        } else {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
             timerElement.textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

             const forceSubmitBtn = document.getElementById('force-submit-btn');
              if (forceSubmitBtn) {
                   if (remaining < 5 * 60 * 1000) {
                     forceSubmitBtn.classList.remove('hidden');
                 } else {
                     forceSubmitBtn.classList.add('hidden');
                 }
              }

        }
    }

    updateTimerDisplay(); // Initial display
    currentOnlineTestState.timerInterval = setInterval(updateTimerDisplay, 1000);
}

function displayCurrentQuestion() {
    if (!currentOnlineTestState) return; // Safety check

    const index = currentOnlineTestState.currentQuestionIndex;
    const question = currentOnlineTestState.questions[index];
    const container = document.getElementById('question-container');
    const totalQuestions = currentOnlineTestState.questions.length;

    if (!question || !container) {
        console.error("Could not display question - missing question data or container element.");
        return;
    }

    // Generate options HTML dynamically from the parsed options
    let optionsHtml = (question.options || []).map(opt => {
        // Replace markdown newlines with <br> for HTML display in options
        const optionTextHtml = opt.text.replace(/\n/g, '<br>');
       return `
       <label class="flex items-start space-x-3 p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
           <input type="radio" name="mcqOption" value="${opt.letter}" class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 mt-1 shrink-0"
                  ${currentOnlineTestState.userAnswers[question.id] === opt.letter ? 'checked' : ''}
                  onchange="recordAnswer('${question.id}', this.value)">
            <div class="flex items-baseline">
               <span class="font-medium w-6 text-right mr-2">${opt.letter}.</span>
                <div class="flex-1 option-text-container" id="option-text-${opt.letter}">${optionTextHtml}</div>
            </div>
       </label>
       `
   }).join('');

    if (!question.options || question.options.length === 0) {
        optionsHtml = '<p class="text-sm text-yellow-600 dark:text-yellow-400">(No multiple choice options found for this question)</p>';
    }

   container.innerHTML = `
       <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-4 animate-fade-in">
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

   // Render LaTeX after content update
   requestAnimationFrame(() => {
        renderLatexInElement(document.getElementById('question-text-area'));
        (question.options || []).forEach(opt => {
            const optElement = document.getElementById(`option-text-${opt.letter}`);
            if (optElement) {
                renderLatexInElement(optElement);
            }
        });
   });
}


function navigateQuestion(direction) {
    if (!currentOnlineTestState) return;
    const newIndex = currentOnlineTestState.currentQuestionIndex + direction;
    const totalQuestions = currentOnlineTestState.questions.length;

    if (newIndex >= 0 && newIndex < totalQuestions) {
        currentOnlineTestState.currentQuestionIndex = newIndex;
        displayCurrentQuestion();
    }
}

function recordAnswer(questionId, answer) {
    if (!currentOnlineTestState) return;
    currentOnlineTestState.userAnswers[questionId] = answer;
    // Optional: Save interim progress to localStorage? Could be complex.
}

function confirmSubmitOnlineTest() {
     if (!currentOnlineTestState) return;
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
    if (!currentOnlineTestState) return; // Prevent multiple submissions
    showLoading("Submitting and Grading...");
    currentOnlineTestState.status = 'submitting'; // Mark status

    if (currentOnlineTestState.timerInterval) {
        clearInterval(currentOnlineTestState.timerInterval);
        currentOnlineTestState.timerInterval = null;
    }
    document.getElementById('online-test-area').classList.add('hidden'); // Hide test UI immediately

    setTimeout(() => { // Use timeout to allow UI to hide before processing
        try {
            const results = {
                examId: currentOnlineTestState.examId,
                subjectId: currentSubject.id,
                timestamp: new Date().toISOString(),
                durationMinutes: Math.round((Date.now() - currentOnlineTestState.startTime) / 60000),
                type: 'online', // Add type
                questions: [], // { id, chapter, number, text, image, userAnswer, correctAnswer, isCorrect }
                score: 0,
                totalQuestions: currentOnlineTestState.questions.length,
                resultsByChapter: {} // { chapNum: { attempted, correct, wrong } }
            };

            let totalCorrect = 0;

            // Initialize resultsByChapter based on the *actual questions* in the test
            currentOnlineTestState.questions.forEach(q => {
                 if (!results.resultsByChapter[q.chapter]) {
                     results.resultsByChapter[q.chapter] = { attempted: 0, correct: 0, wrong: 0 };
                 }
            });


            currentOnlineTestState.questions.forEach(q => {
                const userAnswer = currentOnlineTestState.userAnswers[q.id] || null;
                const correctAnswer = currentOnlineTestState.correctAnswers[q.id];
                // Be lenient with case for answers? Maybe not for standard tests.
                const isCorrect = userAnswer === correctAnswer;

                // Record question-level result
                results.questions.push({
                    id: q.id,
                    chapter: q.chapter,
                    number: q.number,
                    text: q.text,
                    options: q.options, // Include options for review
                    image: q.image,
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer,
                    isCorrect: isCorrect
                });

                // Update chapter-level results
                const chapResult = results.resultsByChapter[q.chapter];
                if (chapResult) {
                    chapResult.attempted++;
                    if (isCorrect) {
                        chapResult.correct++;
                        totalCorrect++;
                    } else {
                        chapResult.wrong++;
                    }
                } else {
                    console.error(`Chapter ${q.chapter} not found in exam results structure.`);
                }

                // --- Update Global Chapter Statistics ---
                const globalChap = currentSubject.chapters[q.chapter];
                if (globalChap) {
                    globalChap.total_attempted = (globalChap.total_attempted || 0) + 1;
                    if (!isCorrect) {
                        globalChap.total_wrong = (globalChap.total_wrong || 0) + 1;
                    }
                    // Note: Mistake history & mastery are updated based on chapter performance below
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
                     if (globalChap.mistake_history.length > 20) {
                          globalChap.mistake_history.shift();
                     }
                     // Update mastery based on this session's chapter performance
                     globalChap.consecutive_mastery = (numWrongInChapter === 0)
                         ? (globalChap.consecutive_mastery || 0) + 1
                         : 0;
                 }
            }


            results.score = totalCorrect;
            currentSubject.exam_history = currentSubject.exam_history || [];
            currentSubject.exam_history.push(results);

            saveData(data); // Save updated chapter stats and exam history
            hideLoading();
            displayOnlineTestResults(results);
             currentOnlineTestState = null; // Clear test state *after* successful processing

        } catch (error) {
             console.error("Error during online test submission processing:", error);
             hideLoading();
             displayContent(`<p class="text-red-500">An error occurred while submitting your test results. Please try again or check the console. Your answers might not have been saved.</p>`);
             // Optionally try to preserve currentOnlineTestState for retry? Difficult.
             currentOnlineTestState = null; // Clear state on error too? Or allow retry? Let's clear.
        }

    }, 300); // Short delay
}


function displayOnlineTestResults(results) {
    clearContent(); // Clear main content area first
    document.getElementById('menu').classList.remove('hidden'); // Show menu again

    const percentage = results.totalQuestions > 0 ? ((results.score / results.totalQuestions) * 100).toFixed(1) : 0;

    let chapterSummaryHtml = Object.entries(results.resultsByChapter).sort((a,b) => parseInt(a[0]) - parseInt(b[0])).map(([chapNum, chapRes]) => {
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
             {/* Add button to see full question text here if needed */}
         </div>
     `).join('');
     if (results.questions.length > 5) {
         reviewHtml += `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Showing first 5 questions. Full details available in Exams Dashboard.</p>`
     }
      if (results.questions.length === 0) {
          reviewHtml = `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">No individual question details available for this exam type.</p>`
      }

    const html = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4 animate-fade-in">
            <h2 class="text-2xl font-semibold mb-4 text-center text-primary-600 dark:text-primary-400">Test Results: ${results.examId}</h2>
            <div class="text-center mb-6">
                 <p class="text-4xl font-bold ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}">
                    ${results.score} / ${results.totalQuestions} (${percentage}%)
                 </p>
                 ${results.durationMinutes !== null ? `<p class="text-gray-600 dark:text-gray-400">Duration: ${results.durationMinutes} minutes</p>`: ''}
            </div>

            ${chapterSummaryHtml ? `
             <div class="mb-6">
                 <h3 class="text-lg font-semibold mb-2">Chapter Performance</h3>
                 <ul class="space-y-1">
                     ${chapterSummaryHtml}
                 </ul>
             </div>` : ''}

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Quick Review</h3>
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

// --- PDF Exam Result Entry ---

function showEnterResults() {
    const pending_exams = (currentSubject.pending_exams || []).filter(exam => !exam.results_entered); // Filter just in case
    if (pending_exams.length === 0) {
        return '<p class="text-sm text-gray-500 dark:text-gray-400 mt-4">No pending PDF exams to enter results for.</p>';
    }

    let output = '<h3 class="text-lg font-semibold mb-3 mt-6 text-yellow-600 dark:text-yellow-400">Pending PDF Exams</h3><div class="space-y-2">';
    pending_exams.forEach((exam) => {
        // Find the index relative to the original array for correct deletion/update
        const originalIndex = (currentSubject.pending_exams || []).findIndex(p => p.id === exam.id);
        if (originalIndex === -1) return;

        output += `
        <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex justify-between items-center">
             <span class="text-sm font-medium">${exam.id}</span>
             <div>
                 <button onclick="enterResultsForm(${originalIndex})" title="Enter Results" class="btn-primary-small mr-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    Enter Results
                 </button>
                  <button onclick="confirmDeletePendingExam(${originalIndex})" title="Delete Pending Exam" class="btn-danger-small">
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
    // allocation is now { chapNum: [q1, q2], ... }
    const detailedAllocation = exam.allocation;
    if (!detailedAllocation || typeof detailedAllocation !== 'object') {
         displayContent('<p class="text-red-500">Error: Invalid allocation data for this pending exam.</p>');
         return;
    }

    let formHtml = `<p class="font-bold mb-4">Entering results for PDF exam ${exam.id}:</p><div class="space-y-4">`;
    let chaptersWithInputs = []; // Store chapters that actually have inputs

    const sortedChaps = Object.keys(detailedAllocation).sort((a, b) => parseInt(a) - parseInt(b));

    for (let chap_num of sortedChaps) {
        const questionsInChapter = detailedAllocation[chap_num];
        const n = questionsInChapter?.length || 0; // Actual number of questions for this chapter
        if (n > 0) { // Only show input if questions were allocated
             chaptersWithInputs.push(chap_num); // Add to list of chapters needing input
            formHtml += `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label for="wrong-${chap_num}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chapter ${chap_num}: Number of WRONG answers (out of ${n})
                </label>
                <input id="wrong-${chap_num}" type="number" min="0" max="${n}" value="0" required
                    class="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            </div>`;
        }
    }

     if (chaptersWithInputs.length === 0) {
         formHtml += '<p class="text-yellow-500">No questions seem to have been allocated to chapters for this exam record.</p>';
     }

    formHtml += `</div>
    <div class="mt-6 flex space-x-3">
        <button onclick="submitPendingResults(${index}, ${JSON.stringify(chaptersWithInputs)})" ${chaptersWithInputs.length === 0 ? 'disabled' : ''}
            class="flex-1 btn-primary ${chaptersWithInputs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
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

// --- PDF Exam Result Entry (Needs Modification) ---

function submitPendingResults(index, chap_nums) {
   showLoading("Saving PDF Results...");
   setTimeout(() => {
       const exam = currentSubject.pending_exams[index];
       const chapters = currentSubject.chapters;
       let allInputsValid = true;
       let chapterResults = {}; // { chapNum: { attempted, wrong, correct } }
       let totalAttemptedInExam = 0;
       let totalWrongInExam = 0;

       // *** CRITICAL CHANGE: Use the detailed allocation stored in pending_exams ***
       // exam.allocation should now be { chapNum: [q1, q2, ...], ... }
       const detailedAllocation = exam.allocation;

       for (let chap_num of chap_nums) { // chap_nums is still just the list of chapter numbers with inputs
           const questionsInChapter = detailedAllocation[chap_num];
           if (!questionsInChapter || questionsInChapter.length === 0) continue; // Skip if no questions were actually selected

           const n = questionsInChapter.length; // Actual number of questions for this chapter in this exam
           totalAttemptedInExam += n;

           const inputElement = document.getElementById(`wrong-${chap_num}`);
           let wrong = parseInt(inputElement.value);

            // Validate against the *actual* number of questions 'n' for this chapter
           if (isNaN(wrong) || wrong < 0 || wrong > n) {
               hideLoading();
               alert(`Invalid input for Chapter ${chap_num}. Number wrong must be between 0 and ${n}.`);
               inputElement.classList.add('border-red-500', 'ring-red-500');
               inputElement.focus();
               allInputsValid = false;
               break;
           } else {
               inputElement.classList.remove('border-red-500', 'ring-red-500');
               totalWrongInExam += wrong;
               chapterResults[chap_num] = {
                   attempted: n,
                   wrong: wrong,
                   correct: n - wrong // Calculate correct answers
                };
           }
       }

       if (!allInputsValid) {
           hideLoading();
           return;
       }

       // Update global chapter stats
       for (let chap_num in chapterResults) {
           const result = chapterResults[chap_num];
           const chap = chapters[chap_num];

           if (chap) {
               chap.total_attempted = (chap.total_attempted || 0) + result.attempted;
               chap.total_wrong = (chap.total_wrong || 0) + result.wrong;
               chap.mistake_history = chap.mistake_history || [];
               chap.mistake_history.push(result.wrong);
               if (chap.mistake_history.length > 20) chap.mistake_history.shift();
               chap.consecutive_mastery = (result.wrong === 0) ? (chap.consecutive_mastery || 0) + 1 : 0;
           } else {
               console.error(`Chapter ${chap_num} not found in global data when submitting PDF results.`);
           }
       }

       // --- Create Exam History Record for PDF Test ---
       const pdfExamResult = {
           examId: exam.id,
           subjectId: currentSubject.id,
           timestamp: new Date().toISOString(),
           durationMinutes: null, // Duration not tracked for PDF
           type: 'pdf', // Add type field
           questions: [], // No individual question data for PDF
           score: totalAttemptedInExam - totalWrongInExam,
           totalQuestions: totalAttemptedInExam,
           resultsByChapter: chapterResults // Store the detailed breakdown
       };

       currentSubject.exam_history = currentSubject.exam_history || [];
       currentSubject.exam_history.push(pdfExamResult); // Add to history

       // Remove exam from pending list
       currentSubject.pending_exams.splice(index, 1);
       saveData(data);
       hideLoading();
       showExamsDashboard(); // Refresh dashboard

       const successMsg = `
           <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md mb-4 animate-fade-in">
               <p class="font-medium">Results for PDF exam ${exam.id} entered successfully!</p>
           </div>`;
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
        return '<p class="text-sm text-gray-500 dark:text-gray-400 mt-4">No completed test history found.</p>';
    }

    let output = '<h3 class="text-lg font-semibold mb-3 mt-6 text-green-600 dark:text-green-400">Completed Exam History</h3><div class="space-y-2">';
    completed_exams.forEach((exam, revIndex) => {
        const originalIndex = (currentSubject.exam_history || []).length - 1 - revIndex;
        if (originalIndex < 0) return;

        const percentage = exam.totalQuestions > 0 ? ((exam.score / exam.totalQuestions) * 100).toFixed(1) : 0;
        const date = new Date(exam.timestamp).toLocaleString();
        const isPdfExam = exam.type === 'pdf' || !exam.questions || exam.questions.length === 0; // Identify PDF exams

        output += `
        <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
             <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium flex items-center">
                     ${exam.examId}
                     ${isPdfExam ? '<span class="ml-2 text-xs bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200 px-1.5 py-0.5 rounded">PDF</span>' : '<span class="ml-2 text-xs bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200 px-1.5 py-0.5 rounded">Online</span>'}
                </span>
                 <span class="text-xs text-gray-500 dark:text-gray-400">${date}</span>
             </div>
             <div class="flex justify-between items-center">
                 <span class="font-semibold ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}">
                    ${exam.score} / ${exam.totalQuestions} (${percentage}%)
                 </span>
                 <div>
                      <button onclick="showExamDetails(${originalIndex})" title="View Details" class="btn-secondary-small mr-2 ${isPdfExam ? 'opacity-70' : ''}"> {/* Slightly dim PDF details button */}
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.458-4.458a1.012 1.012 0 0 1 1.414 0l4.458 4.458a1.012 1.012 0 0 1 0 .639l-4.458 4.458a1.012 1.012 0 0 1-1.414 0l-4.458-4.458Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                         Details
                    </button>
                    <button onclick="confirmDeleteCompletedExam(${originalIndex})" title="Delete History Entry" class="btn-danger-small">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                         Delete
                    </button>
                    </div>
            </div>
        </div>`;
    });
    output += '</div>';
    return output;
}

function showExamDetails(index) {
    const exam = currentSubject.exam_history[index];
    if (!exam) return;

    const percentage = exam.totalQuestions > 0 ? ((exam.score / exam.totalQuestions) * 100).toFixed(1) : 0;
    const date = new Date(exam.timestamp).toLocaleString();
    const isPdfExam = exam.type === 'pdf' || !exam.questions || exam.questions.length === 0;

    let questionsHtml = '';
    if (isPdfExam) {
        questionsHtml = '<p class="text-sm text-gray-600 dark:text-gray-400 italic p-4 text-center bg-gray-100 dark:bg-gray-700 rounded">Detailed question breakdown is not available for manually entered PDF exam results.</p>';
    } else {
        // Generate HTML for online test questions (as before)
        questionsHtml = exam.questions.map((q, i) => `
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
    }

     // Display Chapter Summary (useful for both types)
     let chapterSummaryHtml = '';
     if (exam.resultsByChapter) {
         chapterSummaryHtml = Object.entries(exam.resultsByChapter).map(([chapNum, chapRes]) => {
             const chapPercentage = chapRes.attempted > 0 ? ((chapRes.correct / chapRes.attempted) * 100).toFixed(1) : 0;
             return `
                 <li class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                     <span>Chapter ${chapNum}</span>
                     <span class="font-medium ${chapRes.wrong > 0 ? 'text-red-500' : 'text-green-500'}">
                         ${chapRes.correct} / ${chapRes.attempted} (${chapPercentage}%)
                     </span>
                 </li>`;
         }).join('');
     }


    const html = `
        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner mb-4">
             <h2 class="text-xl font-semibold mb-2 text-primary-600 dark:text-primary-400 flex items-center">
                Exam Details: ${exam.examId}
                 ${isPdfExam ? '<span class="ml-2 text-xs bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200 px-1.5 py-0.5 rounded">PDF</span>' : '<span class="ml-2 text-xs bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200 px-1.5 py-0.5 rounded">Online</span>'}
             </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${date}${exam.durationMinutes ? ` - Duration: ${exam.durationMinutes} min` : ''}</p>
            <p class="text-lg font-bold mb-4">Overall Score: ${exam.score} / ${exam.totalQuestions} (${percentage}%)</p>

            ${chapterSummaryHtml ? `
                 <h3 class="text-md font-semibold mb-2 mt-5">Chapter Performance</h3>
                 <ul class="space-y-1 mb-5">
                     ${chapterSummaryHtml}
                 </ul>
            ` : ''}


            <h3 class="text-md font-semibold mb-3 mt-5">Question Breakdown</h3>
            <div class="max-h-96 overflow-y-auto pr-2 border dark:border-gray-700 rounded bg-gray-200 dark:bg-gray-800 p-2">
                ${questionsHtml}
            </div>

            <button onclick="showExamsDashboard()" class="mt-6 w-full btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                 Back to Exams Dashboard
            </button>
        </div>
    `;
    displayContent(html);

    // Render LaTeX only if it's an online exam with questions
    if (!isPdfExam && exam.questions) {
        requestAnimationFrame(() => {
            exam.questions.forEach((q, i) => {
                const element = document.getElementById(`details-q-${i}-text`);
                renderLatexInElement(element); // Use helper
                 // Also render options if they exist in the details HTML (which they don't currently)
            });
        });
    }
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

async function generateAndDownloadPdf(htmlContent, baseFilename) {
    showLoading(`Generating ${baseFilename}...`);

    // Create a temporary, hidden element to render the HTML
    const tempElement = document.createElement('div');
    tempElement.style.position = 'fixed';
    tempElement.style.left = '-9999px'; // Position off-screen
    tempElement.style.width = '21cm'; // A4 width approx
    tempElement.innerHTML = htmlContent;
    document.body.appendChild(tempElement);

    // Render KaTeX within the temporary element
    try {
        if (window.renderMathInElement) { // Check if function exists
             renderMathInElement(tempElement, { // Just call, don't await unless it returns a Promise
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
            console.log("KaTeX rendered for PDF generation.");
        } else {
            console.warn("renderMathInElement not available for PDF generation.");
        }

    } catch (error) {
        console.error("KaTeX rendering error during PDF generation:", error);
        // Continue anyway, math might just look bad
    }

     // Allow a short time for rendering to settle (especially images and KaTeX)
     await new Promise(resolve => setTimeout(resolve, 500));


    // Configure html2pdf
    const options = { ...PDF_GENERATION_OPTIONS }; // Clone base options
    options.filename = `${baseFilename}.pdf`;

    // Generate PDF
    try {
        console.log(`Starting html2pdf generation for ${options.filename}`);
        const pdfWorker = html2pdf().set(options).from(tempElement);
        await pdfWorker.save(); // Triggers download
        console.log(`PDF generation successful for ${options.filename}`);
    } catch (error) {
        console.error(`Error generating PDF ${options.filename}:`, error);
        alert(`Failed to generate PDF: ${options.filename}. Error: ${error.message}. Please try downloading the .tex source instead.`);
    } finally {
        // Clean up the temporary element
        document.body.removeChild(tempElement);
        hideLoading();
    }
}


async function initializeApp() {
    showLoading("Initializing and loading chapters...");
    data = await loadData(); // loadData now handles fetch & parse

    if (data && data.subjects) {
        // Set the first subject as current initially, or create default if needed
        let firstSubjectId = Object.keys(data.subjects)[0];
        if (!firstSubjectId) {
            console.warn("Loaded data has no subjects. Re-initializing default.");
            data = JSON.parse(JSON.stringify(initialData));
            // Try to populate chapters for the new default subject if MD is available
            if (markdownContentCache) {
                updateChaptersFromMarkdown(data.subjects["1"], markdownContentCache);
            } else {
                 console.warn("Cannot populate initial chapters - Markdown cache empty.");
            }
            saveData(data);
            firstSubjectId = "1";
        }
        currentSubject = data.subjects[firstSubjectId];
        updateSubjectInfo();
        clearContent();
        console.log("Initialization complete. Current Subject:", currentSubject?.name);
    } else {
        console.error("Initialization failed: loadData returned invalid data.");
        displayContent('<p class="text-red-500 font-bold p-4 text-center">Application failed to initialize. Please check the console for errors and ensure the Markdown file URL is correct.</p>');
        // No subject info to update
    }
    hideLoading();

    // Set up theme toggle listener once
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && !themeToggle.dataset.listenerAttached) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            if (!document.getElementById('dashboard').classList.contains('hidden')) {
                 renderCharts(); // Re-render charts with new theme colors
            }
        });
        themeToggle.dataset.listenerAttached = 'true';
    }

    // Apply initial theme
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// --- Global Event Listeners / Startup ---
document.addEventListener('DOMContentLoaded', initializeApp);