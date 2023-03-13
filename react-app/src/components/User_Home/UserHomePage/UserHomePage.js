import { useState, useEffect } from 'react';
import { useFinanceAPI } from '../../../context/FinanceApiContext';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetBTCPrice } from '../../../store/stock';
import { thunkGetStockIntraDay } from '../../../store/stock';
import { thunkGetStockDaily } from '../../../store/stock';
import Triangle from './triangle-16.png';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';



export default function UserHomePage() {
  const [price, setPrice] = useState(5)
  const [hoverIndex, setHoverIndex] = useState(null);
  const [graph, setGraph] = useState([])
  const BTC = useSelector(state => state.stocks.BTCPrice)
  const SPY = useSelector(state => state.stocks.stockDaily)
  const today = new Date().toISOString().substring(0, 10)




  const mockData = () => {
    let data = []

    let value = 10000
    for (let i = 0; i < 60 * 12; i += 15) {
      let date = new Date();
      date.setHours(4);
      date.setMinutes(0);
      value+= Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000

      data.push({x: date, y: value})
    }
    setGraph(data)
  }
  
  useEffect(() => {
    mockData()
  }, [])


  const chartData = {
    labels: graph.map((data) => data.x),
    datasets:[
      {
          type: "line",
          data: graph.map((data) => data.y),
          backgroundColor: "black",
          borderColor: "#5AC53B",
          borderWidth: 2,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#5AC53B',
          pointHoverBorderColor: '#000000',
          pointHoverBorderWidth: 4,
          pointHoverRadius: 6
      }
    ]
  }


  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
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
      onHover: (event, chartElement) => {
        if (chartElement.length > 0) {
          setPrice(chartElement[0].parsed.y);
        } else {
          setPrice(5);
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },

    },
  };

  if (!BTC || !SPY) return null;

  return (
    <div className="homepage-container">
      <div className="chart-container">
        <div className="portfolio-data-container">
        <div className="price">${price.toFixed(2)}</div>
          <div>
            <span>
              <img className="green-triangle" src={Triangle} alt="" />
            </span>
            </div> 
        </div>
        <Line
        data={chartData}
        options={chartOptions}
        />

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
