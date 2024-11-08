import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const BarChart = ({ completedTasks, overdueTasks }) => {
    const data = {
        labels: ['Completed', 'Overdue'],
        datasets: [
            {
                data: [completedTasks, overdueTasks],
                backgroundColor: ['#4CAF50', '#FF5252'],
                borderRadius: 5,
                barThickness: 50,
            },
        ],
    };

    const options = {
        indexAxis: 'x',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => tooltipItem.dataset.label,
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return (
        <div className="bar-chart-container">
            <Bar data={data} options={options} />
            <div className="tooltip">Green: Completed | Red: Overdue</div>
        </div>
    );
};

export default BarChart;
