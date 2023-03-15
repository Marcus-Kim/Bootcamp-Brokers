import './watchlists.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { thunkCreateWatchlist } from '../../store/watchlist';
import { useDispatch, useSelector } from 'react-redux';

function Watchlists({ watchlists }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const watchlistArray = Object.values(watchlists)
  const [showForm, setShowForm] = useState(false);
  const [listName, setListName] = useState('');
  const user = useSelector(state => state.session.user.id)

  if (!user) return null

  const handleEditClick = (e) => { // Edit a list
    e.stopPropagation();
    //TODO Add functionality for renaming/deleting [BONUS]: Rearranging lists.
  }

  const handleCreateList = (e) => { // Create list handler
    e.preventDefault()

    const newWatchlist = {
      user_id: user,
      list_name: listName
    }

    dispatch(thunkCreateWatchlist(newWatchlist))
  }

  return (
    <div className='watchlists-container'>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button' onClick={e => setShowForm(!showForm)}>+</button>
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
              <button className='watchlist-edit-button' onClick={e => handleEditClick(e)}>Edit</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Watchlists
