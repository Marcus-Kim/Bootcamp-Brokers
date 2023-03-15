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

  const formatDate = (date) => {
    // Converts "Wed, 15 Mar 2023 00:00:00 GMT" => "15 Mar 2023"
    const d = date.split(':')[0].slice(5, -2).split(' ')
    return [d[1], d[0] + ',', d[2]].join(' ')
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
            <div>Recent</div>
            <hr className="break"/>
            { transactionsArray.map(transaction => (
              <div 
                className="transaction-card"
                key={transaction.id}
              >
                <div className="left-column">
                  <div>{transaction.ticker_id}</div>
                  <div>{formatDate(transaction.date)}</div>
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
