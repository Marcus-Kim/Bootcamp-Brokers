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
  }, [dispatch])

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
            <div>Recent</div>
            <hr className="break"/>
            { transactionsArray.map(transaction => (
              <div 
                className="transaction-card"
                key={transaction.id}
              >
                <div className="left-column">
                  <div>{transaction.ticker_id}</div>
                  <div>{transaction.date}</div>
                </div>
                <div className="right-column">
                  <div>{transaction.shares}</div>
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
