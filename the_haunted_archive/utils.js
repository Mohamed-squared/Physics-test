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
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', !isDark);
        moonIcon.classList.toggle('hidden', isDark);
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
                if (!importedData.subjects || typeof importedData.subjects !== 'object' || Object.keys(importedData.subjects).length === 0) {
                    throw new Error('Invalid data format: subjects missing or empty');
                }
                saveData(importedData);
                showSubject(); // Ensure this updates the UI
            } catch (e) {
                console.error('Import error:', e);
                const content = document.getElementById('content');
                if (content) {
                    content.innerHTML = `<p class="text-red-500">Failed to import data. Please ensure the file is a valid JSON with subjects.</p>`;
                }
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