import { useEffect } from "react"
import { Line } from "react-chartjs-2"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetStockDaily } from "../../../../store/stock"
import { Chart as ChartJS } from "chart.js/auto"



export default function ThreeMonthChart({ ticker }) {

    const dispatch = useDispatch();
    const threeMonthData = useSelector(state => state.stocks.stockDaily)


    useEffect(() => {
        dispatch(thunkGetStockDaily(ticker))
    }, [dispatch, ticker])

    if (!threeMonthData) return null
    if (!threeMonthData["Meta Data"]) return null
    if (!threeMonthData["Time Series (Daily)"]) return null

    const rawData = {}
    const entries = Object.entries(threeMonthData["Time Series (Daily)"])
    // console.log("entries: ", entries)

    entries.forEach(([date, price]) => (
        rawData[date] = Number(price["4. close"]).toFixed(2)
    ))
    // console.log("rawData: ", rawData)

    const result = [];
    for (const [key, value] of Object.entries(rawData)) {
        const obj = { date: key, price: parseFloat(value) }
        result.push(obj)
    }
    console.log("result: ", result)
    const slicedResult = result.slice(0, 60)

    let chartData = ({
        labels: slicedResult.map((data) => data.date),
        datasets: [{
            label: "Stock Price",
            data: slicedResult.map((data) => data.price),
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
            <h3>Three Month Chart Component</h3>
            <Line data={chartData} options ={chartData.options} ></Line>
        </div>
    )
}
