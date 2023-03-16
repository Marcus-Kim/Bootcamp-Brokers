import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetStockWeekly } from "../../../../store/stock"
import { Chart } from "chart.js/auto"


export default function FiveYearChart({ ticker, close }) {

    const dispatch = useDispatch();
    const fiveYearData = useSelector(state => state.stocks.stockWeekly)
    const [price, setPrice] = useState(close)

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
            setPrice(value);
        }
    };

    useEffect(() => {
        dispatch(thunkGetStockWeekly(ticker))
    }, [dispatch, ticker])

    if (!fiveYearData) return null
    if (!fiveYearData["Meta Data"]) return null
    if (!fiveYearData["Weekly Time Series"]) return null

    // console.log("fiveYearData: ", fiveYearData)

    const rawData = {}
    const entries = Object.entries(fiveYearData["Weekly Time Series"])

    entries.forEach(([date, price]) => (
        rawData[date] = Number(price["4. close"]).toFixed(2)
    ))
    // console.log("rawData: ", rawData)

    const result = [];
    for (const [key, value] of Object.entries(rawData)) {
        const obj = { date: key, price: parseFloat(value)}
        result.push(obj)
    }
    // console.log("result: ", result)
    const slicedResult =  result.slice(0, 262)

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
            responsive: true,
            hover: {
                intersect: false
            },
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
            },
            interaction: {
                intersect: false
            },
            onHover: (event, activeElements, chart) => {
                handleHover(event, activeElements, chart);
            },
        }
    });

    return (
        <div>
            <h3>Five Year Chart Component</h3>
            <div>{`$ ${Number(price).toFixed(2)}`}</div>
            <Line data={chartData} options ={chartData.options} ></Line>
        </div>
    )

}
