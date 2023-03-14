import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useFinanceAPI } from "../../../context/FinanceApiContext";
import "./IndividualStockPage.css"
import { thunkGetStockNews, thunkGetStockFundamentals, thunkGetStockIntraDay, thunkGetStockDaily } from "../../../store/stock";
import OneDayChart from "./charts/OneDayChart";
import OneWeekChart from "./charts/OneWeekChart";
import OneMonthChart from "./charts/OneMonthChart";
import ThreeMonthChart from "./charts/ThreeMonthChart";
import OneYearChart from "./charts/OneYearChart";
import FiveYearChart from "./charts/FiveYearChart";


export default function IndividualStockPage() {

    const dispatch = useDispatch();
    const [chart, setChart] = useState("1D")
    let { ticker } = useParams();
    let tickerCap = ticker.toUpperCase()
    // console.log("tickerCap: ", tickerCap)


    const stockFundamentals = useSelector(state => state.stocks.stockFundamentals)
    // const stockIntraDay = useSelector(state => state.stocks.stockIntraDay)
    const stockDaily = useSelector(state => state.stocks.stockDaily)

    // console.log("stockFundamentals :", stockFundamentals)
    // console.log("stockDaily: ", stockDaily)

    useEffect(() => {
        dispatch(thunkGetStockFundamentals(tickerCap))
        // dispatch(thunkGetStockIntraDay(tickerCap, "5min"))
        dispatch(thunkGetStockDaily(tickerCap))
    }, [dispatch, ticker])


    if (!stockFundamentals) return null
    if (!stockDaily) return null
    if (!stockDaily["Time Series (Daily)"]) return null

    const chartObj = {
        "1D": <OneDayChart ticker={tickerCap} />,
        "1W": <OneWeekChart ticker={ tickerCap } />,
        "1M": <OneMonthChart ticker={tickerCap} />,
        "3M": <ThreeMonthChart ticker={tickerCap} />,
        "1Y": <OneYearChart ticker={tickerCap} />,
        "5Y": <FiveYearChart ticker={tickerCap} />,
    }


    return (
        <div className="stock-page-main-container">
            <h1>{stockFundamentals["Symbol"]}</h1>
            <div>
                { chartObj[chart] }
                <button onClick={() => setChart("1D")}>1D</button>
                <button onClick={() => setChart("1W")}>1W</button>
                <button onClick={() => setChart("1M")}>1M</button>
                <button onClick={() => setChart("3M")}>3M</button>
                <button onClick={() => setChart("1Y")}>1Y</button>
                <button onClick={() => setChart("5Y")}>5Y</button>
            </div>

            <h3>About</h3>
            <p>
                {stockFundamentals["Description"]}
            </p>
            <div className="key-stats-container">
                 <div className="key-stat-title-div">
                    Key Statistics
                 </div>
                 <div className="stat-value-container">
                    <div className="stat-box">
                        <div>Market Cap </div>
                        <div>{Number(stockFundamentals["MarketCapitalization"]).toLocaleString()}</div>
                    </div>
                    <div className="stat-box">
                        <div>Price-Earning ratio </div>
                        <div>{stockFundamentals["PERatio"]}</div>
                    </div>
                    <div className="stat-box">
                        <div>Volume </div>
                        <div>{Number(stockDaily["Time Series (Daily)"]["2023-03-08"]["6. volume"]).toLocaleString()}</div>
                    </div>
                    <div className="stat-box">
                        <div>Dividend yield </div>
                        <div>{+stockFundamentals["DividendYield"] !== 0
                                ? `${+stockFundamentals["DividendYield"] * 100} %`
                                : "--"
                        }</div>
                    </div>
                    <div className="stat-box">
                        <div>Today High </div>
                        <div>${stockDaily["Time Series (Daily)"]["2023-03-08"]["2. high"]}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Low </div>
                        <div>${stockDaily["Time Series (Daily)"]["2023-03-08"]["3. low"]}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Open </div>
                        <div>${stockDaily["Time Series (Daily)"]["2023-03-08"]["1. open"]}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Close </div>
                        <div>${stockDaily["Time Series (Daily)"]["2023-03-08"]["4. close"]}</div>
                    </div>
                </div>
                <div className="purchase-container">

                </div>
            </div>
        </div>

    )
}

// export default function IndividualStockPage() {

//     const { ticker, setTicker } = useFinanceAPI()
//     const { queryType, setQueryType } = useFinanceAPI()
//     const { fetchStockData, fetchStockNewsData } = useFinanceAPI()
//     const [data, setData] = useState(null);
//     const [errors, setErrors] = useState([])

//     useEffect(() => {

//         async function fetchData() {
//             const result = await fetchStockData()
//             setData(result)
//         }
//         fetchData()

//     }, [fetchStockData])

//     if (!data) return null;
//     if (!data["Time Series (Daily)"]) return null;

//     console.log("data: ", data)

//     return (
//         <div className="stock-page-main-container">
//             <h1>Individual Stock Page</h1>
//             <h3>{data["Meta Data"]["2. Symbol"]}</h3>

//             <div className="key-stats-container">
//                 <div className="key-stat-title-div">
//                     Key Statistics
//                 </div>
//                 <div className="stat-value-container">
//                     <div>
//                         <div>Market Cap </div>
//                     </div>
//                     <div>
//                         <div>Price-Earning ratio </div>
//                     </div>
//                     <div>
//                         <div>Average Volume </div>
//                     </div>
//                     <div>
//                         <div>Dividend yield </div>
//                         <div>${data["Time Series (Daily)"]["2023-03-08"]["7. dividend amount"]}</div>
//                     </div>
//                     <div className="stat-box">
//                         <div>Yesterday High </div>
//                         <div>${data["Time Series (Daily)"]["2023-03-08"]["2. high"]}</div>
//                     </div>
//                     <div>
//                         <div>Yesterday Low </div>
//                         <div>${data["Time Series (Daily)"]["2023-03-08"]["3. low"]}</div>
//                     </div>
//                     <div>
//                         <div>Volume </div>
//                         <div>{data["Time Series (Daily)"]["2023-03-08"]["6. volume"]}</div>
//                     </div>
//                     <div>
//                         <div>Yesterday Open </div>
//                         <div>${data["Time Series (Daily)"]["2023-03-08"]["1. open"]}</div>
//                     </div>
//                     <div>
//                         <div>Yesterday Close </div>
//                         <div>{data["Time Series (Daily)"]["2023-03-08"]["4. close"]}</div>
//                     </div>
//                 </div>
//                 <div className="purchase-container">

//                 </div>
//             </div>

//         </div>
//     )
// }
