/**
 * Utility functions for the test generator website.
 */
import { loadData, saveData, DATA_KEY } from './data.js';
import { showSubject } from './ui.js';

/**
 * Toggles between light and dark theme.
 */
export function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.dark\\:block');
        const moonIcon = themeToggle.querySelector('.block:not(.dark\\:block)');
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
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

                showSubject();
            } catch (e) {
                document.getElementById('content').innerHTML = `<p class="text-red-500">Error importing data: ${e.message}</p>`;
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

/**
 * Exits the application by resetting data and reloading the page.
 */
export function exit() {
    localStorage.removeItem(DATA_KEY);
    window.location.reload();
}

/**
 * Shows the loading overlay with a custom message.
 * @param {string} message - The message to display while loading.
 */
export function showLoading(message) {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

/**
 * Hides the loading overlay.
 */
export function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}