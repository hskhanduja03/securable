"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Shopping', 'Transport', 'Food', 'Entertainment', 'Others'],
  datasets: [
    {
      data: [35, 20, 25, 15, 5],
      backgroundColor: [
        '#f97316',
        '#fb923c',
        '#0ea5e9',
        '#06b6d4',
        '#374151',
      ],
      borderWidth: 0,
      cutout: '70%',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
        color: '#374151',
      },
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#374151',
      bodyColor: '#6b7280',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function(context: any) {
          return `${context.label}: ${context.parsed}%`;
        },
      },
    },
  },
};

export function DoughnutChart() {
  return (
    <div className="h-[250px] w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
}