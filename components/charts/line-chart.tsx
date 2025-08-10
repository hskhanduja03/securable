"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#374151',
      bodyColor: '#6b7280',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 12,
        },
        callback: function(value: any) {
          return value + 'k';
        },
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      backgroundColor: '#ffffff',
      borderWidth: 2,
      hoverRadius: 6,
    },
    line: {
      tension: 0.4,
    },
  },
  interaction: {
    intersect: false,
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const data = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [23.5, 47, 35, 42, 55, 68, 72, 78, 85, 88, 92, 94],
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
    },
    {
      label: 'Expenses',
      data: [18, 25, 30, 35, 42, 48, 52, 55, 58, 62, 65, 70],
      borderColor: '#6b7280',
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      fill: true,
    },
  ],
};

export function LineChart() {
  return (
    <div className="h-[300px] w-full">
      <Line options={options} data={data} />
    </div>
  );
}