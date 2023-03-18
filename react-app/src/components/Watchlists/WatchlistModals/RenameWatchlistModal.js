import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './watchlistModal.css'
import { thunkUpdateWatchlist } from '../../../store/watchlist'
import { useModal } from '../../../context/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function RenameWatchlistModal({ watchlist, watchlistArray }) {
  const [newName, setNewName] = useState('')
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [errors, setErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => { // Validations
    const error = [];

    // If the list name already exists
    // If the new name is the same as the old name?
    for (let watchlist of watchlistArray) {
      if (watchlist.list_name.toLowerCase() === newName.toLowerCase()) {
        error.push('List name must be unique')
      }
    }
    setErrors(error);

  }, [newName])

  useEffect(() => {
    setNewName(watchlist.list_name)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (errors.length) return

    const updatedWatchlist = {
      id: watchlist.id,
      list_name: newName
    }

    const result = await dispatch(thunkUpdateWatchlist(updatedWatchlist))

    if (result) {
      setHasSubmitted(false)
      closeModal()
    }
  }

  return (
    <div className='rename-list-modal-container'>
      <div className='rename-list-modal-title-exit'>
        <div className='rename-list-modal-title'>Edit List</div>
        <FontAwesomeIcon icon={faXmark} className='rename-list-modal-exit-button' onClick={closeModal}/>
      </div>
      {!!hasSubmitted && errors.length > 0 && <div className='rename-list-modal-error'>{errors[0]}</div>}
      <form className='rename-list-modal-form' onSubmit={handleSubmit}>
        <input type='text' placeholder='List Name' className='rename-list-modal-input' value={newName} onChange={e => setNewName(e.target.value)} required maxLength={25}/>
        <button type='submit' className='rename-list-modal-submit-button'>Save</button>
      </form>
    </div>
  )
}

export default RenameWatchlistModal
