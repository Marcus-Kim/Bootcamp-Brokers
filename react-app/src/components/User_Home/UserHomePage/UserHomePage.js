import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useFinanceAPI } from '../../../context/FinanceApiContext';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetBTCPrice } from '../../../store/stock';
import { thunkGetStockIntraDay } from '../../../store/stock';
import { thunkGetStockDaily } from '../../../store/stock';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserHomePage() {
  const [graphData, setGraphData] = useState([])
  const chartRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null)
  const [verticalLinePos, setVerticalLinePos] = useState(null)
  const dispatch = useDispatch()
  const BTC = useSelector(state => state.stocks.BTCPrice)
  const SPY = useSelector(state => state.stocks.stockDaily)
  const today = new Date().toISOString().substring(0, 10)

  const now = new Date();
  const labels = []
  const data = []

  // Starts with 4:00 AM


  now.setHours(4);
  now.setMinutes(0);

  for (let i = 0; i < 60 * 12; i += 15) {
    const time = new Date(now.getTime() + i * 60 * 1000); // Add 5 minutes to each label
    labels.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    data.push(Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000); // generate random data for each interval
  }

  

  const chartData = {
    labels: labels,
    datasets: [
      // {
      //   label: "Hover Dot",
      //   data: data,
      //   pointBackgroundColor: 'white',
      //   // pointRadius: 8,
      //   // pointHoverRadius: 6,
      //   // pointBorderWidth: 2,
      //   // pointBorderColor: 'rgba(75,192,192,1)',
      //   // pointBackgroundColor: 'green',
      //   tension: 0.1,
      //   showLine: true,
      // },
      {
        type: "line",
        data: data,
        backgroundColor: "green",
        borderColor: "#5AC53B",
        borderWidth: 2,
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'green',
        pointHoverBorderColor: 'green',
        pointHoverBorderWidth: 4,
        pointHoverRadius: 6
      },
      {
        pointStyle: "line",
        data: data,
      }
    ]
  }

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        borderWidth: 2,
        borderColor: 'white',
        fill: false
      }
    },
    tooltips: {
      mode: "index",
      intersect: false
    },
    datasets: {
      point: {
        radius: 0
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#white' // set the default color of gridlines
        },
        ticks: {
          color: 'white', // set the color of tick labels
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: 'white', // set the color of tick labels
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: "nearest",
      axis: "x",
      onHover: (event, chartElements) => {
        if (chartElements.length) {
          const { x, y } = chartElements[0].element;
          const chartInstance = chartRef.current.chartInstance;
          const activePoint = chartInstance.getElementAtEvent(event);
          const dataIndex = activePoint[0].index;
          setHoverIndex(dataIndex);
          setVerticalLinePos(x);
        } else {
          setHoverIndex(null);
          setVerticalLinePos(null);
        }
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        custom: function (tooltipModel) {
          if (tooltipModel.body && tooltipModel.body.length) {
            const label = tooltipModel.dataPoints[0].label;
            tooltipModel.title = label;
          }
        }
      },
      legend: {
        display: false
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      // onResize: (chart, size) => {
      //   chart.options.scales.x.grid.color = hoverIndex !== null ? 'white' : '#707070';
      //   chart.update();
      // }
      
    }
  };


  // useEffect(() => {
  //   dispatch(thunkGetBTCPrice())
  //   dispatch(thunkGetStockDaily('SPY'))
    
  // }, [dispatch])

  if (!BTC) return null
  if (!SPY) return null

  return (
    <div className="homepage-container">
      <div className="chart-container">
        <Line
        data={chartData}
        options={chartOptions}
        />
        {verticalLinePos !== null && (
          <div className="chart-vertical-line" style={{ left: `${verticalLinePos}px` }}></div>
        )}
      </div>
      <div className="change-timeline-button">
        <span>
          <button>1D</button>
          <button>1W</button>
          <button>1M</button>
          <button>3M</button>
          <button>YTD</button>
          <button>1Y</button>
          <button>ALL</button>
        </span>
      </div>

      <div className="watchlist-container"></div>
      <div className="indexes-container">
        <span>S&P 500 {SPY?.["Time Series (Daily)"]?.[today]?.["4. close"]}</span>
        <span>Nasdaq</span>
        <span>Bitcoin {parseFloat(BTC?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"])}</span>

      </div>

      <div className="news-container"></div>
    </div>
  )
}
