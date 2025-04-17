// charts.js
import { currentSubject } from './ui.js';
import { calculateDifficulty } from './data.js';

const charts = {};

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
        const { Chart } = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.4/+esm');

        Object.values(charts).forEach(chart => chart.destroy());
        charts.attemptedChart = null;
        charts.wrongChart = null;
        charts.masteryChart = null;
        charts.difficultyChart = null;

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

        renderCharts(Chart);

        document.getElementById('back-to-subject').addEventListener('click', () => {
            import('./ui.js').then(module => module.showSubject());
        });
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        dashboard.innerHTML = `<p class="text-red-500 p-4">Failed to load dashboard: ${error.message}</p>`;
    }
}

function renderCharts(Chart) {
    const chapters = currentSubject.chapters;
    const chapterNumbers = Object.keys(chapters).sort((a, b) => parseInt(a) - parseInt(b));

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

    const wrongCtx = document.getElementById('wrongChart').getContext('2d');
    charts.wrongChart = new Chart(wrongCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Wrong Answers',
                data: chapterNumbers.map(num => chapters[num].wrong_answers || 0),
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

    const masteryCtx = document.getElementById('masteryChart').getContext('2d');
    charts.masteryChart = new Chart(masteryCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Consecutive Mastery',
                data: chapterNumbers.map(num => chapters[num].correct_streak || 0),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });

    const difficultyCtx = document.getElementById('difficultyChart').getContext('2d');
    charts.difficultyChart = new Chart(difficultyCtx, {
        type: 'bar',
        data: {
            labels: chapterNumbers.map(num => `Ch. ${num}`),
            datasets: [{
                label: 'Chapter Difficulty',
                data: chapterNumbers.map(num => calculateDifficulty(chapters[num])),
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 1 } }
        }
    });
}