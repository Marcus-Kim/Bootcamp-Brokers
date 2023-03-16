import './watchlistDetails.css'
import Watchlists from './Watchlists'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { thunkGetAllWatchlistsUserId, thunkDeleteWatchlistStock } from '../../store/watchlist'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import UserNav from '../User_Home/UserHomePage/UserNav/UserNav'
import { useFinanceAPI } from '../../context/FinanceApiContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faArrowDown } from '@fortawesome/free-solid-svg-icons'

export default function WatchlistDetails() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user.id)
  const watchlists = useSelector(state => state.watchlist)
  const { watchlistId } = useParams()
  const selectedWatchlist = useSelector(state => state.watchlist[+watchlistId])
  const selectedWatchlistStocks = useSelector(state => state.watchlist[+watchlistId]?.stocks)
  const { markusKim } = useFinanceAPI();

  console.log('MARKUS KIM: ', markusKim)

  useEffect(() => {
    dispatch(thunkGetAllWatchlistsUserId(user))
  }, [dispatch])


  if (!watchlists) return null;
  if (!selectedWatchlist) return null;
  if (!user) return null;
  if (!markusKim) return null;
  if (!selectedWatchlistStocks) return null;

  const handleDeleteClick = async (e, watchlistId, ticker) => {
    e.stopPropagation();
    //TODO Add functionality for deleting
    await dispatch(thunkDeleteWatchlistStock(watchlistId, ticker))
  }

  const convertMarketCap = (marketCap) => { // Converts market cap to a readable number
    const billion = 1000000000;
    const trillion = 1000000000000;

    let value;
    let suffix;

    if (marketCap >= trillion) {
      value = marketCap / trillion;
      suffix = 'T';
    } else if (marketCap >= billion) {
      value = marketCap / billion;
      suffix = 'B';
    } else {
      // Return the original value if it's less than a billion
      return marketCap.toFixed(2);
    }

    // Limit the number to 3 digits on the left and 2 on the right of the decimal
    return `${value.toFixed(2)}${suffix}`;
  };


  return (
    <>
    <UserNav/>

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
              {selectedWatchlistStocks?.map(stock => {
                const stockData = markusKim[stock.ticker];
                if (!stockData) {
                  return null;
                }
              return (
                <tr className='watchlist-details-list-row' onClick={e => navigate(`/stocks/${stock.ticker}`)} key={stock.ticker}>
                  <td className='watchlist-details-list-header-name' id='watchlist-details-list-header-name'>{stock.company_name}</td>
                  <td className='watchlist-details-list-header-symbol'>{stock.ticker}</td>
                  <td className='watchlist-details-list-header'>${markusKim[stock.ticker]['dailyPrice'].close}</td>
                  <td className='watchlist-details-list-header'>{markusKim[stock.ticker]['dailyPrice'].percentageChange.toFixed(2)}%</td>
                  <td className='watchlist-details-list-header-market-cap'>{convertMarketCap(stockData.marketCap)}</td>
                  <button className='watchlist-details-stock-delete-button' onClick={e => handleDeleteClick(e, selectedWatchlist.id, stock.ticker)}>X</button>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className='watchlist-details-lists'> {/* LIST COMPONENT */}
          <Watchlists watchlists={watchlists} activeWatchlistId={selectedWatchlist.id}/>
        </div>
      </div>
    </div>
    </>
  )
}
