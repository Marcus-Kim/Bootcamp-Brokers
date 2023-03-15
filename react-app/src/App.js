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
import { thunkGetPortfolioHistoricalValues, thunkGetPortfolioHoldings, thunkGetUserPortfolio } from "./store/portfolio";
import { thunkGetAllWatchlistsUserId } from "./store/watchlist";
import Profile from "./components/User_Home/UserHomePage/UserDropDown/Profile/Profile";
import History from "./components/User_Home/UserHomePage/UserDropDown/History/History";
import Investing from "./components/User_Home/UserHomePage/UserDropDown/Investing";
import SucessfullyLoggedOut from "./components/Navigation/SuccessLogOut/SucessfullyLoggedOut";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const userId = useSelector(state => state.session.user?.id)
  
  // Populate redux store with user details on mount
  useEffect(() => {
    dispatch(authenticate())
      .then(() => dispatch(thunkGetPortfolioHistoricalValues()))
      .then(() => dispatch(thunkGetPortfolioHoldings()))
      .then(() => dispatch(thunkGetUserPortfolio()))
      .then(() => dispatch(thunkGetAllWatchlistsUserId(userId)))
      .then(() => setIsLoaded(true));
  }, [dispatch]);
  

  

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
