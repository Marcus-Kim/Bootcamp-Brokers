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
import { thunkGetAll28Stocks } from "./store/stock";


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const userId = useSelector(state => state.session.user?.id)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().substring(0, 10);



  useEffect(() => {

    const fetchData = async () => {

      await dispatch(authenticate());
      setIsLoaded(true)
    }
    fetchData()

  }, [dispatch]);



  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <ChatBubble 
        isChatModalOpen={isChatModalOpen} 
        setIsChatModalOpen={setIsChatModalOpen}
      />

      {isLoaded && (
        <Routes>

          <Route exact path ="/" element={<SplashPage/>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/learn" element={<Learn />}></Route>
          <Route path="/snacks" element={<Snack />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/home" element={<UserHomePageNav setIsChatModalOpen={setIsChatModalOpen}/>}></Route>
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
