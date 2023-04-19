import React, {useState, useEffect} from 'react'
import logo from './logo.png'
import { NavLink } from 'react-router-dom'


import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSmile} from '@fortawesome/free-solid-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../../../store/session'
import { thunkGetStockDaily } from '../../../../store/stock'


export default function UserNav() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.session)
    const userArray = Object.values(user)
    const [searchValue, setSearchValue] = useState("")
    const [placeholder, setPlaceholder] = useState("Search...")
    const [matchedTickers, setMatchedTickers] = useState([]);

    const allTickers = [
    'TSLA', 'AAPL', 'AMZN', 
    'GOOG', 'CRM', 'AMD', 
    'NVDA', 'KO', 'BBY', 
    'IBM', 'CRSP', 'COIN',
    'HOOD', 'MSFT', 'AI', 
    'LULU', 'NKE', 'GME', 
    'AMC', 'BBBY', 'BB', 
    'T', 'SPY', 'QQQ', 
    'BEAM', 'APLS', 'CRBU', 
    'VRTX'
  ]


    

    const [dropdownVisible, setDropdownVisible] = useState(false)


    const searchTickers = (userSearch) => {
        if (!userSearch) {
            return []
        }
        const matches = [];
        for (let i = 0; i < allTickers.length; i++) {
          const ticker = allTickers[i];
          if (ticker.startsWith(userSearch.toUpperCase())) {
            matches.push(ticker);
          }
        }
        return matches;
    };

    useEffect(() => {
        const userSearch = searchValue.trim()
        
        if (!userSearch) {
            setMatchedTickers([])
        }
        const matchedTickers = searchTickers(userSearch)
        setMatchedTickers(matchedTickers)
    }, [searchValue])

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
        const userSearch = searchValue.trim()
        if (userSearch === '') { // check if searchValue is empty
            setMatchedTickers([])
        } else {
            const matches = searchTickers(userSearch)
            setMatchedTickers(matches)
            navigate(`/stocks/${searchValue.toUpperCase()}`)
        }
    }

    const comingSoon = (e) => {
        e.preventDefault()
        alert('Coming Soon...')
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
                    placeholder={placeholder}
                    />

                    {matchedTickers.length > 0 && (
                                <div className="suggestions-container">
                                {matchedTickers.map((ticker) => (
                                    <div
                                    key={ticker}
                                    className="suggestions"
                                    onClick={() => navigate(`/stocks/${ticker}`)}
                                    >
                                    {ticker}
                                    </div>
                                ))}
                                </div>
                            )}
                </form>

                <span className="homepage-rightcontainer">
                    {/* <NavLink
                        className="home-nav"
                        onClick={comingSoon}
                    >
                        Rewards
                    </NavLink> */}
                    <NavLink
                        to='/home'
                        className="home-nav">

                        Investing
                        </NavLink>
                    {/* <NavLink
                        className="home-nav"
                        onClick={comingSoon}
                    >
                        Spending
                    </NavLink> */}
                    {/* <NavLink
                        className="home-nav"
                        onClick={comingSoon}
                    >
                        Retirement
                    </NavLink> */}
                    <NavLink
                        className="home-nav"
                        onClick={comingSoon}
                    >
                        Notifications
                    </NavLink>
                    <div className="dropdown-container">
                        <NavLink style={{borderStyle: 'none', backgroundColor: 'white', padding: 'none'}} onClick={toggleDropdown} className="home-nav">Account</NavLink>
                        {dropdownVisible && (
                            <div className="dropdown-menu" onClick={hideDropdown}>
                                <div className="dropper">
                                    <div className="dropdown-nav">{userArray[0].username}</div>
                                    <div style={{width: '93%'}}>
                                    <hr style={{borderColor: 'light gray'}} />
                                    </div>
                                    <NavLink to="/profile" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faSmile}/> Profile</NavLink>
                                    <NavLink to="/home" className="dropdown-nav"><FontAwesomeIcon className="dropdown-hand" icon={faHandHoldingDollar} />Investing</NavLink>
                                    <NavLink to="/history" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faClockRotateLeft} />History</NavLink>
                                    {/* <NavLink className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faPhone}/> Support</NavLink> */}
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
        </div>
    )
}
