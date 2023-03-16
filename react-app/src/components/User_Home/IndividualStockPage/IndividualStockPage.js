import { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
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
import PurchaseComponent from "./PurchaseComponent";
import TransactionComponent from "./Transactions";



export default function IndividualStockPage() {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [chart, setChart] = useState("1D")
    let { ticker } = useParams();
    let tickerCap = ticker.toUpperCase()

    const stockFundamentals = useSelector(state => state.stocks.stockFundamentals)
    const stockDaily = useSelector(state => state.stocks.stockDaily)
    const stockNews = useSelector(state => state.stocks.stockNews)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(thunkGetStockFundamentals(tickerCap))
        dispatch(thunkGetStockDaily(tickerCap))
        dispatch(thunkGetStockNews(tickerCap))
    }, [dispatch, ticker])

    if (!stockFundamentals) return null;
    if (!stockDaily) return null;
    if (!stockDaily["Time Series (Daily)"]) return null;
    if (!stockNews["feed"]) return null;


    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    // console.log("yesterday: ", yesterday)
    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const day = yesterday.getDate().toString().padStart(2, '0');
    const yesterdayFormatted = `${year}-${month}-${day}`;
    // console.log("yesterdayFormatted: ", yesterdayFormatted)

    const slicedNews = stockNews["feed"].slice(0, 10)
    // To pass into chart components
    const close = Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["4. close"]).toFixed(2)


    const chartObj = {
        "1D": <OneDayChart ticker={tickerCap} close={close} />,
        "1W": <OneWeekChart ticker={tickerCap} close={close} />,
        "1M": <OneMonthChart ticker={tickerCap} close={close} />,
        "3M": <ThreeMonthChart ticker={tickerCap} close={close} />,
        "1Y": <OneYearChart ticker={tickerCap} close={close} />,
        "5Y": <FiveYearChart ticker={tickerCap} close={close} />,
    }

    if (!user) {
        navigate("/login")
        return null
    }


    return (
        <div className="stock-page-main-container">
            <h1>{stockFundamentals["Symbol"]}</h1>
            <div style={{ gap: "7px" }}>
                { chartObj[chart] }
                <button className="stock-timeline" onClick={() => setChart("1D")}>1D</button>
                <button className="stock-timeline" onClick={() => setChart("1W")}>1W</button>
                <button className="stock-timeline" onClick={() => setChart("1M")}>1M</button>
                <button className="stock-timeline" onClick={() => setChart("3M")}>3M</button>
                <button className="stock-timeline" onClick={() => setChart("1Y")}>1Y</button>
                <button className="stock-timeline" onClick={() => setChart("5Y")}>5Y</button>
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
                        <div>{Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["6. volume"]).toLocaleString()}</div>
                    </div>
                    <div className="stat-box">
                        <div>Dividend yield </div>
                        <div>{+stockFundamentals["DividendYield"] !== 0
                                ? `${Number(+stockFundamentals["DividendYield"] * 100).toFixed(2)} %`
                                : "--"
                        }</div>
                    </div>
                    <div className="stat-box">
                        <div>Today High </div>
                        <div>${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["2. high"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Low </div>
                        <div>${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["3. low"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Open </div>
                        <div>${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["1. open"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div>Today Close </div>
                        <div>${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["4. close"]).toFixed(2)}</div>
                    </div>
                </div>
                    <PurchaseComponent ticker={tickerCap} user={user} close={close} />
                    <TransactionComponent ticker={tickerCap} user={user} />
            </div>
            <div>
                <div className="news-stat-title-div">News</div>
                { slicedNews.map(news => (
                    <NavLink
                        to={news.url}
                        key={news.title}
                        className="news-navlink"
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ padding: "5px", width: "600px"}}>
                                    <div style={{ fontSize: "12px", color: "gray"}}>{news.source}</div>
                                    <div style={{ fontSize: "15px"}}>{news.title}</div>
                                    <div style={{ fontSize: "10px", color: "gray"}}>{news.summary}</div>
                                </div>
                                <div>
                                    <img
                                        style={{width: "140px", height: "100px"}}
                                        src={news.banner_image} />
                                </div>
                            </div>
                    </NavLink>
                )) }
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
