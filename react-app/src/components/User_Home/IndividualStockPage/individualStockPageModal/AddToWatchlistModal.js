import './stockPageModal.css'
import { useState } from 'react'
import { thunkAddWatchlistStock } from '../../../../store/watchlist'
import { useDispatch } from 'react-redux'
import { useModal } from '../../../../context/Modal'

function AddToWatchlistModal({ ticker, watchlists }) {
  const watchlistArray = Object.values(watchlists)
  const [listValues, setListValues] = useState([]) // Array of watchlist IDs
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  console.log(listValues)

  const handleSubmit = async (e) => {
    e.preventDefault()

    listValues.forEach(async (list) => {
      console.log(list)
      await dispatch(thunkAddWatchlistStock(Number(list), ticker))
    })
    // await Promise.all(promises)
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
        <div className='add-watchlist-modal-exit'>X</div>
      </div>
      <form className='add-watchlist-modal-form' onSubmit={handleSubmit}>
        <div className='add-watchlist-modal-lists'>
          {watchlistArray.map(watchlist => {
            return (
              <label>
                <input type='checkbox' checked={listValues.includes(watchlist.id)} onChange={e => handleCheckboxChange(e, watchlist)}/>
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
