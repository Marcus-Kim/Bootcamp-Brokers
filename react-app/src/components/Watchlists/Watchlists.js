import './watchlists.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { thunkCreateWatchlist } from '../../store/watchlist';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import WatchlistModalButton from './WatchlistModals/WatchlistModal';
import RenameWatchlistModal from './WatchlistModals/RenameWatchlistModal';
import DeleteWatchlistModal from './WatchlistModals/DeleteWatchlistModal';

function Watchlists({ watchlists }) {
  // *ENABLERS
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const componentRef = useRef();

  // *USE SELECTORS
  const user = useSelector(state => state.session.user.id)

  // *STATE
  const [showForm, setShowForm] = useState(false);
  const [listName, setListName] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null)

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
    if (openDropdown && openDropdown !== e.target) {
      openDropdown.nextElementSibling.classList.remove('showModal')
    }

    e.target.nextElementSibling.classList.toggle('showModal')
    setOpenDropdown(e.target)
  };

  const stopPropagation = (e) => {
    e.stopPropagation()
  }


  return (
    <div className='watchlists-container' ref={componentRef}>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button' onClick={e => handleCreateListToggle(e)}>+</button>
      </div>
      {showForm && <form className='create-watchlist-form' onSubmit={e => handleCreateList(e)}>
        <div className='create-watchlist-form-name'>
          <input className='create-watchlist-input-name' value={listName} placeholder='List Name' required onChange={e => setListName(e.target.value)}/>
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
              <button className='watchlist-edit-button' onClick={e => handleDropdown(e)}>Edit</button>
              <div className='watchlist-list-edit-dropdown' onClick={e => stopPropagation(e)}>
                <WatchlistModalButton modalComponent={<RenameWatchlistModal watchlist={watchlist}/>} buttonText={'Edit List'}/>
                <WatchlistModalButton modalComponent={<DeleteWatchlistModal watchlist={watchlist}/>}  buttonText={'Delete List'}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Watchlists
