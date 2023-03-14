import './watchlists.css'
import { useDispatch, useSelector } from 'react-redux'

function Watchlists() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.session.user.id)

  return (
    <div className='watchlists-container'>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button'>+</button>
      </div>
      <div className='watchlists-list'>

      </div>
    </div>
  )
}

export default Watchlists
