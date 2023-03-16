import './stockPageModal.css'
import { useState } from 'react'



function AddToWatchlistModal({ ticker, watchlists }) {
  const watchlistArray = Object.values(watchlists)
  const [listValues, setListValues] = useState([])


  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('Hello',listValues)
  }

  const handleCheckboxChange = (e, watchlist) => {

  }

  return (
    <div className="add-watchlist-modal-container">
      <div className="add-watchlist-modal-title-exit">
        <div className='add-watchlist-modal-title'>{`Add ${ticker} to Your Lists`}</div>
        <div className='add-watchlist-modal-exit'>X</div>
      </div>
      <form className='add-watchlist-modal-form' onSubmit={handleSubmit}>
        <div className='add-watchlist-modal-lists'>
          {watchlistArray.map(watchlist => {
            return (
              <label>
                <input type='checkbox' value={listValues} onChange={e => handleCheckboxChange((e, watchlist))}/>
                {watchlist.list_name}
              </label>
            )
          })}
        </div>
        <button type='submit' className='add-watchlist-submit-button'>Save Changes</button>
      </form>

    </div>
  )
}

export default AddToWatchlistModal;
