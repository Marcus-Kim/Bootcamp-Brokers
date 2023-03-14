import './watchlists.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Watchlists({ watchlists }) {
  const navigate = useNavigate();

  if (!watchlists.length) {
    return null
  }
  
  return (
    <div className='watchlists-container'>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button'>+</button>
      </div>
      <div className='watchlists-list'>
        {watchlists.map(watchlist => {
          return(
            <div className='watchlist-item'>
              <div className='watchlist-item-name' onClick={e => navigate(`/watchlists/${watchlist.id}`)}>{watchlist.list_name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Watchlists
