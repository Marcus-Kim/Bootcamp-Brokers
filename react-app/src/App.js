import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {Route, Routes} from 'react-router-dom'

import { authenticate } from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import SplashPage from "./components/SplashPage/SplashPage";

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
          

          {/* <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route> */}
        </Routes>
      )}
    </>
  );
}

export default App;
