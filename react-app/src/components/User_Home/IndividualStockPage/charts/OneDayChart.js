import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetStockIntraDay } from "../../../../store/stock";
import { Chart as ChartJS } from "chart.js/auto"


export default function OneDayChart({ ticker, close }) {

    const dispatch = useDispatch()
    const interval = "5min"
    const intraDayData = useSelector(state => state.stocks.stockIntraDay)
    const [price, setPrice] = useState(close)

    useEffect(() => {
        dispatch(thunkGetStockIntraDay(ticker, interval))
    }, [dispatch, ticker])

    if (!intraDayData) return null
    if (!intraDayData["Meta Data"]) return null
    if (!intraDayData["Time Series (5min)"]) return null



    const rawData = {}
    const entries = Object.entries(intraDayData["Time Series (5min)"])
    // console.log("data entries: ", entries)
    entries.forEach(([time, price]) => (
        rawData[time] = Number(price["4. close"]).toFixed(2)
    ))

    const result = []
    for (const [key, value] of Object.entries(rawData)) {
        const obj = { time: key, price: parseFloat(value) };
        result.push(obj);
    }

    // console.log("result: ", result)
    // const verticalLinePlugin = {
    //     id: "verticalLine",
    //     afterDraw: (chart, args, options) => {
    //     if (!chart.tooltip._active || !chart.tooltip._active.length) {
    //         return;
    //     }
    //         const active = chart.tooltip._active[0];
    //         const ctx = chart.ctx;
    //         const x = active.element.x;
    //         const topY = chart.scales.y.top;
    //         const bottomY = chart.scales.y.bottom;

    //         ctx.save();
    //         ctx.beginPath();
    //         ctx.moveTo(x, topY);
    //         ctx.lineTo(x, bottomY);
    //         ctx.lineWidth = 1;
    //         ctx.strokeStyle = "black";
    //         ctx.stroke();
    //         ctx.restore();
    //     },
    // };

    // ChartJS.register(verticalLinePlugin);


    // const handleHover = (event, active, chart) => {
    //     if (active.length > 0) {
    //         const dataIndex = active[0].index;
    //         const datasetIndex = active[0].datasetIndex;
    //         const value = chart.data.datasets[datasetIndex].data[dataIndex];
    //         setPrice(value);
    //     }
    // };

    let chartData = ({
        labels: result.map((data) => data.time),
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
            // maintainAspectRatio: false,
            // responsive: true,
            // hover: {
            //     intersect: false,
            // },
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
            // onHover: (event, activeElements, chart) => {
            //     handleHover(event, activeElements, chart);
            // },
        }
    });

    return (
        <div>
            <h3>OneDayData Component Loaded!</h3>
            <div>{`$ ${close}`}</div>
            <Line data={chartData} options={chartData.options} ></Line>
            {/* <p>{ ticker }</p> */}
        </div>
    )
}
