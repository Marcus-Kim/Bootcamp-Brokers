import React, {useState, useEffect} from 'react'
import Chart from './darkgreenchart.PNG'
import './Signup.css'
import { useMenu } from '../../../context/MenuContext'
import { NavLink } from 'react-router-dom'

export default function Signup() {
  const [firstName, setFirstName] = useState("")  
  const [lastName, setLastName] = useState("")
  const { menuOpen } = useMenu()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  return (
    <>
    <div className={'signup-container' + (menuOpen ? ' hidden' : "")}>
      <div className = "left-signup">
          <div className='signup-top-left' style={{marginLeft: '5%'}}>
            <h3 className="signup-logo">Bootcamp Brokers</h3>
            <h1 className="h1-invest">Invest with zero commission fees.</h1>
            <p style={{color: 'rgb(195,245,60)'}}>Plus, request 24/7 Live Support right from the app.</p>
            <p style={{color: 'rgb(195,245,60)', textDecoration: 'underline'}}>Investing and Fee Disclosures</p>
          </div>
          <img className="darkgreen-chart" src={Chart} alt="" />
      </div>
      <div className = "right-signup">
        <h3>Enter Your first and last name as they appear on your government ID.</h3>
        <form className='signup-form' action="">
          <div >

          </div>
            <span>
            <input
                className="first-last" 
                type="text" 
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            <input 
                className="first-last" 
                style={{marginLeft: 10}}
                type="text" 
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            </span>
            <div>
                <input 
                className="signup-email"
                type="text" 
                placeholder="Email address"
                value={email}
                onChange={(e => setEmail(e.target.value))}
                />
            </div>

            <div>
                <input 
                className="signup-email"
                type="password" 
                placeholder="Password (min. 10 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <div className="already-started">
            <p>Already started?</p>
            <NavLink to="/login" style={{fontWeight: 'bold'}}>Log in to complete your application</NavLink>
            </div>
            <div>
            <button className="submit-signup">Continue</button>
            </div>
            

        </form>
      </div>
    </div>
    </>
  )
}
