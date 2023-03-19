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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newErrors, setErrors] = useState([])

  if (sessionUser) navigate("/home")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, email, password));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  useEffect(() => {
    const newErrors = [
      "You must have a name with more than 2 characters",
      "Email must be a valid email",
      "Email must have at least 4 characters and be no more than 30 characters",
      "Password is required",
      "Confirm Password is required"
    ]
    

      if (username.length > 2) newErrors.splice(newErrors.indexOf("You must have a name with more than 2 characters"), 1)
      if (email.length > 4) newErrors.splice(newErrors.indexOf("Email must have at least 4 characters and be no more than 30 characters"), 1)
      if (email.includes('@') || email.includes('.com')) newErrors.splice(newErrors.indexOf("Email must be a valid email"), 1)
      if (password.length > 0) newErrors.splice(newErrors.indexOf("Password is required"), 1)
      if (confirmPassword.length > 0) newErrors.splice(newErrors.indexOf("Confirm Password is required"), 1)

      setErrors(newErrors)

  }, [username, email, password, confirmPassword])
    
  

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
          {newErrors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div >

          </div>
            <span>
            <input 
                className="signup-email"
                type="text" 
                placeholder="User Name"
                value={username}
                onChange={(e => setUsername(e.target.value))}
                required
                />
            </span>
            <div>
                <input 
                className="signup-email"
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e => setEmail(e.target.value))}
                required
                />
            </div>

            <div>
                <input 
                className="signup-email"
                type="password" 
                placeholder="Password (min. 10 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            <div>
                <input 
                className="signup-email"
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>
            
            <div className="already-started">
            <p>Already started?</p>
            <NavLink to="/login" style={{fontWeight: 'bold'}}>Log in to complete your application</NavLink>
            </div>
            <div>
            <button disabled={newErrors.length > 0} type="submit" className="submit-signup">Continue</button>
            </div>
            

        </form>
      </div>
    </div>
    </>
  )
}
