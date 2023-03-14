import React, {useState, useEffect} from 'react'
import logo from './logo.png'
import { NavLink } from 'react-router-dom'
import './UserHomePage.css'
import UserHomePage from './UserHomePage'
import { useSelector, useDispatch } from 'react-redux'

export default function UserHomePageNav() {
    

    return (
        <div className="home-container">
            <div style={{paddingTop: '67px', marginBottom: '30px'}} className="homepage-navigationcontainer">
                <div>
                <img className='logo' src={logo} alt="logo" />
                </div>
                
                <span className="homepage-rightcontainer">
                    <NavLink className="home-nav">Rewards</NavLink>
                    <NavLink className="home-nav">Investing</NavLink>
                    <NavLink className="home-nav">Spending</NavLink>
                    <NavLink className="home-nav">Retirement</NavLink>
                    <NavLink className="home-nav">Notifications</NavLink>
                    <NavLink className="home-nav">Account</NavLink>
                </span>
            </div>
            <UserHomePage/>
        </div>
    )
}
