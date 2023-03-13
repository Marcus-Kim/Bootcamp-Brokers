import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetStockIntraDay } from "../../../../store/stock";
import { Chart as ChartJS } from "chart.js/auto"




export default function OneDayChart({ ticker }) {

    const dispatch = useDispatch()
    const interval = "5min"
    const intraDayData = useSelector(state => state.stocks.stockIntraDay)

    useEffect(() => {
        dispatch(thunkGetStockIntraDay(ticker, interval))

    }, [dispatch, ticker])

    if (!intraDayData) return null
    if (!intraDayData["Meta Data"]) return null
    if (!intraDayData["Time Series (5min)"]) return null



    const data = {}
    const entries = Object.entries(intraDayData["Time Series (5min)"])
    // console.log("data entries: ", entries)
    entries.forEach(([time, price]) => (
        data[time] = Number(price["4. close"]).toFixed(2)
    ))

    const result = []
    for (const [key, value] of Object.entries(data)) {
        const obj = { time: key, price: parseFloat(value) };
        result.push(obj);
    }

    console.log("result: ", result)

    let chartData = ({
        labels: result.map((data) => data.time),
        datasets: [
          {
            label: "Stock Price",
            data: result.map((data) => data.price),
          },
        ],
      });

    return (
        <div>
            {/* <h3>OneDayData Component Loaded!</h3> */}
            <Line data={chartData}></Line>
            {/* <p>{ ticker }</p> */}
        </div>
    )
}
