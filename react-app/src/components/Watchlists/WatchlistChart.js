import React from 'react';
import { Line } from 'react-chartjs-2';

function Chart({ data }) {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: [],
        data: data.values,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Line data={chartData} options={options} />
  );
}

export default Chart;
