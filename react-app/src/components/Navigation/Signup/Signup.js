import React, {useState, useEffect} from 'react'
import Chart from './darkgreenchart.PNG'
import './Signup.css'
import { useMenu } from '../../../context/MenuContext'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '../../../store/session'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const sessionUser = useSelector((state) => state.session.user)

  const [name, setName] = useState("")
  const { menuOpen } = useMenu()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState([])

  // if (sessionUser) navigate("/home")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      await dispatch(signUp(name, email, password)).then(navigate("/home"));
      } 
      
  };

  useEffect(() => {
    const errors = [
      "You must have a name with more than 2 characters",
      "Email must be a valid email",
      "Email must have at least 4 characters and be no more than 30 characters",
      "Password is required",
      "Confirm Password is required"
    ]

      if (name.length > 2) errors.splice(errors.indexOf("You must have a name with more than 2 characters"), 1)
      if (email.length > 4) errors.splice(errors.indexOf("Email must have at least 4 characters and be no more than 30 characters"), 1)
      if (email.includes('@') || email.includes('.com')) errors.splice(errors.indexOf("Email must be a valid email"), 1)
      if (password.length > 0) errors.splice(errors.indexOf("Password is required"), 1)
      if (confirmPassword.length > 0) errors.splice(errors.indexOf("Confirm Password is required"), 1)

      setErrors(errors)

  }, [name, email, password, confirmPassword])
    
  

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
        <h3>Enter your information as they appear on your government ID</h3>
        <form className='signup-form' onSubmit={handleSubmit} action="">
          <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div >

          </div>
            <span>
            <input 
                className="signup-email"
                type="text" 
                placeholder="Full Name"
                value={name}
                onChange={(e => setName(e.target.value))}
                />
            </span>
            <div>
                <input 
                className="signup-email"
                type="email" 
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

            <div>
                <input 
                className="signup-email"
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            
            <div className="already-started">
            <p>Already started?</p>
            <NavLink to="/login" style={{fontWeight: 'bold'}}>Log in to complete your application</NavLink>
            </div>
            <div>
            <button type="submit" className="submit-signup">Continue</button>
            </div>
            

        </form>
      </div>
    </div>
    </>
  )
}
