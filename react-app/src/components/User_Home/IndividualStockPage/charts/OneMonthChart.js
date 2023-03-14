import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetOneMonthStockData } from "../../../../store/stock";
import { Chart as ChartJS } from "chart.js/auto"

export default function OneMonthChart({ ticker }) {

    const dispatch = useDispatch();

    const monthlyData = useSelector(state => state.stocks.oneMonthChartData)
    console.log("monthlyData: ", monthlyData)

    useEffect(() => {
        dispatch(thunkGetOneMonthStockData(ticker))
    }, [dispatch, ticker])

    if (!monthlyData) return null
    if (!monthlyData["Meta Data"]) return null
    if (!monthlyData["Time Series (60min)"]) return null

    const rawData = {}
    const entries = Object.entries(monthlyData["Time Series (60min)"])

    entries.forEach(([date, price]) => (
        rawData[date] = Number(price["4. close"]).toFixed(2)
    ))
    console.log("month entries: ", entries)

    const result = [];
    for (const [key, value] of Object.entries(rawData)) {
        const obj = { date: key, price: parseFloat(value) }
        result.push(obj)
    }
    const slicedResult = result.slice(0, 319)

    let chartData = ({
        labels: result.map((data) => data.date),
        datasets: [{
            label: "Stock Price",
            data: result.map((data) => data.price),
            // backgroundColor: "black",
            borderColor: "#5AC53B",
            borderWidth: 2,
            pointBorderColor: 'rgb(0, 200, 0, 0)',
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointHoverBackgroundColor: '#5AC53B',
            pointHoverBorderColor: '#000000',
            pointHoverBorderWidth: 4,
            pointHoverRadius: 6,
        }],
        options:{
            scales:{
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
          },
    });

    return (
        <div>
            <h2>One Month Chart Component</h2>
            <Line data={chartData} options={chartData.options} ></Line>
        </div>
    )
}
