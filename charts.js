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
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    if (Object.keys(currentSubject.chapters).length === 0) {
        document.getElementById('dashboard').innerHTML = '<p class="text-red-500">No chapters available to display in dashboard.</p>';
        return;
    }

    // Load Chart.js dynamically to reduce initial load time
    const { Chart } = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.4/+esm');
    
    // Clear existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    
    // Render dashboard
    document.getElementById('dashboard').innerHTML = `
        <div class="p-4">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Progress Dashboard: ${currentSubject.name}</h2>
            <div class="mb-8">
                <h3 class="text-lg font-semibold mb-2 dark:text-white">Wrong Answers per Chapter</h3>
                <canvas id="wrongAnswersChart" class="chart-container"></canvas>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-2 dark:text-white">Mistake History Trends</h3>
                <canvas id="mistakeHistoryChart" class="chart-container"></canvas>
            </div>
            <button onclick="showSubject()" class="btn-primary mt-4">Back to Subject</button>
        </div>
    `;
    
    renderCharts(Chart);
}

/**
 * Renders the wrong answers and mistake history charts.
 * @param {Object} Chart - Chart.js constructor.
 */
function renderCharts(Chart) {
    const wrongCtx = document.getElementById('wrongAnswersChart').getContext('2d');
    const historyCtx = document.getElementById('mistakeHistoryChart').getContext('2d');
    
    // Wrong Answers Bar Chart
    const labels = Object.keys(currentSubject.chapters).map(chapNum => `Ch. ${chapNum}`);
    const wrongData = Object.values(currentSubject.chapters).map(chap => chap.total_wrong);
    const difficultyData = Object.values(currentSubject.chapters).map(chap => calculateDifficulty(chap));
    
    charts.wrongAnswersChart = new Chart(wrongCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Wrong Answers',
                    data: wrongData,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)', // Tailwind red-500
                    borderColor: '#EF4444',
                    borderWidth: 1
                },
                {
                    label: 'Difficulty Score',
                    data: difficultyData,
                    type: 'line',
                    borderColor: '#3B82F6', // Tailwind primary-500
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Wrong Answers' }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Difficulty Score' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
    
    // Mistake History Line Chart
    const maxHistoryLength = Math.max(...Object.values(currentSubject.chapters).map(chap => chap.mistake_history.length));
    const timestamps = Array.from({length: maxHistoryLength}, (_, i) => `Test ${i + 1}`);
    
    charts.mistakeHistoryChart = new Chart(historyCtx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: Object.entries(currentSubject.chapters).map(([chapNum, chap], i) => ({
                label: `Ch. ${chapNum} Wrong`,
                data: chap.mistake_history,
                borderColor: `hsl(${i * 30}, 70%, 50%)`,
                backgroundColor: `hsla(${i * 30}, 70%, 50%, 0.2)`,
                fill: false
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Wrong Answers' },
                    ticks: { precision: 0 }
                }
            }
        }
    });
}