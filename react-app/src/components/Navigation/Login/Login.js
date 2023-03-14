import React, {useState, useEffect} from 'react'
import LoginPicture from './jason.png'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useMenu } from '../../../context/MenuContext'
import { useDispatch } from 'react-redux'
import { login } from '../../../store/session'
import { ErrorResponse } from '@remix-run/router'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState([])
  const { menuOpen } = useMenu()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await dispatch(login(email, password));
    if (data) {
        setErrors(data)
    }
    
    
    navigate("/home")
  }

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    const demoEmail = "demo@aa.io"
    const demoPassword = "password"
    const data = await dispatch(login(demoEmail, demoPassword))
    navigate("/home")
  }

  useEffect(() => {
    const errors = [
        "Email must have at least 4 characters and be no more than 30 characters",
        "Email must be a valid email",
        "Password is required"
    ]

    if (email.length > 4) errors.splice(errors.indexOf("Email must have at least 4 characters and be no more than 30 characters"), 1)
    if (email.includes('@') || email.includes('.com')) errors.splice(errors.indexOf("Email must be a valid email"), 1)
    if (password.length > 0) errors.splice(errors.indexOf("Password is required"), 1)

    setErrors(errors)

  }, [email, password])


  return (
    <div className={'login-container' + (menuOpen ? ' hidden' : '')}>
        <img className='left-loginpicture' src={LoginPicture} alt="" />
        
        <div className='login-rightcontainer'>
            <div style={{marginLeft: '5%'}}>
            <h2 style={{fontFamily: 'Montserrat'}}>Log in to Bootcamp Brokers</h2>
            <ul>
            {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
            </ul>
            <form onSubmit={handleSubmit} >
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

                <button  disabled={errors.length > 0} type="submit" className="login-button">Log In</button>
                
                <button style={{marginLeft: '30px'}} onClick={handleDemoSubmit} className="login-button">Demo User</button>

            
                <div>Not on Bootcamp Brokers? <NavLink to="/signup">Create an account</NavLink> </div>
            </form>

            </div>
        </div>   
     </div>   
  )
}
