import './OrderConfirmation.css'

export default function OrderConfirmation({ ticker, buySelected, shares }) {
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
                <div className="dollar-amount"></div>
                <div className="shares">
                  <div>Shares Purchased</div>
                  <div>{shares}.0</div>
                </div>
                <div className="share-price"></div>
                <div className="total"></div>
                <div className="completion-message"></div>
              </>
            ) 
            : (
              // Transaction details for a sell order
              <>
                <div className="shares">
                  <div>Shares Sold</div>
                  <div>{shares}.0</div>
                </div>
                <div className="share-price"></div>
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
