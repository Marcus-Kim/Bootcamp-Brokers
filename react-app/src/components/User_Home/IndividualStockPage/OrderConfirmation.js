import { useSelector } from 'react-redux'
import './OrderConfirmation.css'

export default function OrderConfirmation({ ticker, buySelected, shares }) {
  // const stock = useSelector()
  return (
    <>
      <div className="purchase-container">
        <div className="confirmation-title">
          { ticker + ( buySelected ? ' Purchased!': ' Sold!')}
        </div>
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
                  Your order to buy {'TOTAL (TODO)'} of {ticker} is complete.
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
                <div className="share-price">
                  <div>Average Share Price</div>
                  <div>#TODO - GET FROM BACKEND</div>
                </div>
                <div className="total"></div>
                <div ></div>
              </>
            )
          }
        </div>
      </div>
    </>
  )
}
