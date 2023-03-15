import './watchlists.css'
import { useNavigate } from 'react-router-dom'

function Watchlists({ watchlists }) {
  const navigate = useNavigate();

  const watchlistArray = Object.values(watchlists)

  return (
    <div className='watchlists-container'>
      <div className='watchlists-header'>
        <div className='watchlists-title'>Lists</div>
        <button className='add-watchlist-button'>+</button>
      </div>
      <div className='watchlists-list'>
        {watchlistArray.map(watchlist => {
          return(
            <div className='watchlist-item' onClick={e => navigate(`/watchlists/${watchlist.id}`)}>
              <div className='watchlist-item-name' >{watchlist.list_name}</div>
              <button className='watchlist-edit-button'>Edit</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Watchlists
