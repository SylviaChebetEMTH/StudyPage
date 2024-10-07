// AdminChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register components
Chart.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

const AdminChart = ({ usersCount, servicesCount, expertsCount, projectTypesCount, subjectsCount }) => {
    const data = {
        labels: ['Users', 'Services', 'Experts', 'Project Types', 'Subjects'],
        datasets: [
            {
                label: 'Counts',
                data: [usersCount, servicesCount, expertsCount, projectTypesCount, subjectsCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                type: 'category', 
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default AdminChart;
