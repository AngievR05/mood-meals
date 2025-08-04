import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

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

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    ctx.save();
    ctx.font = 'bold 22px Segoe UI, sans-serif';
    ctx.fillStyle = '#4a89dc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Mood Breakdown', width / 2, height / 2);
    ctx.restore();
  },
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
          boxWidth: 20,
          boxHeight: 20,
          padding: 20,
          font: {
            size: 16,
            weight: '600',
          },
          color: '#333',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          pointStyleWidth: 18,
          pointStyleHeight: 18,
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
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        height: '450px',
        margin: '20px auto',
        padding: '30px 40px',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible', // important for hover shadows
      }}
    >
      <div
        style={{
          flex: '1 1 60%',
          height: '100%',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
};

export default MoodRadialChart;
