import { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useFinanceAPI } from "../../../context/FinanceApiContext";
import "./IndividualStockPage.css"
import { thunkGetStockNews, thunkGetStockFundamentals, thunkGetStockIntraDay, thunkGetStockDaily, thunkGetAll28Stocks } from "../../../store/stock";
import OneDayChart from "./charts/OneDayChart";
import OneWeekChart from "./charts/OneWeekChart";
import OneMonthChart from "./charts/OneMonthChart";
import ThreeMonthChart from "./charts/ThreeMonthChart";
import OneYearChart from "./charts/OneYearChart";
import FiveYearChart from "./charts/FiveYearChart";
import PurchaseComponent from "./PurchaseComponent";
import TransactionComponent from "./Transactions";
import UserNav from "../UserHomePage/UserNav/UserNav";
import News from "../UserHomePage/NewsComponent/News";



export default function IndividualStockPage() {
    const [isLoaded, setIsLoaded] = useState(false)
    const { markusKim } = useFinanceAPI()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [chart, setChart] = useState("1D")
    let { ticker } = useParams();
    let tickerCap = ticker.toUpperCase()

    const stockFundamentals = useSelector(state => state.stocks.stockFundamentals)
    const stockDaily = useSelector(state => state.stocks.stockDaily)
    const stockNews = useSelector(state => state.stocks.stockNews)
    const user = useSelector(state => state.session.user)
    const stockPrices = useSelector(state => state.stocks.all28Stocks)
    const tickers = Object.keys(markusKim)
    const isSupported = tickers.includes(tickerCap)
    const [isSupportedStocksListHidden, setIsSupportedStocksListHidden] = useState(true)

    useEffect(() => {
        dispatch(thunkGetStockFundamentals(tickerCap))
        dispatch(thunkGetStockDaily(tickerCap))
        dispatch(thunkGetStockNews(tickerCap))
        dispatch(thunkGetAll28Stocks()).then(() => setIsLoaded(true))

    }, [dispatch, tickerCap])

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

    const slicedNews = stockNews?.feed?.slice(0, 10)
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

    const numConverter = (number) => { // Converts market cap to a readable number
        const billion = 1000000000;
        const trillion = 1000000000000;
        const million = 1000000

        let value;
        let suffix;

        if (number >= trillion) {
          value = number / trillion;
          suffix = 'T';
        } else if (number >= billion) {
          value = number / billion;
          suffix = 'B';
        } else if (number >= million){
          value = number / million;
          suffix = "M"

        } else {
          // Return the original value if it's less than a billion
          return number.toFixed(2);
        }

        // Limit the number to 3 digits on the left and 2 on the right of the decimal
        return `${value.toFixed(2)}${suffix}`;
      };

    if (!user) {
        navigate("/login")
        return null
    }


    return (
        <>
        <UserNav />
        { !isLoaded && (
            <div className="loading-container">
                <img src="https://i.imgur.com/JVtVoeb.gif" alt="Loading..." />
            </div>
        )}
        { isLoaded && (
            <div 
                className="stock-page-main-container"
                onClick={() => setIsSupportedStocksListHidden(prev => true)}
            >
            <div className="topleft-individualprice-container">
            <div style={{fontFamily: 'sans-serif', fontSize: '32px'}}>{tickerCap}</div>
                <div style={{ width: "700px" }}>{ chartObj[chart] }</div>

            </div>

            <div className='individualstockpage-timeline'>
                <button className="stock-timeline" onClick={() => setChart("1D")}>1D</button>
                <button className="stock-timeline" onClick={() => setChart("1W")}>1W</button>
                <button className="stock-timeline" onClick={() => setChart("1M")}>1M</button>
                <button className="stock-timeline" onClick={() => setChart("3M")}>3M</button>
                <button className="stock-timeline" onClick={() => setChart("1Y")}>1Y</button>
                <button className="stock-timeline" onClick={() => setChart("5Y")}>5Y</button>
            </div>

            <div className="key-stat-title-div">About</div>
            <p style={{fontSize: '15px', fontWeight: 400, textDecorationThickness: 'auto', fontFamily: 'Helvetica'}}>
                {stockFundamentals["Description"]}
            </p>
            <div className="key-stats-container">
                 <div className="key-stat-title-div">
                    Key Statistics
                 </div>
                 <div className="stat-value-container">
                    <div className="stat-box">
                        <div className="actual-stat">Market Cap </div>
                        <div className="true-stat">{numConverter(stockFundamentals["MarketCapitalization"])}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Price-Earning ratio </div>
                        <div className="true-stat">{stockFundamentals["PERatio"]}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Volume </div>
                        <div className="true-stat">{numConverter(Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["6. volume"]))}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Dividend yield </div>
                        <div className="true-stat">{+stockFundamentals["DividendYield"] !== 0
                                ? `${Number(+stockFundamentals["DividendYield"] * 100).toFixed(2)} %`
                                : "--"
                        }</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Today High </div>
                        <div className="true-stat">${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["2. high"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Today Low </div>
                        <div className="true-stat">${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["3. low"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Today Open </div>
                        <div className="true-stat">${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["1. open"]).toFixed(2)}</div>
                    </div>
                    <div className="stat-box">
                        <div className="actual-stat">Today Close </div>
                        <div className="true-stat">${Number(stockDaily["Time Series (Daily)"][yesterdayFormatted]["4. close"]).toFixed(2)}</div>
                    </div>
                    <PurchaseComponent 
                    ticker={tickerCap} 
                    user={user} 
                    close={close} 
                    isSupported={isSupported}
                    isSupportedStocksListHidden={isSupportedStocksListHidden}
                    setIsSupportedStocksListHidden={setIsSupportedStocksListHidden} 
                    />
                </div>
                    <TransactionComponent ticker={tickerCap} user={user} />
            </div>
            <div>
                <div className="news-stat-title-div">News</div>
                <News newsObject={stockNews} numArticlesDisplayed={10} />
            </div>
        </div>
        )}
        </>
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
//                         <div>${data["Time Series (Daily)"]["2023-03-08"]["7. dividend amount"]}
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
