import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {Route, Routes} from 'react-router-dom'

import { authenticate } from "./store/session";

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


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />

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
          <Route path='*' exact={true} element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
