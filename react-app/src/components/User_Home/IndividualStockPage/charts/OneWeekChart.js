import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetOneWeekStockData } from "../../../../store/stock";
import { Chart as ChartJS } from "chart.js/auto"


export default function OneWeekChart({ ticker }) {

    const dispatch = useDispatch()

    const weeklyData = useSelector(state => state.stocks.oneWeekChartData)

    useEffect(() => {
        dispatch(thunkGetOneWeekStockData(ticker))

    }, [dispatch, ticker])

    if (!weeklyData) return null
    if (!weeklyData["Meta Data"]) return null
    if (!weeklyData["Time Series (15min)"]) return null

    const rawData = {}
    const entries = Object.entries(weeklyData["Time Series (15min)"])


    entries.forEach(([date, price]) => (
        rawData[date] = Number(price["4. close"]).toFixed(2)
    ))
    // console.log("rawData: ", rawData)

    const result = []
    for (const [key, value] of Object.entries(rawData)) {
        const obj = { date: key, price: parseFloat(value) };
        result.push(obj)
    }


    const slicedResult = result.slice(0, 377);
    // console.log("sliced Result: ", slicedResult)

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
                    display: false,
                    reverse: true
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
            <h3>OneWeekChart Component</h3>
            <Line data={chartData} options={chartData.options} ></Line>
        </div>
    )
}
