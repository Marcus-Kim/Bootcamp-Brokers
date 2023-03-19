import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import './OrderConfirmation.css'

export default function OrderConfirmation({ 
  ticker, 
  buySelected, 
  shares, 
  setHasSubmitted, 
  setShares,
  setBuySelected,
  sharesAvailable, 
  setSharesAvailable 
}) {
  const stockPrices = useSelector(state => state.stocks.all28Stocks)
  let price;
  if (stockPrices) price = stockPrices[ticker]

  const doneReviewing = (e) => {
    e.preventDefault()
    
    // When a sale zeros out a specific holding, set 'buySelected' to true (because the sell button will be unavailable immediately after transaction)
    if (sharesAvailable === +shares && !buySelected) setBuySelected(true)

    setSharesAvailable(prev => prev - +shares)
    setShares('')
    setHasSubmitted(false)
  }

  useEffect(() => {
  }, [buySelected, ticker])

  return (
    <>
      <div className="purchase-container">
        <div className="confirmation-title">
          { ticker + ( buySelected ? ' Purchased!': ' Sold!')}
        </div>
        <div className="break"></div>
        <div className="transaction-details">
          { buySelected ? 
            (
              // Transaction details for a buy order
              <> 
                <div className="dollar-amount">
                  <div>Amount Invested</div>
                  <div>{ price * shares }</div>
                </div>
                <div className="break"></div>
                <div className="shares">
                  <div>Shares Purchased</div>
                  <div>{shares}.0</div>
                </div>
                <div className="break"></div>
                <div className="share-price">
                  <div>Average Share Price</div>
                  <div>{ price }</div>
                </div>
                <div className="break"></div>
                <div className="completion-message">
                  Your order to buy {shares}.0 shares of {ticker} is complete.
                </div>
              </>
            ) 
            : (
              // Transaction details for a sell order
              <>
                <div className="shares">
                  <div>Shares Sold</div>
                  <div>{shares}.0</div>
                </div>
                <div className="break"></div>
                <div className="share-price">
                  <div>Average Share Price</div>
                  <div>{ price }</div>
                </div>
                <div className="break"></div>
                <div className="dollar-amount">
                  <div>Total Credit</div>
                  <div>{ price * shares }</div>
                </div>
                <div className="break"></div>
                <div className="completion-message">
                  Your order to sell {shares}.0 shares of {ticker} is complete.
                </div>
                <div className="break"></div>
              </>
            )
          }
        </div>
        <div className="done-button-container">
          <button
            className="done-button"
            onClick={doneReviewing}
          >
            Done
          </button>
        </div>
      </div>
    </>
  )
}
