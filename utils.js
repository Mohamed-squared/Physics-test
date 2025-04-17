/**
 * Utility functions for the test generator website.
 */
import { loadData, saveData, DATA_KEY } from './data.js';
import { showSubject } from './ui.js';

/**
 * Shows the loading overlay.
 */
export function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

/**
 * Hides the loading overlay.
 */
export function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

/**
 * Exports the current data as a JSON file.
 */
export function exportData() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_generator_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Imports data from a JSON file.
 */
export function importData() {
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
                if (!importedData.subjects || typeof importedData.subjects !== 'object') {
                    throw new Error('Invalid data format');
                }
                saveData(importedData);
                // Trigger UI refresh (to be handled in main.js or ui.js)
                document.getElementById('content').innerHTML = '<p class="text-green-500">Data imported successfully!</p>';
                setTimeout(() => {
                    showSubject();
                }, 1000);
            } catch (e) {
                document.getElementById('content').innerHTML = `<p class="text-red-500">Error importing data: ${e.message}</p>`;
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

/**
 * Exits the application (resets to initial view).
 */
export function exit() {
    localStorage.removeItem(DATA_KEY);
    window.location.reload();
}

/**
 * Toggles between light and dark theme.
 */
export function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    icon.innerHTML = isDark ? 
        `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>` : 
        `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
}