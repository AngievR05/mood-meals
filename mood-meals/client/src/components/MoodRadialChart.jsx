import * as API from "../api";
import React, { useEffect, useState } from 'react';
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

const MoodRadialChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllMoods = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/moods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch mood data');
        const data = await res.json(); 

        const counts = data.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(counts);
        const values = Object.values(counts);
        const backgroundColors = labels.map(l => moodColors[l] || '#ccc');

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
              borderWidth: 3,
              borderColor: '#fff',
              hoverOffset: 30,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
        setChartData({ labels: [], datasets: [] });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllMoods();
  }, [token]);

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
          padding: 24,
          font: { size: 16, weight: '500' },
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
    <div className="mood-radial-chart-container card">
      <h2>All-Time Mood Overview</h2>
      {loading && <p>Loading chart...</p>}
      {error && <p className="auth-error">{error}</p>}
      {!loading && !error && chartData.labels.length > 0 && (
        <div className="mood-chart-wrapper">
          <Doughnut data={chartData} options={options} />
        </div>
      )}
      {!loading && !error && chartData.labels.length === 0 && <p>No moods logged yet.</p>}
    </div>
  );
};

export default MoodRadialChart;
