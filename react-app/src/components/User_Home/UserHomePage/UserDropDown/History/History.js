import React from 'react'
import "./History.css"
import { useSelector, useDispatch } from 'react-redux'
import UserHomePageNav from '../../UserHomePageNav'
import { useNavigate } from 'react-router-dom'
import UserNav from '../../UserNav/UserNav'

export default function History() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session)
  const userArray = Object.values(user)

  return (
    <>
    <UserNav/>
    <div className="history-container">
      <div className="name-container">
        {userArray[0].username}
      </div>
      <hr />
      <div className="main-container">
        <div className="recent-container"> 
            Recent
            <hr />
        </div>
        <div className="transaction-card">
          
        </div>

      </div>
        
    </div>
    </>
  )
}
