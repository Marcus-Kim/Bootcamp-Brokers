import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import "./Navigation.css"
import logo from './logo.png'
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';
import { useSelector } from 'react-redux';

export default function Navigation() {
  const navigate = useNavigate()
  const { menuOpen, setMenuOpen } = useMenu()
  const user = useSelector(state => state.session.user)

  const menuClick = (e) => {
    e.preventDefault();
    setMenuOpen(prev => !prev)
  }

  const comingSoon = (e) => {
    e.preventDefault()
    alert('Coming Soon...')
  }
  
  if (user) return null
  
  return (
    <div className="navigation-container">
      <div className='nav-link'>
          <div className='leftside-nav'>
          <div>
            <NavLink to="/" className="name-logo-div" style={{fontSize: 20, textDecoration: 'none'}}>
              <div>Bootcamp Brokers</div>
              <img className='logo' src={logo} alt="logo" />
            </NavLink>
          </div>
          <span className="past-vertical">
            <NavLink
              className="nav-font"
              onClick={comingSoon}
            >
              What We Offer
            </NavLink>
            <NavLink
              className="nav-font"
              onClick={comingSoon}
            >
              Learn
            </NavLink>
            <NavLink
              className="nav-font"
              onClick={comingSoon}
            >
              Snacks
            </NavLink>
          </span>
          </div>
          <div className="rightside-nav">
            <span>
                <button
                  className='right-sidebuttons'
                  id="login"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className='right-sidebuttons'
                  id="signup"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
            </span>
            <button
              className={'burger' + (menuOpen ? ' active' : '')}
              onClick={menuClick}
            >
            </button>
          </div>
      </div>
      <div className={'dropdown' + (!menuOpen ? ' hidden' : '')}>
        <Link onClick={comingSoon}>Invest</Link>
        <Link onClick={comingSoon}>Learn</Link>
        <Link onClick={comingSoon}>Snacks</Link>
        <Link onClick={comingSoon}>Support</Link>
      </div>
    </div>
    )
}
