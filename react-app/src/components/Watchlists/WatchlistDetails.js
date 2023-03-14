import './watchlistDetails.css'
import Watchlists from './Watchlists'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { thunkGetAllWatchlistsUserId } from '../../store/watchlist'
import { useParams } from 'react-router-dom'

export default function WatchlistDetails() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user.id)
  const watchlist = useSelector(state => Object.values(state.watchlist))
  const { watchlistId } = useParams()

  console.log(watchlistId)
  useEffect(() => {
    dispatch(thunkGetAllWatchlistsUserId(user))
  }, [dispatch])


  return (
    <div className="watchlist-details-container">
      <div className='watchlist-details-content-container'>
        <div className='watchlist-details-content'>
          <div className='watchlist-details-content-header'>
            <div className='watchlist-details-name-buttons'>
              <div className='watchlist-details-name'>List Name</div>
              <div className='watchlist-details-buttons-conatiner'>
                <button className='watchlist-details-filters-button'>Filters</button>
                <button className='watchlist-details-more-button'>Three Dots</button>
              </div>
            </div>
            <div className="watchlist-details-item-count"># Items</div>
          </div>
          <table>
            <thead>
              <tr>
                <th className='watchlist-details-list-header-name'>Name</th>
                <th className='watchlist-details-list-header-symbol'>Symbol</th>
                <th className='watchlist-details-list-header'>Price</th>
                <th className='watchlist-details-list-header'>Today</th>
                <th className='watchlist-details-list-header-market-cap'>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map(watchlist => {
              return (
              <tr>
                <td className='watchlist-details-list-header-name'>{watchlist.name}</td>
                <td className='watchlist-details-list-header-symbol'>Hello</td>
                <td className='watchlist-details-list-header'>Hello</td>
                <td className='watchlist-details-list-header'>Hello</td>
                <td className='watchlist-details-list-header-market-cap'>Hello</td>
              </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className='watchlist-details-lists'> {/* LIST COMPONENT */}
          <Watchlists />
        </div>
      </div>
    </div>
  )
}
