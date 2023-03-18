import './stockPageModal.css'
import { useState } from 'react'
import { thunkAddWatchlistStock } from '../../../../store/watchlist'
import { useDispatch } from 'react-redux'
import { useModal } from '../../../../context/Modal'

function AddToWatchlistModal({ ticker, watchlists }) {
  const watchlistArray = Object.values(watchlists) // Array of watchlists
  const filteredWatchlistArray = watchlistArray?.filter(watchlist => !(watchlist.tickers?.includes(ticker)))
  const [listValues, setListValues] = useState([]) // Array of watchlist IDs
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  if (!watchlistArray.length) return null;

  const handleSubmit = async (e) => {
    e.preventDefault()

    const promises = listValues.map(async (list) => {
      await dispatch(thunkAddWatchlistStock(Number(list), ticker))
    })
    await Promise.all(promises).then(closeModal())
  }

  const handleCheckboxChange = (e, watchlist) => {
    if (e.target.checked) { // If the id is in the array
      setListValues([...listValues, watchlist.id]);
    } else {
      setListValues(listValues.filter((id) => id !== watchlist.id));
    }
  };

  return (
    <div className="add-watchlist-modal-container">
      <div className="add-watchlist-modal-title-exit">
        <div className='add-watchlist-modal-title'>{`Add ${ticker} to Your Lists`}</div>
        <div className='add-watchlist-modal-exit' onClick={() => closeModal()}>X</div>
      </div>
      <form className='add-watchlist-modal-form' onSubmit={handleSubmit}>
        <div className='add-watchlist-modal-lists'>
          {filteredWatchlistArray.map(watchlist => {
            return (
              <div className='watchlist-lists' key={watchlist.id}>
                <input
                  type='checkbox'
                  className='input-div'
                  checked={listValues.includes(watchlist.id)}
                  onChange={e => handleCheckboxChange(e, watchlist)}
                  />
                {watchlist.list_name}
              </div>
            )
          })}
        </div>
        <button type='submit' className='add-watchlist-submit-button'>Save Changes</button>
      </form>

    </div>
  )
}

export default AddToWatchlistModal;
