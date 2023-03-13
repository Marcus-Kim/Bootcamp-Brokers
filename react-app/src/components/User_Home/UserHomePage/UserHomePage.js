import React from 'react'
import { useState, useEffect } from 'react'
import { useFinanceAPI } from '../../../context/FinanceApiContext';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetBTCPrice } from '../../../store/stock';
import { thunkGetStockIntraDay } from '../../../store/stock';
import { thunkGetStockDaily } from '../../../store/stock';

export default function UserHomePage() {
  const dispatch = useDispatch()
  const BTC = useSelector(state => state.stocks.BTCPrice)
  const SPY = useSelector(state => state.stocks.stockDaily)
  const today = new Date().toISOString().substring(0, 10)
  

  useEffect(() => {
    dispatch(thunkGetBTCPrice())
    dispatch(thunkGetStockDaily('SPY'))
    
  }, [dispatch])

  if (!BTC) return null
  if (!SPY) return null

  return (
    <div className="homepage-container">
      <div className="chart-container">sadf</div>
      <div className="watchlist-container"></div>
      <div className="indexes-container">
        <span>S&P 500 {SPY?.["Time Series (Daily)"]?.[today]?.["4. close"]}</span>
        <span>Nasdaq</span>
        <span>Bitcoin {parseFloat(BTC?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"])}</span>

      </div>
    </div>
  )
}
