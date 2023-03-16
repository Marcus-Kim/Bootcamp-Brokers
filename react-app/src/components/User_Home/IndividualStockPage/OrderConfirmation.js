import { useSelector } from 'react-redux'
import './OrderConfirmation.css'

export default function OrderConfirmation({ ticker, buySelected, shares, setHasSubmitted }) {
  // const stock = useSelector()

  const doneReviewing = (e) => {
    e.preventDefault()

    setHasSubmitted(false)
  }
  return (
    <>
      <div className="purchase-container">
        <div className="confirmation-title">
          { ticker + ( buySelected ? ' Purchased': ' Sold')}
        </div>
        <div className="break"></div>
        <div className="transaction-details">
          { buySelected ? 
            (
              // Transaction details for a buy order
              <> 
                <div className="dollar-amount">
                  <div>Amount Invested</div>
                  <div>#TODO - GET FROM BACKEND</div>
                </div>
                <div className="break"></div>
                <div className="shares">
                  <div>Shares Purchased</div>
                  <div>{shares}.0</div>
                </div>
                <div className="break"></div>
                <div className="share-price">
                  <div>Average Share Price</div>
                  <div>#TODO - GET FROM BACKEND</div>
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
                  <div>#TODO - GET FROM BACKEND</div>
                </div>
                <div className="break"></div>
                <div className="dollar-amount">
                  <div>Total Credit</div>
                  <div>#TODO - GET FROM BACKEND</div>
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
