import React, { useEffect, useState } from 'react'
import "./History.css"
import { useSelector, useDispatch } from 'react-redux'
import { thunkGetTransactionsByUserId } from '../../../../../store/transactions'
import UserNav from '../../UserNav/UserNav'

export default function History() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const transactions = useSelector(state => state.transaction.allTransactions)
  const transactionsArray = Object.values(transactions)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(thunkGetTransactionsByUserId())
      .then(() => setIsLoaded(true))
  }, [dispatch, transactionsArray.length])

  const formatDate = (date) => {
    // Converts "Wed, 15 Mar 2023 00:00:00 GMT" => "Mar 15, 2023"
    const d = date.split(':')[0].slice(5, -2).split(' ')
    return [d[1], d[0] + ',', d[2]].join(' ')
  }

  const outputType = (shares) => {
    return shares > 0 ? 'Buy' : 'Sell'
  }

  return (
    <>
    { isLoaded && (
      <>
        <UserNav/>
        <div className="history-container">
          <div className="name-container">
            {user.username}
          </div>
          <hr className="break"/>
          <div className="recent-container">
            <div className="header">Recent</div>
            { transactionsArray.map(transaction => (
              <div key={transaction.id}>
                <hr className="break"/>
                <div
                  className="transaction-card"
                  key={transaction.id}
                >
                  <div className="left-column">
                    <div className="ticker-id">
                      <span>{transaction.ticker_id} </span> 
                      <span>Market {outputType(transaction.shares)}</span>
                    </div>
                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                  </div>
                  <div className="right-column">
                    <div className={transaction.shares > 0 ? 'buy' : 'sell'}>{transaction.shares}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
    </>
  )
}
