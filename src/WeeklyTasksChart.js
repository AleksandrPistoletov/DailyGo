import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement, 
} from 'chart.js';

ChartJS.register(LineElement, Tooltip, CategoryScale, LinearScale, PointElement);

const WeeklyTasksChart = ({ tasks }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const today = new Date();
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return date.toISOString().split('T')[0];
        });

        const taskCounts = nextSevenDays.map(day =>
            tasks.filter(task => task.calculation_date && task.calculation_date.startsWith(day)).length
        );

        setChartData({
            labels: daysOfWeek.slice(today.getDay()).concat(daysOfWeek.slice(0, today.getDay())),
            datasets: [
                {
                    data: taskCounts,
                    borderColor: '#4CAF50',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
            ],
        });
    }, [tasks]);

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Tasks: ${context.raw}`,
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return (
        <div className="weekly-tasks-chart">
            <Line data={chartData} options={options} />
            {/*<div className="tooltip">Hover over points to see tasks count for each day</div>*/}
        </div>
    );
};

export default WeeklyTasksChart;
