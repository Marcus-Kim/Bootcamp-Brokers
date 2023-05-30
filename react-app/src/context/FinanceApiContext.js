import React, {useState, useContext, createContext, useEffect} from "react"

export const AlphaVantageAPIContext = createContext()
export const useFinanceAPI = () => useContext(AlphaVantageAPIContext)


export default function FinanceAPIProvider({children}) {
  const [ticker, setTicker] = useState("AAPL")
  const [queryType, setQueryType] = useState("TIME_SERIES_DAILY_ADJUSTED")
  const [interval, setInterval] = useState("5min")
  const [marketCap, setMarketCap] = useState({})
  const [dailyPrice, setDailyPrices] = useState({})
  const [markusKim, setMarkusKim] = useState({})
  const apiKey = "GRF5OMG8NG79W0WR"

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

  const allTickers = [
    'TSLA', 'AAPL', 'AMZN',
    'GOOG', 'CRM', 'AMD',
    'NVDA', 'KO', 'BBY',
    'IBM', 'CRSP', 'COIN',
    'HOOD', 'MSFT', 'AI',
    'LULU', 'NKE', 'GME',
    'AMC', 'BBBY', 'BB',
    'T', 'SPY', 'QQQ',
    'BEAM', 'APLS', 'CRBU',
    'VRTX'
  ]

  const fetchMarketCaps = async (tickers) => {
    const marketCaps = {};

    const promises = tickers.map(async (ticker) => {
      const marketCapData = await fetchStockData("OVERVIEW", ticker);
      marketCaps[ticker] = marketCapData;
    });

    await Promise.all(promises);
    setMarketCap(marketCaps);
  };


  const fetchDailyStockPrices = async (tickers) => {
    const tempDailyPrices = {};

    const promises = tickers.map(async (ticker) => {
      const data = await fetchStockData("TIME_SERIES_DAILY_ADJUSTED", ticker);
      tempDailyPrices[ticker] = data;
    });

    await Promise.all(promises);
    setDailyPrices(tempDailyPrices);
  };

  useEffect(() => {
    // Call fetchMarketCaps and fetchDailyStockPrices when the component mounts
    fetchMarketCaps(allTickers);
    fetchDailyStockPrices(allTickers);
  }, []);


  const fetchStockData = async (queryType, ticker) => {
    const apiUrl = `https://www.alphavantage.co/query?function=${queryType}&symbol=${ticker}&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const json = await response.json();
    return json;
  };

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

  const generateMarkusKimObject = (marketCaps, dailyPrices) => {
    const result = {};

    Object.keys(marketCaps).forEach((symbol) => {
      const marketCapData = marketCaps[symbol];
      const dailyPriceData = dailyPrices[symbol] && dailyPrices[symbol]["Time Series (Daily)"];

      if (dailyPriceData) {
        // Extract the most recent date from the dailyPriceData
        const mostRecentDate = Object.keys(dailyPriceData)[0];

        // Extract the open and close prices for the most recent date
        const openPrice = parseFloat(dailyPriceData[mostRecentDate]["1. open"]);
        const closePrice = parseFloat(dailyPriceData[mostRecentDate]["4. close"]);

        // Calculate the percentage change between open and close
        const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

        result[symbol] = {
          marketCap: marketCapData.MarketCapitalization,
          dailyPrice: {
            close: closePrice,
            percentageChange: percentageChange,
          },
        };
      }
    });

    return result;
  };

  useEffect(() => {
    // Check if both marketCap and dailyPrice are populated before generating the object
    if (Object.keys(marketCap).length > 0 && Object.keys(dailyPrice).length > 0) {
      const updatedMarkusKim = generateMarkusKimObject(marketCap, dailyPrice);
      setMarkusKim(updatedMarkusKim);
    }
  }, [marketCap, dailyPrice]);



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
      fetchIntraDayStockData,
      markusKim,
    }}
    >
      {children}
    </AlphaVantageAPIContext.Provider>
  )
}
