import { useState } from 'react'
import { useDispatch } from 'react-redux'
import './watchlistModal.css'
import { thunkUpdateWatchlist } from '../../../store/watchlist'
import { useModal } from '../../../context/Modal'

function RenameWatchlistModal({ watchlist }) {
  const [newName, setNewName] = useState('')
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedWatchlist = {
      id: watchlist.id,
      list_name: newName
    }

    const result = await dispatch(thunkUpdateWatchlist(updatedWatchlist))

    if (result) {
      closeModal()
    }
  }
  return (
    <div className='rename-list-modal-container'>
      <div className='rename-list-modal-title-exit'>
        <div className='rename-list-modal-title'>Edit List</div>
        <button className='rename-list-modal-exit-button'>x</button>
      </div>
      <form className='rename-list-modal-form' onSubmit={handleSubmit}>
        <input type='text' className='rename-list-modal-input' value={newName} onChange={e => setNewName(e.target.value)} required/>
        <button type='submit' className='rename-list-modal-submit-button'>Save</button>
      </form>
    </div>
  )
}

export default RenameWatchlistModal
