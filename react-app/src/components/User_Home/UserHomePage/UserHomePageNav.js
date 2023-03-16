import React, {useState, useEffect} from 'react'
import logo from './logo.png'
import { NavLink } from 'react-router-dom'
import './UserHomePage.css'
import UserHomePage from './UserHomePage'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSmile} from '@fortawesome/free-solid-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../../store/session'


export default function UserHomePageNav() {
    const [searchValue, setSearchValue] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.session)
    const userArray = Object.values(user)
    

    const [dropdownVisible, setDropdownVisible] = useState(false)

    useEffect(() => {
        if (userArray[0] === null) {
          navigate('/')
        } else {
          navigate('/home')
        }
      }, [])

    const handleLogout = async () => {
        dispatch(logout()).then(navigate("/loggedout"))
        
    }


    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const hideDropdown = () => {
        setDropdownVisible(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/stocks/${searchValue}`)
    }

    return (
        <div className="home-container">
            <div style={{marginBottom: '30px'}} className="homepage-navigationcontainer">
                <NavLink to="/home">
                <img className='logo' src={logo} alt="logo" />
                </NavLink>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                    className="searching"
                    type="text" 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    />
                </form>
                
                
                <span className="homepage-rightcontainer">
                    <NavLink className="home-nav">Rewards</NavLink>
                    <NavLink className="home-nav">Investing</NavLink>
                    <NavLink className="home-nav">Spending</NavLink>
                    <NavLink className="home-nav">Retirement</NavLink>
                    <NavLink className="home-nav">Notifications</NavLink>
                    <div className="dropdown-container">
                        <NavLink style={{borderStyle: 'none', backgroundColor: 'white', padding: 'none'}} onClick={toggleDropdown} className="home-nav account">Account</NavLink>
                        {dropdownVisible && (
                            <div className="dropdown-menu" onClick={hideDropdown}>
                                <div className="dropper">
                                    <div className="dropdown-nav">{userArray[0].username}</div>
                                    <div style={{width: '93%'}}>
                                    <hr style={{borderColor: 'light gray'}} />
                                    </div>
                                    <NavLink to="/profile" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faSmile}/> Profile</NavLink>
                                    <NavLink to="/investing" className="dropdown-nav"><FontAwesomeIcon className="dropdown-hand" icon={faHandHoldingDollar} />Investing</NavLink>
                                    <NavLink to="/history" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faClockRotateLeft} />History</NavLink>
                                    <NavLink className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faPhone}/> Support</NavLink>
                                    <button 
                                    onClick={handleLogout}
                                    className="dropdown-logout"><FontAwesomeIcon className="dropdown-icon" icon={faArrowRightFromBracket}/>
                                    Logout
                                    </button>
                                </div>
                                
                            </div>
                        )}
                    </div>
                </span>
            </div>
            <UserHomePage/>
        </div>
    )
}
