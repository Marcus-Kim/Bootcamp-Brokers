import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetOneMonthStockData } from "../../../../store/stock";
import { Chart } from "chart.js/auto"

export default function OneMonthChart({ ticker, close }) {

    const dispatch = useDispatch();
    const monthlyData = useSelector(state => state.stocks.oneMonthChartData)
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
        dispatch(thunkGetOneMonthStockData(ticker))
        setPrice(close)
    }, [dispatch, ticker, close])

    if (!monthlyData) return null
    if (!monthlyData["Meta Data"]) return null
    if (!monthlyData["Time Series (60min)"]) return null

    const rawData = {}
    const entries = Object.entries(monthlyData["Time Series (60min)"])

    entries.forEach(([date, price]) => (
        rawData[date] = Number(price["4. close"]).toFixed(2)
    ))
    // console.log("month entries: ", entries)

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

            <div className="chart-price">{`$${Number(price).toFixed(2)}`}</div>
            <Line data={chartData} options={chartData.options} ></Line>
        </div>
    )
}
