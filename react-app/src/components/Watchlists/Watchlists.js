import './watchlists.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

function Watchlists({ watchlists }) {
  const navigate = useNavigate();

  const watchlistArray = Object.values(watchlists)
  const [showForm, setShowForm] = useState(false)

  const handleEditClick = (e) => {
    e.stopPropagation();
    //TODO Add functionality for renaming/deleting [BONUS]: Rearranging lists.
  }

  return (
    <div className='watchlists-container'>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button' onClick={e => setShowForm(!showForm)}>+</button>
      </div>
      {showForm && <form className='create-watchlist-form'>
        <div className='create-watchlist-form-name'>
          <input className='create-watchlist-input-name' placeholder='List Name'/>
        </div>
        <div className='create-watchlist-form-buttons'>
          <button className='create-watchlist-cancel-button'>Cancel</button>
          <button className='create-watchlist-create-button'>Create List</button>
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
