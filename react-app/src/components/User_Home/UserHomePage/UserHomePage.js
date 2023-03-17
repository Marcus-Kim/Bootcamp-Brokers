import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Triangle from './triangle-16.png';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Watchlists from '../../Watchlists/Watchlists';


export default function UserHomePage() {
  const portfolio = useSelector(state => state.portfolio)
  const dispatch = useDispatch()
  const [price, setPrice] = useState(parseFloat(portfolio.overall_value))
  const [graph, setGraph] = useState([])
  const [profitLoss, setProfitLoss] = useState("0")
  const watchlists = useSelector(state => state.watchlist)
  const userId = useSelector(state => state.session.user?.id)
  const BTC = useSelector(state => state.stocks.BTCPrice)
  const SPY = useSelector(state => state.stocks.SPY) // This is not working
  const Nasdaq = useSelector(state => state.stocks.Nasdaq) // This is not working
  const randomNews = useSelector(state => state.stocks.randomStockNews)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().substring(0, 10);
  const historicalValues = portfolio.historicalValues
  const [timeFrame, setTimeFrame] = useState("1D")



  const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw: (chart, args, options) => {
      if (!chart.tooltip._active || !chart.tooltip._active.length) {
        return;
      }

      const active = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = active.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.restore();
    },
  };

  Chart.register(verticalLinePlugin);


  const handleHover = (event, active, chart) => {
    if (active.length > 0) {
      const dataIndex = active[0].index;
      const datasetIndex = active[0].datasetIndex;
      const value = chart.data.datasets[datasetIndex].data[dataIndex];
      const firstValue = chart.data.datasets[datasetIndex].data[0];
      const profitLossValue = value - firstValue;
      setPrice(value);
      setProfitLoss(profitLossValue);
    }
  };


  // Change data displayed on chart
  const displayDailyView = () => {
    console.log('HISTORICAL VALUES', historicalValues)
    setTimeFrame("1D")
    setGraph(historicalValues.slice(-300, historicalValues.length))
  }

  const displayWeeklyView = () => {
    setTimeFrame("1W")
    setGraph(historicalValues.slice(-450, historicalValues.length))
  }

  const displayMonthlyView = () => {
    setTimeFrame("1M")
    setGraph(historicalValues.slice(-600, historicalValues.length))
  }

  const displayThreeMonthView = () => {
    setTimeFrame("3M")
    setGraph(historicalValues.slice(-900, historicalValues.length))
  }

  const displayYTDView = () => {
    setTimeFrame("YTD")
    setGraph(historicalValues.slice(-1200, historicalValues.length))
  }

  const displayYearlyView = () => {
    setTimeFrame("1Y")
    setGraph(historicalValues.slice(-1500, historicalValues.length))
  }

  const displayAllView = () => {
    setTimeFrame("All")
    setGraph(historicalValues.slice(-2000, historicalValues.length))
  }

  useEffect(() => {
    displayDailyView()
  },[])
 

  if (!portfolio) return null
  if (!historicalValues.length) return null

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
          display: false,
          callback: function(value, index, values) {
            if (index === 0) {
              const profitLossValue = value - 10; // Replace 10 with the desired value to subtract
              setProfitLoss(profitLossValue);
            }
            return value - 10; // Replace 10 with the desired value to subtract
          }
        },
        beforeCalculateTickRotation: (scale) => {
          const labels = scale.ticks.map((tick) => tick.value - 10); // Replace 10 with the desired value to subtract
          scale.ticks.splice(0, scale.ticks.length, ...labels);
        }
      }
    },
    interaction: {
      intersect: false,
    },
    onHover: (event, activeElements, chart) => {
      handleHover(event, activeElements, chart);
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        axis: 'x',
        intersect: false,
        position: 'nearest',
        callbacks: {
          title: function () {
            // Return an empty string to remove the title from the tooltip
            return '';
          },
          label: function (context) {
            // Get the corresponding x value (time) from the context
            const timeValue = context.chart.data.labels[context.dataIndex];

            // Return the timeValue directly
            return `${timeValue}`;
          },
        },
      },
    },
  };
  if (!BTC || !SPY) return null;

  // Convert timestamp from Stock News API into 'hours' ago format
  const hoursAgo = (timestamp) => {
    const year = parseInt(timestamp.slice(0, 4), 10);
    const month = parseInt(timestamp.slice(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
    const day = parseInt(timestamp.slice(6, 8), 10);
    const hours = parseInt(timestamp.slice(9, 11), 10);
    const minutes = parseInt(timestamp.slice(11, 13), 10);

    const articleDate = new Date(year, month, day, hours, minutes);
    const currentDate = new Date();

    const msDifference = currentDate - articleDate;
    const hoursDifference = msDifference / (1000 * 60 * 60);

    return Math.ceil(hoursDifference) * -1;
  }


  return (
  
<div className="homepage-container">
<div className="portfolio-container">
<div className="chart-container">
  <div className="portfolio-data-container">
    <div className="price">${price}</div>
    <div>
      <span className="underprice-container">
        {profitLoss > 0 ? <img className="green-triangle" src={Triangle} alt="" /> : <div>🔻</div>}
        
        <span style={{marginLeft: '10px'}}>${Number(parseFloat(profitLoss)).toFixed(2)} </span>
        <span style={{marginLeft: '15px'}}>{timeFrame}</span>
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
    <button
      className="profile-timeline"
      onClick={displayDailyView}
    >
      1D
    </button>
    <button
      className="profile-timeline"
      onClick={displayWeeklyView}
    >
      1W
    </button>
    <button
      className="profile-timeline"
      onClick={displayMonthlyView}
    >
      1M
    </button>
    <button
      className="profile-timeline"
      onClick={displayThreeMonthView}
    >
      3M
    </button>
    <button
      className="profile-timeline"
      onClick={displayYTDView}>
      YTD
    </button>
    <button
      className="profile-timeline"
      onClick={displayYearlyView}
    >
      1Y
    </button>
    <button
      className="profile-timeline"
      onClick={displayAllView}
    >
      ALL
    </button>
  </span>
  <hr className="break"/>
</div>
<div className="buying-power">
  <span>Buying Power</span>
  <span>${portfolio?.cash_balance}</span>
</div>
<hr className="break"/>
<div className="cash-container">
  <h2 className="section-header">Cash</h2>
</div>
<hr className="break"/>
<div className="news-container">
  <h2 className="section-header">News</h2>
  <hr className="break"/>
  <div className="indexes-container">
    <div className="index-and-price">
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
  {randomNews?.["feed"]?.slice(0, 30).map((news) => (
    <div className="news-carders" key={news.url}>
      <hr className="break" />
      <div className="news-card">
        <div className="news-cardleft">
          <div>
            <span className="source">{news.source}</span>{" "}
            <span className="time-units">{hoursAgo(news.time_published)}hr</span>
          </div>
          <div className="title">{news.title}</div>
          <div className="story-ticker">
            {news.ticker_sentiment[0]?.ticker}
          </div>
        </div>
        <a href={news.url} target="_blank" rel="noopener noreferrer">
          <img className="news-image" src={news.banner_image} alt="" />
        </a>
      </div>
    </div>
  ))}
</div>
</div>
<div className="watchlist-container">
<Watchlists watchlists={watchlists} />
</div>
</div>

  )

}
