import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/MoodRadialChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const moodColors = {
  Happy: '#A0D468',
  Sad: '#5D9CEC',
  Angry: '#ED5565',
  Stressed: '#48CFAD',
  Bored: '#CCD1D9',
  Energised: '#FFCE54',
  Confused: '#FC6E51',
  Grateful: '#AC92EC',
};

const MoodRadialChart = ({ data }) => {
  const labels = data.map(d => d.mood);
  const counts = data.map(d => d.count);
  const backgroundColors = data.map(d => moodColors[d.mood] || '#ccc');

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 18,
          padding: 16,
          font: {
            size: 15,
            weight: '500',
          },
          color: '#333',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleFont: { size: 16, weight: '700' },
        bodyFont: { size: 14 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: context => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="mood-chart-container">
      <div className="mood-chart">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MoodRadialChart;
