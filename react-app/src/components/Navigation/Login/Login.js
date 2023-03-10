import React, {useState, useEffect} from 'react'
import LoginPicture from './jason.png'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useMenu } from '../../../context/MenuContext'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { menuOpen } = useMenu()


  return (
    <div className={'login-container' + (menuOpen ? ' hidden' : '')}>
        <img className='left-loginpicture' src={LoginPicture} alt="" />
        
        <div className='login-rightcontainer'>
            <div style={{marginLeft: '5%'}}>
            <h2 style={{fontFamily: 'Montserrat'}}>Log in to Bootcamp Brokers</h2>
            <form >
                <label 
                style={{display: 'block', fontFamily: 'sans-serif', fontSize: '13px', marginBottom: '10px'}} 
                htmlFor="email"
                >
                Email
                </label>

                <input 
                className="login-input"
                type="text" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <label 
                style={{display: 'block', fontFamily: 'sans-serif', fontSize: '13px', marginBottom: '10px', marginTop: '10px'}}
                htmlFor="password"
                >
                Password
                </label>

                <input 
                className="login-input"
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <label 
                style={{display: 'block', marginTop: '10px'}} 
                htmlFor="">
                <input style={{marginRight: 10}} type="checkbox" />    
                Keep me logged in for up to 30 days
                </label>

                <button className="login-button">Log In</button>
                
                <button style={{marginLeft: '30px'}} onClick={() => navigate("/home")} className="login-button">Demo User</button>

            
                <div>Not on Bootcamp Brokers? <NavLink to="/signup">Create an account</NavLink> </div>
            </form>

            </div>
        </div>   
     </div>   
  )
}
