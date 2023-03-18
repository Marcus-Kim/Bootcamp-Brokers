import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Triangle from './triangle-16.png';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Watchlists from '../../Watchlists/Watchlists';
import News from './NewsComponent/News';

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
  const [depositDivOpen, setDepositDivOpen] = useState(false);
  
  useEffect(() => {
    displayDailyView()
  },[])

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

  return (
  
<div className="homepage-container">
<div className="portfolio-container">
<div className="chart-container">
  <div className="portfolio-data-container">
    <div className="price price-transition">${price}</div>
    <div className="profit-loss profit-loss-transition">
      <span className="underprice-container">
        {profitLoss > 0 ? <img className="green-triangle" src={Triangle} alt="" /> : <div style={{fontSize: '11.5px'}}>🔻</div>}
        
        <span className={profitLoss > 0 ? "profit" : "loss"}>${Math.abs(Number(parseFloat(profitLoss)).toFixed(2))} </span>
        <span className={profitLoss > 0 ? "profit" : "loss"}>{timeFrame}</span>
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
  <div className="cash-header-section">
    <div className="cash-and-deposit">
      <h2 className="section-header">Cash</h2>
      <button 
        className="deposit-button"
        onClick={() => setDepositDivOpen(prev => !prev)}
      >
        Deposit cash
      </button>
    </div>
    <div className={"deposit-container" + (depositDivOpen ? '' : ' hidden')}>
      <button>+$100</button>
      <button>+$1,000</button>
      <button>+$10,000</button>
      <button>+$100,000</button>
      <button>+$1,000,000</button>
    </div>
  </div>
  <hr className="break"/>
  <div className="earn-interest">
    <span className="diamond">⟡</span>
    <span className="cash">Earn 4.15% on your uninvested cash. No cap. Terms apply.</span>
  </div>
</div>
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
  <News newsObject={randomNews} numArticlesDisplayed={30} />
</div>
<div>
<p className="disclaimer-container">
        DISCLAIMER: The information provided on the Bootcamp Brokers website is intended for general information and educational purposes only. It is not intended as financial or investment advice and should not be construed or relied on as such. Before making any investment decisions, you should seek advice from an independent financial advisor who can take into account your individual circumstances and investment objectives.

        While we make every effort to ensure that the information provided on this website is accurate and up-to-date, we cannot guarantee its accuracy, completeness, or timeliness. We do not accept any liability for any loss or damage caused by reliance on the information provided on this website.

        The past performance of any investment or trading strategy is not necessarily indicative of future results. You should be aware of the risks involved in trading or investing and carefully consider whether such trading or investing is suitable for you in light of your financial condition and investment objectives.

        Bootcamp Brokers is not responsible for the content of external websites linked to from this website. But we are responsible for all of your profits.
        </p>
</div>
</div>
<div className="watchlist-container">
<Watchlists watchlists={watchlists} />
</div>
</div>

  )

}
