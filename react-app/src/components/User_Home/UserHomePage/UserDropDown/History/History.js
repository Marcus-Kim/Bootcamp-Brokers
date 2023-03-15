import React from 'react'
import "./History.css"
import { useSelector, useDispatch } from 'react-redux'
import UserNav from '../../UserNav/UserNav'

export default function History() {
  const user = useSelector(state => state.session.user)

  return (
    <>
    <UserNav/>
    <div className="history-container">
      <div className="name-container">
        {user.username}
      </div>
      <hr className="break"/>
      <div className="main-container">
        <div className="recent-container"> 
            Recent
            <hr className="break"/>
        </div>
        <div className="transaction-card">
          
        </div>

      </div>
        
    </div>
    </>
  )
}
