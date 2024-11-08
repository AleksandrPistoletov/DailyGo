import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <p>No data</p>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                data: data.values,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (tooltipItem) => {
                        const label = chartData.labels[tooltipItem.dataIndex] || "No project";
                        const value = chartData.datasets[0].data[tooltipItem.dataIndex];
                        return `${label}: ${value}`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;
