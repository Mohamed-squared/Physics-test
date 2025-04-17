/**
 * Chart rendering for the test generator's progress dashboard using Chart.js.
 */
import { currentSubject } from './ui.js';
import { calculateDifficulty } from './data.js';

// Global charts object to manage Chart.js instances
const charts = {};

/**
 * Shows the progress dashboard with charts for the current subject.
 */
export async function showProgressDashboard() {
    const menu = document.getElementById('menu');
    const dashboard = document.getElementById('dashboard');

    if (!menu || !dashboard) {
        console.error("Required DOM elements 'menu' or 'dashboard' not found.");
        return;
    }

    menu.classList.add('hidden');
    dashboard.classList.remove('hidden');

    if (!currentSubject || !currentSubject.chapters || Object.keys(currentSubject.chapters).length === 0) {
        dashboard.innerHTML = '<p class="text-red-500 p-4">No chapters available to display in dashboard. Please add chapters first.</p>';
        return;
    }

    try {
        // Load Chart.js dynamically
        const { Chart } = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.4/+esm');

        // Clear existing charts
        Object.values(charts).forEach(chart => chart.destroy());
        charts.attemptedChart = null;
        charts.wrongChart = null;
        charts.masteryChart = null;
        charts.difficultyChart = null;

        // Render dashboard with correct canvas IDs
        dashboard.innerHTML = `
            <div class="p-4">
                <h2 class="text-2xl font-bold mb-4 dark:text-white">Progress Dashboard: ${currentSubject.name}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white">Questions Attempted</h3>
                        <canvas id="attemptedChart" class="chart-container"></canvas>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white">Wrong Answers</h3>
                        <canvas id="wrongChart" class="chart-container"></canvas>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white">Consecutive Mastery</h3>
                        <canvas id="masteryChart" class="chart-container"></canvas>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white">Chapter Difficulty</h3>
                        <canvas id="difficultyChart" class="chart-container"></canvas>
                    </div>
                </div>
                <button id="back-to-subject" class="btn-primary mt-4">Back to Subject</button>
            </div>
        `;

        // Verify canvas elements exist
        const canvases = ['attemptedChart', 'wrongChart', 'masteryChart', 'difficultyChart'];
        for (const id of canvases) {
            if (!document.getElementById(id)) {
                throw new Error(`Canvas element with ID '${id}' not found.`);
            }
        }

        // Render charts
        renderCharts(Chart);

        // Attach event listener for back button
        document.getElementById('back-to-subject').addEventListener('click', () => {
            import('./ui.js').then(module => module.showSubject());
        });
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        dashboard.innerHTML = `<p class="text-red-500 p-4">Failed to load dashboard: ${error.message}</p>`;
    }
}

/**
 * Renders the charts for the dashboard.
 * @param {Object} Chart - Chart.js constructor.
 */
function renderCharts(Chart) {
    const chapters = currentSubject.chapters;
    const chapterNumbers = Object.keys(chapters).sort((a, b) => parseInt(a) - parseInt(b));

    // Total Questions Attempted
    const attemptedCtx = document.getElementById('attemptedChart').getContext('2d');
    charts.attemptedChart = new Chart(attemptedCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Questions Attempted',
                data: chapterNumbers.map(num => chapters[num].total_attempted || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });

    // Total Wrong Answers
    const wrongCtx = document.getElementById('wrongChart').getContext('2d');
    charts.wrongChart = new Chart(wrongCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Wrong Answers',
                data: chapterNumbers.map(num => chapters[num].total_wrong || 0),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });

    // Consecutive Mastery
    const masteryCtx = document.getElementById('masteryChart').getContext('2d');
    charts.masteryChart = new Chart(masteryCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Consecutive Mastery',
                data: chapterNumbers.map(num => chapters[num].consecutive_mastery || 0),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });

    // Chapter Difficulty
    const difficultyCtx = document.getElementById('difficultyChart').getContext('2d');
    charts.difficultyChart = new Chart(difficultyCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Difficulty Score',
                data: chapterNumbers.map(num => calculateDifficulty(chapters[num]) || 0),
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}