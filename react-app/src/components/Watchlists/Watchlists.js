import './watchlists.css';
import './watchlistsHome.css';
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { thunkCreateWatchlist } from '../../store/watchlist';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import WatchlistModalButton from './WatchlistModals/WatchlistModal';
import RenameWatchlistModal from './WatchlistModals/RenameWatchlistModal';
import DeleteWatchlistModal from './WatchlistModals/DeleteWatchlistModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useFinanceAPI } from '../../context/FinanceApiContext';
import WatchlistChart from './WatchlistChart';

function Watchlists({ watchlists, activeWatchlistId }) {
  // *ENABLERS
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const componentRef = useRef();
  const location = useLocation()
  const { markusKim } = useFinanceAPI()
  // *USE SELECTORS
  const user = useSelector(state => state.session.user.id)

  // *STATE
  const [showForm, setShowForm] = useState(false);
  const [listName, setListName] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showList, setShowList] = useState(false);
  const [openedLists, setOpenedLists] = useState({});


  // *USE_EFFECTS
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (componentRef.current && !componentRef.current.contains(e.target)) {
        if (openDropdown) {
          openDropdown.nextElementSibling.classList.remove('showModal');
          setOpenDropdown(null);
        }
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [componentRef, openDropdown]);

  // *FIRST RENDER
  if (!user) return null // If no user

  // *VARIABLES
  const watchlistArray = Object.values(watchlists)
  // *HANDLERS
  const handleCreateList = async (e) => { // Create list handler
    e.preventDefault()

    const newWatchlist = {
      user_id: user,
      list_name: listName
    }

    const created = await dispatch(thunkCreateWatchlist(newWatchlist))
    if (created) {
      setShowForm(!showForm);
      setListName('');
    }
  }

  const handleCreateListToggle = (e) => { // Form toggle handler
    e.preventDefault();
    setShowForm(!showForm);
    setListName('');
    return
  }

  const handleDropdown = (e) => { // Edit menu dropdown toggle handler
    e.stopPropagation();
    // close any other dropdowns
    console.log(openDropdown.nextElementSibling.classList)
    if (openDropdown && openDropdown !== e.target) {
      openDropdown.nextElementSibling.classList.remove('showModal')
    }

    // toggle current dropdown
    e.target.nextElementSibling.classList.toggle('showModal')

    // update openDropdown state
    setOpenDropdown(openDropdown === e.target ? null : e.target)
  };

  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  const handleListToggle = (watchlistId) => {
    setOpenedLists((prevState) => ({
      ...prevState,
      [watchlistId]: !prevState[watchlistId]
    }));
  };

  const handleListStockClick = (e, ticker) => {
    e.stopPropagation();

    navigate(`/stocks/${ticker}`)
  }

  if (location.pathname === '/home') {
    return (
      <div className='watchlists-container-home' ref={componentRef}>
      <div className='watchlists-header-home'>
        <div className='watchlists-title-home'>Lists</div>
        <button className='add-watchlist-button-home' onClick={e => handleCreateListToggle(e)}>+</button>
      </div>
      {showForm && <form className='create-watchlist-form-home' onSubmit={e => handleCreateList(e)}>
        <div className='create-watchlist-form-name-home'>
          <input className='create-watchlist-input-name-home' value={listName} placeholder='List Name' required onChange={e => setListName(e.target.value)} maxLength={30}/>
        </div>
        <div className='create-watchlist-form-buttons-home'>
          <button className='create-watchlist-cancel-button-home' onClick={e => setShowForm(false)}>Cancel</button>
          <button type='submit' className='create-watchlist-create-button-home'>Create List</button>
        </div>
      </form>}
      <div className='watchlists-list-home'>
        {watchlistArray.map(watchlist => {
          return(
            <div key={watchlist.id}>
              <div className='watchlist-item-home' onClick={e => navigate(`/watchlists/${watchlist.id}`)} key={watchlist.id}>
                <div className='watchlist-item-name-home' >{watchlist.list_name}</div>
                <FontAwesomeIcon
                  className='watchlist-edit-button-home'
                  icon={faAngleDown}
                  onClick={(e) => {
                    stopPropagation(e);
                    handleListToggle(watchlist.id);
                  }}
                />
                <div className='watchlist-list-edit-dropdown-home' onClick={e => stopPropagation(e)}></div>
              </div>
              <div>
              {
                openedLists[watchlist.id] &&
                  (watchlist.tickers && watchlist.tickers.length > 0 ? (
                    watchlist.tickers.map((ticker) => {
                      const stockData = markusKim[ticker];
                      if (!stockData) {
                        return null;
                      }
                      return (
                        <div className='watchlist-stock-container-home' key={ticker} onClick={e => handleListStockClick(e, ticker)}>
                          <div className='watchlist-stock-name-home'>{ticker}</div>
                          <div className="watchlist-graph-home">
                            {/* CHART GOES HERE */}
                            <WatchlistChart ticker={ticker}/>
                          </div>
                          <div className='watchlist-stock-price-daily-container'>
                            <div className='watchlist-stock-price-home'>
                              ${markusKim[ticker].dailyPrice.close}
                            </div>
                            <div className='watchlist-stock-daily-home'>
                              {markusKim[ticker].dailyPrice.percentageChange.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='empty-watchlist-container'>
                      <p className='empty-watchlist-container-message'>No tickers in this watchlist.</p>
                    </div>
                  ))
              }
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
  } else {
    return (
    <div className='watchlists-container' ref={componentRef}>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button' onClick={e => handleCreateListToggle(e)}>+</button>
      </div>
      {showForm && <form className='create-watchlist-form' onSubmit={e => handleCreateList(e)}>
        <div className='create-watchlist-form-name'>
          <input className='create-watchlist-input-name' value={listName} placeholder='List Name' required onChange={e => setListName(e.target.value)} maxLength={30}/>
        </div>
        <div className='create-watchlist-form-buttons'>
          <button className='create-watchlist-cancel-button' onClick={e => setShowForm(false)}>Cancel</button>
          <button type='submit' className='create-watchlist-create-button'>Create List</button>
        </div>
      </form>}
      <div className='watchlists-list'>
        {watchlistArray.map(watchlist => {
          return(
            <div className='watchlist-item' onClick={e => navigate(`/watchlists/${watchlist.id}`)} key={watchlist.id}>
              <div className='watchlist-item-name' >{watchlist.list_name}</div>
              <FontAwesomeIcon icon={faEllipsis} className='watchlist-edit-button' onClick={e => handleDropdown(e)}/>

              <div className='watchlist-list-edit-dropdown' onClick={e => stopPropagation(e)}>
                <WatchlistModalButton modalComponent={<RenameWatchlistModal watchlist={watchlist}/>} buttonText={'Edit List'}/>
                <WatchlistModalButton modalComponent={<DeleteWatchlistModal watchlist={watchlist} activeWatchlistId={activeWatchlistId}/>}  buttonText={'Delete List'}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
  }
}

export default Watchlists
