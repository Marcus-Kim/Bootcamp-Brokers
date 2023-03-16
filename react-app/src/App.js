import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Route, Routes} from 'react-router-dom'
import ChatBubble from "./components/SplashPage/ChatGPT/ChatBubble";
import { authenticate } from "./store/session";
import { useNavigate } from "react-router-dom";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SplashPage from './components/SplashPage/SplashPage';
import Learn from './components/Navigation/Learn/Learn';
import Snack from './components/Navigation/Snack/Snack';
import Login from './components/Navigation/Login/Login';
import Signup from './components/Navigation/Signup/Signup';
import UserHomePageNav from "./components/User_Home/UserHomePage/UserHomePageNav";
import IndividualStockPage from './components/User_Home/IndividualStockPage/IndividualStockPage'
import NotFound from './components/Navigation/NotFound/NotFound'
import WatchlistDetails from './components/Watchlists/WatchlistDetails'
import { thunkCreatePortfolioSnapshot, thunkGetPortfolioHistoricalValues, thunkGetPortfolioHoldings, thunkGetUserPortfolio } from "./store/portfolio";
import { thunkGetAllWatchlistsUserId } from "./store/watchlist";
import Profile from "./components/User_Home/UserHomePage/UserDropDown/Profile/Profile";
import History from "./components/User_Home/UserHomePage/UserDropDown/History/History";
import Investing from "./components/User_Home/UserHomePage/UserDropDown/Investing";
import SucessfullyLoggedOut from "./components/Navigation/SuccessLogOut/SucessfullyLoggedOut";
import { thunkGetStockFundamentals, thunkGetStockDaily } from "./store/stock";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const userId = useSelector(state => state.session.user?.id)
  const [marketCap, setMarketCap] = useState({})
  const [dailyPrice, setDailyPrices] = useState({})
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().substring(0, 10);
//   const [MarkusKim, setMarkusKim] = useState({})
  


//   const tickers = ['TSLA', 'AAPL', 'AMZN', 'GOOG', 'CRM', 'AMD', 'NVDA', 'KO', 'BBY', 'IBM', 'CRSP', 'COIN',
//                   'HOOD', 'MSFT', 'AI', 'LULU', 'NKE', 'GME', 'AMC', 'BBBY', 'BB', 'T', 'SPY', 'QQQ', 'BEAM', 'APLS', 'CRBU', 'VRTX']
  

//   const fetchMarketCaps = async (tickers) => {
//     const tempMarketCaps = {};
//     const promises = tickers.map((ticker) =>
//       dispatch(thunkGetStockFundamentals(ticker)).then((data) => (tempMarketCaps[ticker] = data))
//     );
//     await Promise.all(promises);
//     setMarketCap(tempMarketCaps);
//   };

//   const fetchDailyStockPrices = async (tickers) => {
//   const tempDailyPrices = {};
//   const promises = tickers.map((ticker) =>
//     dispatch(thunkGetStockDaily(ticker)).then((data) => (tempDailyPrices[ticker] = data))
//   );
//   await Promise.all(promises);
//   setDailyPrices(tempDailyPrices);
// };

  // Make sure dailyPrice is populated before executing this


  // Populate redux store with user details on mount
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(authenticate());
      await dispatch(thunkGetPortfolioHistoricalValues());
      await dispatch(thunkGetPortfolioHoldings());
      await dispatch(thunkGetUserPortfolio());
      await dispatch(thunkGetAllWatchlistsUserId(userId));
      await dispatch(thunkCreatePortfolioSnapshot()); 
      // Fetch market caps only if marketCap state is empty
      // if (Object.keys(marketCap).length === 0) {
      //   fetchMarketCaps(tickers);
      // }

      // // Fetch daily stock prices only if dailyPrice state is empty
      // if (Object.keys(dailyPrice).length === 0) {
      //   fetchDailyStockPrices(tickers);
      // }
      setIsLoaded(true)
    }
    fetchData()

  }, [dispatch]);
  
     
  // const generateMarkusKimObject = (marketCaps, dailyPrices) => {
  //   const result = {};
  
  //   Object.keys(marketCaps).forEach((symbol) => {
  //     const marketCapData = marketCaps[symbol];
  //     const dailyPriceData = dailyPrices[symbol]['Time Series (Daily)'];
  
  //     // Extract the most recent date from the dailyPriceData
  //     const mostRecentDate = Object.keys(dailyPriceData)[0];
  
  //     // Extract the open and close prices for the most recent date
  //     const openPrice = parseFloat(dailyPriceData[mostRecentDate]['1. open']);
  //     const closePrice = parseFloat(dailyPriceData[mostRecentDate]['4. close']);
  
  //     // Calculate the percentage change between open and close
  //     const percentageChange = ((closePrice - openPrice) / openPrice) * 100;
  
  //     result[symbol] = {
  //       marketCap: marketCapData.MarketCapitalization,
  //       dailyPrice: {
  //         close: closePrice,
  //         percentageChange: percentageChange,
  //       },
  //     };
  //   });
  
  //   return result;
  // };

  // useEffect(() => {
  //   // Check if both marketCap and dailyPrice are populated before generating the object
  //   if (Object.keys(marketCap).length > 0 && Object.keys(dailyPrice).length > 0) {
  //     const updatedMarkusKim = generateMarkusKimObject(marketCap, dailyPrice);
  //     setMarkusKim(updatedMarkusKim);
  //   }
  // }, [marketCap, dailyPrice]);


  // console.log(MarkusKim)

  // dispatch(authenticate())
  // .then(() => dispatch(thunkGetPortfolioHistoricalValues()))
  // .then(() => dispatch(thunkGetPortfolioHoldings()))
  // .then(() => dispatch(thunkGetUserPortfolio()))
  // .then(() => dispatch(thunkGetAllWatchlistsUserId(userId)))
  // .then(() => dispatch(thunkCreatePortfolioSnapshot())) // Capture snapshot of portfolio value
  

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <ChatBubble/>

      {isLoaded && (
        <Routes>
          
          <Route exact path ="/" element={<SplashPage/>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/learn" element={<Learn />}></Route>
          <Route path="/snacks" element={<Snack />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/home" element={<UserHomePageNav />}></Route>
          <Route path="/stocks/:ticker" element={<IndividualStockPage />} />
          <Route path="/watchlists/:watchlistId" element={<WatchlistDetails />} />
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/history" element={<History/>}></Route>
          <Route path="/Investing" element={<Investing/>}></Route>
          <Route path="/loggedout" element={<SucessfullyLoggedOut/>}></Route>
          <Route path='*' exact={true} element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
