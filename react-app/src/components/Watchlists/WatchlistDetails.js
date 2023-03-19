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
import { faXmark, faFilter, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import greenTriangle from './triangle-16.png'
import redTriangle from './triangle-16-red.png'

export default function WatchlistDetails() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user.id)
  const watchlists = useSelector(state => state.watchlist)
  const { watchlistId } = useParams();
  const selectedWatchlist = useSelector(state => state.watchlist[+watchlistId])
  const selectedWatchlistStocks = useSelector(state => state.watchlist[+watchlistId]?.stocks)
  const { markusKim } = useFinanceAPI();

  useEffect(() => {
    dispatch(thunkGetAllWatchlistsUserId(user))
  }, [dispatch, user])


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
      return marketCap?.toFixed(2);
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
                {/* <FontAwesomeIcon icon={faFilter} className='watchlist-details-filters-button' />
                <FontAwesomeIcon icon={faEllipsis} className='watchlist-details-more-button' /> */}
              </div>
            </div>
            <div className="watchlist-details-item-count">{selectedWatchlist.stocks.length} Items</div>
          </div>
          <div className='watchlist-details-table'>
            <div className='watchlist-details-table-header'>
                <div className='watchlist-details-list-header-name'>Name</div>
                <div className='watchlist-details-list-header-symbol'>Symbol</div>
                <div className='watchlist-details-list-header-price'>Price</div>
                <div className='watchlist-details-list-header-change'>Today</div>
                <div className='watchlist-details-list-header-market-cap'>Market Cap</div>
            </div>
            <div className='watchlist-details-list-body'>
              {selectedWatchlistStocks?.map(stock => {
                const stockData = markusKim[stock.ticker];
                if (!stockData) {
                  return null;
                }
                const isLoss = (percentChange) => {
                  return percentChange < 0 ? true : false
                }
                const noMinus = (percentChange) => {
                  const stringPercentChange = percentChange.toString().split('')
                  if (stringPercentChange[0] == '-') return +stringPercentChange.slice(1).join('')
                  return percentChange;
                }
              return (
                  <div className='watchlist-details-list-row' onClick={e => navigate(`/stocks/${stock.ticker}`)} key={stock.ticker}>
                    <div className='watchlist-details-list-name' id='watchlist-details-list-header-name'>{stock.company_name}</div>
                    <div className='watchlist-details-list-symbol'>{stock.ticker}</div>
                    <div className='watchlist-details-list-price'>${markusKim[stock.ticker]['dailyPrice'].close}</div>
                    <div className='watchlist-details-list-today'><img className='watchlist-details-triangle' src={isLoss(markusKim[stock.ticker]['dailyPrice'].percentageChange) ? greenTriangle : redTriangle} />{noMinus(markusKim[stock.ticker]['dailyPrice'].percentageChange.toFixed(2))}%</div>
                    <div className='watchlist-details-list-header-market-cap-delete'>
                      <div className='watchlist-details-list-market-cap'>{convertMarketCap(stockData.marketCap)}</div>
                      <FontAwesomeIcon icon={faXmark} className='watchlist-details-stock-delete-button' onClick={e => handleDeleteClick(e, selectedWatchlist.id, stock.ticker)}/>
                    </div>
                  </div>
              )
            })}
            </div>
          </div>
        </div>
        <div className='watchlist-details-lists'> {/* LIST COMPONENT */}
          <Watchlists watchlists={watchlists} activeWatchlistId={selectedWatchlist.id}/>
        </div>
      </div>
    </div>
    </>
  )
}
