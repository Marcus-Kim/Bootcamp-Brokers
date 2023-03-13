import React, {useState, useContext, createContext, useEffect} from "react"

export const AlphaVantageAPIContext = createContext()
export const useFinanceAPI = () => useContext(AlphaVantageAPIContext)


export default function FinanceAPIProvider({children}) {
  const [ticker, setTicker] = useState("AAPL")
  const [queryType, setQueryType] = useState("TIME_SERIES_DAILY_ADJUSTED")
  const [keywords, setKeywords] = useState("")
  const [interval, setInterval] = useState("5min")
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

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


  const fetchStockData = async() => {
    const apiUrl = `https://www.alphavantage.co/query?function=${queryType}&symbol=${ticker}&apikey=${apiKey}`;
    const response = await fetch(apiUrl)
    const json = await response.json()
    return json
  }

  // Grabs most recent stock news data
  const fetchStockNewsData = async () => {
    const apiURL = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`
    const response = await fetch(apiURL)

    const json = await response.json()
    return json
  }

  // Gets Stock data by 1 min - 5 min - 15 min - 30 min - 1 hour intervals
  const fetchIntraDayStockData = async () => {
    const apiURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=${interval}&apikey=${apiKey}`
    const response = await fetch(apiURL)
    const json = await response.json()
    return json
  }

  return (
    <AlphaVantageAPIContext.Provider
    value={{
      ticker,
      setTicker,
      interval,
      setInterval,
      queryType,
      setQueryType,
      fetchStockData,
      fetchStockNewsData,
      fetchIntraDayStockData
    }}
    >
      {children}
    </AlphaVantageAPIContext.Provider>
  )
}


// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'dc3a2cd2bemsh55264fb7594888ep15d156jsn2c54fd4fc8fa',
// 		'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
// 	}
// };

// fetch('https://yahoo-finance127.p.rapidapi.com/price/tsla', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

// CRN1I5X51XQTTFBH
