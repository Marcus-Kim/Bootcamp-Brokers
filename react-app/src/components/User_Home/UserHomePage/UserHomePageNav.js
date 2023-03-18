import React, { useState, useEffect } from 'react'
import logo from './logo.png'
import { NavLink } from 'react-router-dom'
import './UserHomePage.css'
import UserHomePage from './UserHomePage'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../../store/session'
import { thunkGetNasdaq } from '../../../store/stock';
import { thunkGetSPY } from '../../../store/stock';
import { thunkGetRandomStockNews } from '../../../store/stock'
import { thunkGetAllWatchlistsUserId } from '../../../store/watchlist';
import { thunkCreatePortfolioSnapshot, thunkGetPortfolioHistoricalValues, thunkGetPortfolioHoldings, thunkGetUserPortfolio } from '../../../store/portfolio';
import { thunkGetAll28Stocks } from "../../../store/stock";
import { thunkGetBTCPrice } from '../../../store/stock';


export default function UserHomePageNav({ setIsChatModalOpen }) {
    const [searchValue, setSearchValue] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state?.session)
    const userArray = Object.values(user)
    const userId = useSelector(state => state.session.user?.id)
    const [isLoaded, setIsLoaded] = useState(false)
    const stocks = useSelector(state => state.stocks.all28Stocks)
    const [matchedTickers, setMatchedTickers] = useState([])


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

    const comingSoon = (e) => {
        e.preventDefault()
        alert('Coming Soon...')
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const hideDropdown = () => {
        setDropdownVisible(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchValue === '') {
          setMatchedTickers([])
        } else {
          navigate(`/stocks/${searchValue}`)
        }
      }

    useEffect(() => {
        const fetchAsync = async () => {
            await dispatch(thunkGetBTCPrice());
            await dispatch(thunkGetNasdaq());
            await dispatch(thunkGetSPY());
            await dispatch(thunkGetRandomStockNews());
            await dispatch(thunkGetAllWatchlistsUserId(userId));
            await dispatch(thunkGetPortfolioHistoricalValues());
            await dispatch(thunkGetPortfolioHoldings());
            await dispatch(thunkGetUserPortfolio());
            await dispatch(thunkGetAllWatchlistsUserId(userId));
            await dispatch(thunkCreatePortfolioSnapshot());
            await dispatch(thunkGetAll28Stocks());
            setIsLoaded(true);
        };
        fetchAsync();
    }, [dispatch]);

    if (!stocks) return null

    return (
        <>
            {!isLoaded && (
            <div className="loading-container">
                <img src="https://media0.giphy.com/media/KG4PMQ0jyimywxNt8i/giphy.gif?cid=ecf05e47bpnr0mt98srhcmw3409sc0u0doju0lh87y0l534w&rid=giphy.gif&ct=g" alt="Loading..." />
            </div>
            )}

            {isLoaded && (
                <div className="home-container">
                    <div style={{ marginBottom: '30px' }} className="homepage-navigationcontainer">
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
                            <NavLink 
                                className="home-nav"
                                onClick={comingSoon}
                            >
                                Rewards
                            </NavLink>
                            <NavLink 
                                onClick={comingSoon}
                                className="home-nav">
                                
                                Investing
                                </NavLink>
                            <NavLink 
                                className="home-nav"
                                onClick={comingSoon}
                            >
                                Spending
                            </NavLink>
                            <NavLink 
                                className="home-nav"
                                onClick={comingSoon}
                            >
                                Retirement
                            </NavLink>
                            <NavLink 
                                className="home-nav"
                                onClick={comingSoon}
                            >
                                Notifications
                            </NavLink>
                            <div className="dropdown-container">
                                <NavLink style={{ borderStyle: 'none', backgroundColor: 'white', padding: 'none' }} onClick={toggleDropdown} className="home-nav account">Account</NavLink>
                                {dropdownVisible && (
                                    <div className="dropdown-menu" onClick={hideDropdown}>
                                        <div className="dropper">
                                            <div className="dropdown-nav">{userArray[0].username}</div>
                                            <div style={{ width: '93%' }}>
                                                <hr style={{ borderColor: 'light gray' }} />
                                            </div>
                                            <NavLink to="/profile" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faSmile} /> Profile</NavLink>
                                            <NavLink to="/home" className="dropdown-nav"><FontAwesomeIcon className="dropdown-hand" icon={faHandHoldingDollar} />Investing</NavLink>
                                            <NavLink to="/history" className="dropdown-nav"><FontAwesomeIcon className="dropdown-icon" icon={faClockRotateLeft} />History</NavLink>
                                            <NavLink 
                                                className="dropdown-nav"
                                                onClick={() => setIsChatModalOpen(true)}
                                            >
                                                <FontAwesomeIcon className="dropdown-icon" icon={faPhone} /> Support
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-logout"><FontAwesomeIcon className="dropdown-icon" icon={faArrowRightFromBracket} />
                                                Logout
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </span>
                    </div>
                    <UserHomePage />
                </div>
            )

            }


        </>
    )
}
