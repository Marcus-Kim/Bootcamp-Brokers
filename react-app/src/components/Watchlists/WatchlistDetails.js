import './watchlistDetails.css'
import Watchlists from './Watchlists'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { thunkGetAllWatchlistsUserId } from '../../store/watchlist'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function WatchlistDetails() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user.id)
  const watchlists = useSelector(state => state.watchlist)
  const { watchlistId } = useParams()

  const selectedWatchlist = watchlists[+watchlistId]
  console.log('SELECTED WATCHLIST', selectedWatchlist)

  useEffect(() => {
    dispatch(thunkGetAllWatchlistsUserId(user))
  }, [dispatch])

  if (!watchlists) return null
  if (!selectedWatchlist) return null;
  if (!user) return null;


  return (
    <div className="watchlist-details-container">
      <div className='watchlist-details-content-container'>
        <div className='watchlist-details-content'>
          <div className='watchlist-details-content-header'>
            <div className='watchlist-details-name-buttons'>
              <div className='watchlist-details-name'>{selectedWatchlist.list_name}</div>
              <div className='watchlist-details-buttons-conatiner'>
                <button className='watchlist-details-filters-button'>Filters</button>
                <button className='watchlist-details-more-button'>Three Dots</button>
              </div>
            </div>
            <div className="watchlist-details-item-count">{selectedWatchlist.stocks.length} Items</div>
          </div>
          <table className='watchlist-details-table'>
            <thead className='watchlist-details-table-header'>
              <tr className='watchlist-details-table-header'>
                <th className='watchlist-details-list-header-name'>Name</th>
                <th className='watchlist-details-list-header-symbol'>Symbol</th>
                <th className='watchlist-details-list-header'>Price</th>
                <th className='watchlist-details-list-header'>Today</th>
                <th className='watchlist-details-list-header-market-cap'>Market Cap</th>
              </tr>
            </thead>
            <tbody className='watchlist-details-list-body'>
              {selectedWatchlist.stocks.map(stock => {
              return (
                <tr className='watchlist-details-list-row' onClick={e => navigate(`/stocks/${stock.ticker}`)}>
                  <td className='watchlist-details-list-header-name' id='watchlist-details-list-header-name'>{stock.company_name}</td>
                  <td className='watchlist-details-list-header-symbol'>{stock.ticker}</td>
                  <td className='watchlist-details-list-header'>{stock.current_price}$</td>
                  <td className='watchlist-details-list-header'>{stock.daily_change * 100}%</td>
                  <div id='hello'>
                    <td className='watchlist-details-list-header-market-cap'>Market Cap</td>
                    <div className='watchlist-detail-stock-delete-button'>x</div>
                  </div>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className='watchlist-details-lists'> {/* LIST COMPONENT */}
          <Watchlists watchlists={watchlists}/>
        </div>
      </div>
    </div>
  )
}
