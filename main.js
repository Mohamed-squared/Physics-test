// main.js
import { initUI, generateTest, showAddChapters, showEnterResults, showDeleteExam, showManageSubjects, showSubject } from './ui.js';
import { toggleTheme, exportData, importData, exit } from './utils.js';

// Initialize UI
initUI();

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    toggleTheme(); // Update icon
}

// Add event listeners for all main menu buttons
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('generate-test').addEventListener('click', generateTest);
document.getElementById('show-enter-results').addEventListener('click', showEnterResults);
document.getElementById('show-add-chapters').addEventListener('click', showAddChapters);
document.getElementById('show-delete-exam').addEventListener('click', showDeleteExam);
document.getElementById('show-manage-subjects').addEventListener('click', showManageSubjects);
document.getElementById('show-progress-dashboard').addEventListener('click', () => {
    import('./charts.js').then(module => module.showProgressDashboard());
});
document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('import-data').addEventListener('click', importData);
document.getElementById('exit').addEventListener('click', exit);

// Show initial subject view
showSubject();