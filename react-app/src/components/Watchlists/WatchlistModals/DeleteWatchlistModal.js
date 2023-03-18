import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { thunkDeleteWatchlistById } from '../../../store/watchlist'
import './watchlistModal.css'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function DeleteWatchlistModal({ watchlist, watchlistId }) {
  const watchlistName = watchlist.list_name
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const navigate = useNavigate()

  const handleDeleteClick = async () => {
    if (watchlist.id === +watchlistId) {
      await dispatch(thunkDeleteWatchlistById(watchlist.id)).then(() => closeModal()).then(() => navigate('/home'));
    } else {
      await dispatch(thunkDeleteWatchlistById(watchlist.id)).then(() => closeModal());
    }
  }


  return (
    <div className='delete-list-modal-container'>
      <div className='delete-list-modal-title-exit'>
        <div className='delete-list-modal-title'>{`Are you sure you want to delete "${watchlistName}"?`}</div>
        <FontAwesomeIcon icon={faXmark} onClick={closeModal}/>
      </div>
        <button className='delete-list-modal-button' onClick={handleDeleteClick}>{`Delete ${watchlistName}`}</button>
    </div>
  )
}

export default DeleteWatchlistModal
