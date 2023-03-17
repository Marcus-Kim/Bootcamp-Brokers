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
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

function Watchlists({ watchlists, activeWatchlistId }) {
  // *ENABLERS
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const componentRef = useRef();
  const location = useLocation()
  // *USE SELECTORS
  const user = useSelector(state => state.session.user.id)

  // *STATE
  const [showForm, setShowForm] = useState(false);
  const [listName, setListName] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showList, setShowList] = useState(false);

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
    console.log(e.target.nextElementSibling)
    // close any other dropdowns
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
            <div className='watchlist-item-home' onClick={e => navigate(`/watchlists/${watchlist.id}`)} key={watchlist.id}>
              <div className='watchlist-item-name-home' >{watchlist.list_name}</div>
              <button className='watchlist-edit-button-home'>
                Edit
              </button>
              <div className='watchlist-list-edit-dropdown-home' onClick={e => stopPropagation(e)}>
                {showList && watchlist.tickers.map(ticker => {
                  return (
                    <div>Hello</div>
                  )
                })}
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
