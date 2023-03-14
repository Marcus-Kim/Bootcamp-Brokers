import { useState, useEffect } from 'react';
import { useFinanceAPI } from '../../../context/FinanceApiContext';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetBTCPrice } from '../../../store/stock';
import Triangle from './triangle-16.png';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { thunkGetNasdaq } from '../../../store/stock';
import { thunkGetSPY } from '../../../store/stock';
import { thunkGetRandomStockNews } from '../../../store/stock'
import Watchlists from '../../Watchlists/Watchlists';


export default function UserHomePage() {
  const dispatch = useDispatch()
  const [price, setPrice] = useState(5)
  const [hoverIndex, setHoverIndex] = useState(null);
  const [graph, setGraph] = useState([])
  const watchlists = useSelector(state => state.watchlist)
  const BTC = useSelector(state => state.stocks.BTCPrice)
  const SPY = useSelector(state => state.stocks.SPY) // This is not working
  const Nasdaq = useSelector(state => state.stocks.Nasdaq) // This is not working
  const randomNews = useSelector(state => state.stocks.randomStockNews)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().substring(0, 10);
  const portfolio = useSelector(state => state.portfolio)
  
  

  const handleHover = (event, active) => {
    if (active.length > 0) {
      const dataIndex = active[0].index;
      const datasetIndex = active[0].datasetIndex;
      const value = chartData.datasets[datasetIndex].data[dataIndex];
      setPrice(value);
    }
  };


  const mockData = () => {
    let data = []

    let value = 200
    for (let i = 0; i < 60 * 12; i += 15) {
      let date = new Date();
      date.setHours(4);
      date.setMinutes(0);
      value+= Math.floor(Math.random() * (10000 - 2000 + 1)) + 5000

      data.push({x: date, y: value})
    }
    setGraph(data)
  }
  
  useEffect(() => {
    mockData()
    dispatch(thunkGetBTCPrice())
    dispatch(thunkGetNasdaq())
    dispatch(thunkGetSPY())
    dispatch(thunkGetRandomStockNews())
  }, [dispatch])

  const verticalLinePlugin = {
    // After draw method is called before render and before draw. Using before will make the line appear on top of the chart
    afterDatasetsDraw: function (chart, easing, options) {
      // If there is an active point, draw the vertical line
      const activePoint = chart.tooltip._active && chart.tooltip._active[0];
      if (activePoint) {
        const x = activePoint.element.x;
        const yAxis = chart.scales.y;
  
        // Draw the vertical line
        const context = chart.ctx;
        context.beginPath();
        context.moveTo(x, yAxis.top);
        context.lineTo(x, yAxis.bottom);
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
      }
    },
  };

  const chartData = {
    labels: graph.map((data) => data.x),
    datasets:[
      {
          type: "line",
          data: graph.map((data) => data.y),
          backgroundColor: "black",
          borderColor: "#5AC53B",
          borderWidth: 2,
          pointBorderColor: 'rgb(0, 200, 0, 0)',
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
    hover: {
      intersect: false,
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
          radius: 0,
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
      callbacks: {
        beforeHover: function (chart, event, active) {
          // Get the canvas element and context
          const canvas = chart.canvas;
          const context = canvas.getContext("2d");
  
          // Clear any existing vertical line
          context.clearRect(0, 0, canvas.width, canvas.height);
  
          // If there is an active point, draw the vertical line
          if (active.length > 0) {
            const x = active[0].element.x;
            const yAxis = chart.scales.y;
  
            // Draw the vertical line
            context.beginPath();
            context.moveTo(x, yAxis.top);
            context.lineTo(x, yAxis.bottom);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();
          }
        },
      },
    },
    plugins: {
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
      },

    },
  };

  if (!BTC || !SPY) return null;

  return (
    <div className="homepage-container">
      <div className="portfolio-container">
        <div className="chart-container">
          <div className="portfolio-data-container">
            <div className="price">${price.toFixed(2)}</div>
            <div>
              <span>
                <img className="green-triangle" src={Triangle} alt="" />
              </span>
            </div>
          </div>
          <div className="line-chart-container">
            <Line
              data={chartData}
              options={chartOptions}
            />
          </div>
        </div>
        <div className="change-timeline-button">
          <span>
            <button className="profile-timeline">1D</button>
            <button className="profile-timeline">1W</button>
            <button className="profile-timeline">1M</button>
            <button className="profile-timeline">3M</button>
            <button className="profile-timeline">YTD</button>
            <button className="profile-timeline">1Y</button>
            <button className="profile-timeline">ALL</button>
          </span>
          <hr className="break"/>
        </div>
        <div className="buying-power">
          <span>Buying Power</span>
          <span>${portfolio.cash_balance}</span>
        </div>
        <hr className="break"/>
        <div className="cash-container">
          <h2 className="section-header">Cash</h2>
        </div>
        <hr className="break"/>
        <div className="news-container">
          <h2 className="section-header">News</h2>
          {randomNews?.["feed"]?.slice(0,10).map(news => (
            <div className="news-card">
              <hr />
              <div className="news-cardleft">
                <div>{news.source}</div>
                <div>{news.title}</div>
                <div>{news.ticker_sentiment[0]?.ticker}</div>
              </div>
              <NavLink to={news.url}>
                <img className="news-image" src={news.banner_image} alt="" />
              </NavLink>
            </div>
          ))}
        </div>
        <div className="indexes-container">
          <span className="indexes">
            <span>S&P 500</span>
            <span className="index-price">${SPY?.["Time Series (Daily)"]?.[yesterdayString]?.["4. close"]}</span>
          </span>
          <span className="indexes">
            <span>Nasdaq</span>
            <span className="index-price">${Nasdaq?.["Time Series (Daily)"]?.[yesterdayString]?.["4. close"]}</span>
          </span>
          <span className="indexes">
            <span>Bitcoin</span>
            <span className="index-price">${parseFloat(BTC?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"])}</span>
          </span>
        </div>
      </div>
      <div className="watchlist-container">
        <Watchlists watchlists={watchlists} />
      </div>
    </div>
  )
  
}
