import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { thunkDeleteWatchlistById } from '../../../store/watchlist'
import './watchlistModal.css'


function DeleteWatchlistModal({ watchlist, activeWatchlistId }) {
  const watchlistName = watchlist.list_name
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const navigate = useNavigate()

  const handleDeleteClick = async () => {
    if (watchlist.id === activeWatchlistId) {
      await dispatch(thunkDeleteWatchlistById(watchlist.id)).then(closeModal()).then(navigate('/home'));
    } else {
      await dispatch(thunkDeleteWatchlistById(watchlist.id)).then(closeModal());
    }
  }


  return (
    <div className='delete-list-modal-container'>
      <div className='delete-list-modal-title-exit'>
        <div className='delete-list-modal-title'>{`Are you sure you want to delete "${watchlistName}"?`}</div>
        <button onClick={handleDeleteClick}>{`Delete ${watchlistName}`}</button>
      </div>

    </div>
  )
}

export default DeleteWatchlistModal
