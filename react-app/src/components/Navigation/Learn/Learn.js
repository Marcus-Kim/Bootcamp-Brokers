import React from 'react'
import { useState, useEffect } from 'react'
import { useFinanceAPI } from '../../../context/FinanceApiContext';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetStockFundamentals, thunkGetStockNews,thunkGetStockIntraDay  } from '../../../store/stock';



export default function Learn() {
  const dispatch = useDispatch()
  const {ticker, setTicker} = useFinanceAPI()
  const {queryType, setQueryType} = useFinanceAPI()
  const {fetchStockData, fetchStockNewsData} = useFinanceAPI()
  const [data, setData] = useState([null]);
  const [errors, setErrors] = useState([]);
  const {interval, setInterval} = useFinanceAPI()

  const stocks = useSelector(state => state.stocks)

  //Query Types:
  // TIME_SERIES_INTRADAY -- API Returns the intraday stock price data
  // TIME_SERIES_DAILY_ADJUSTED -- API Returns Daily stock price data 
  // OVERVIEW -- API returns Company Financial Overview Data and Key Finance Ratios and Metrics
  // TIME_SERIES_WEEKLY -- API Returns weekly stock price data
  // TIME_SERIES_MONTHLY -- API Returns Monthly Stock price data
  // SYMBOL_SEARCH -- API Returns your search query on stock data
  // INCOME_STATEMENT -- API Returns Net Profit Net loss data
  // BALANCE_SHEET -- API Returns current financial obligations and assets
  // CASH_FLOW -- API returns incoming cash flow data
  // NEWS_SENTIMENT -- API returns FInancial news data on the ticker
  // EARNINGS -- API Returns Companies financial earnings
  console.log('stocks', stocks)
  

  useEffect(() => {
    // dispatch(thunkGetStockNews(ticker))
    // dispatch(thunkGetStockIntraDay(ticker, interval))
    dispatch(thunkGetStockFundamentals(ticker))

    // async function fetchData() {
    //   // setQueryType("TIME_SERIES_DAILY_ADJUSTED") // set the type of query you want
    //   // setInterval() // set time frame for intraday end point
    //   // setTicker() // set ticker you want to set it to 

    //   const json = await fetchStockNewsData()

    //   setData(json)
    // }
    // fetchData()
    
  }, [fetchStockNewsData, dispatch])

  if (!data) return null;

  if (!data.feed) return null;
  // console.log("data: ", data.feed)
  const slicedData = data.feed.slice(0, 10)
  // console.log("sliced data: ", slicedData)

  return (
    <div>
      <div style={{ borderBottom: "solid", borderWidth: "1px", backgroundColor: "rgb(225,235,220)"}}>
        <div 
          style={{ fontSize: "30px", padding: "18px" }}
          >Learn Investing Basics from Bootcamp Brokers?</div>
          
      </div>
      <div>
        <div
          style={{ fontSize: "20px", padding: "18px" }}
          >Read These News to Expand Your Knowledge!</div>
      </div>
      <div>

        { slicedData.map(news => (

          <div key={news.author}>
            <div>{news.title}</div>
            <NavLink to={`${news.url}`} key={`${news.author}`}>{news.url}</NavLink>
          </div>
        )) }
      </div>

    </div>
  )
}
