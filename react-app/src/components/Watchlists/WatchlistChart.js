import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetStockIntraDay } from "../../store/stock";
import "./watchlistsHome.css";

export default function WatchlistChart({ ticker }) {
  const dispatch = useDispatch();
  const interval = "5min";
  const [chartData, setChartData] = useState(null); // Add this line to create a separate state for each chart component

  useEffect(() => {
    (async () => {
      const fetchedData = await dispatch(thunkGetStockIntraDay(ticker, interval));
      if (fetchedData) {
        const rawData = {};
        const entries = Object.entries(fetchedData["Time Series (5min)"]);
        entries.forEach(([time, price]) => {
          rawData[time] = Number(price["4. close"]).toFixed(2);
        });

        const result = [];
        for (const [key, value] of Object.entries(rawData)) {
          const obj = { time: key, price: parseFloat(value) };
          result.push(obj);
        }

        const chartData = {
          labels: result.map((data) => data.time),
          datasets: [
            {
              label: "Stock Price",
              data: result.map((data) => data.price),
              borderColor: "#5AC53B",
              borderWidth: 2,
              pointBorderColor: "rgb(0, 200, 0, 0)",
              pointBackgroundColor: "rgba(0, 0, 0, 0)",
              pointHoverBackgroundColor: "#5AC53B",
              pointHoverBorderColor: "#000000",
              pointHoverBorderWidth: 4,
              pointHoverRadius: 6,
            },
          ],
          options: {
            scales: {
              x: {
                display: false,
                reverse: true,
              },
              y: {
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            interaction: {
              intersect: false,
            },
          },
        };
        setChartData(chartData); // Update chartData state with the fetched data
      }
    })();
  }, [dispatch, ticker]);

  if (!chartData) return null;

  return (
    <div className="watchlist-graph-home">
      <Line data={chartData} options={chartData.options}></Line>
    </div>
  );
}
