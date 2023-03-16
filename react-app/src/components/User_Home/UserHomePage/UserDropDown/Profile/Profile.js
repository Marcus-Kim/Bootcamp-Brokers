import React, {useEffect, useState} from 'react'
import UserNav from '../../UserNav/UserNav'
import './Profile.css'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';


export default function Profile() {
  const user = useSelector(state => state.session)
  const userArray = Object.values(user)
  const userPortfolio = useSelector(state => state.portfolio)
  

  return (
    <>
      <UserNav/>
      <div className="profile-page-container">
        <div className="profile-container">
          <div className="profile-image">
          <FontAwesomeIcon style={{height: 72, width: 72}} icon={faCircleUser} />
          </div>
          <div >
            <div className= "profile-name-container">{userArray[0]?.username}</div>
            <div style={{marginTop: 20}}>{userArray[0]?.email}</div>
          </div>
        </div>
        <div className="cashy-container">
          <div className="usercash">${userPortfolio.overall_value}</div>
          <div style={{fontSize: '13px', marginTop: 10}}>Total in Bootcamp Brokers</div>
        </div>
        <div className="investing-container">
          <div style={{fontSize: 24}}>Investing <FontAwesomeIcon style={{fontSize: 16}} icon={faCircleInfo} /> </div>
          <hr style={{marginBottom: 20}} />
            <div className="holdings-container">
              <div className="profile-investments">
                <div>Total Investing Value </div>
                <span style={{fontWeight: 'bold'}}>${userPortfolio.overall_value}</span>
              </div>
              <div className="profile-holdings">
                <div style={{color: "rgb(106, 114, 120)"}}>Brokerage Holdings </div>
                <span style={{color: "rgb(106, 114, 120)"}}>${userPortfolio.total_stock_value}</span>
              </div>
              <div className="profile-holdings">
                <div style={{color: "rgb(106, 114, 120)"}}>Brokerage Cash </div>
                <span style={{color: "rgb(106, 114, 120)"}}>{userPortfolio.cash_balance}</span>
              </div>
            </div>
        </div>
        <p className="disclaimer-container">
        DISCLAIMER: The information provided on the Bootcamp Brokers website is intended for general information and educational purposes only. It is not intended as financial or investment advice and should not be construed or relied on as such. Before making any investment decisions, you should seek advice from an independent financial advisor who can take into account your individual circumstances and investment objectives.

        While we make every effort to ensure that the information provided on this website is accurate and up-to-date, we cannot guarantee its accuracy, completeness, or timeliness. We do not accept any liability for any loss or damage caused by reliance on the information provided on this website.

        The past performance of any investment or trading strategy is not necessarily indicative of future results. You should be aware of the risks involved in trading or investing and carefully consider whether such trading or investing is suitable for you in light of your financial condition and investment objectives.

        Bootcamp Brokers is not responsible for the content of external websites linked to from this website. But we are responsible for all of your profits.
        </p>
      </div>
    </>

  )
}
