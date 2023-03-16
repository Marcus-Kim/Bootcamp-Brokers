import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkGetUserPortfolio } from "../../../store/portfolio";
import { thunkGetTransactionsByUserId } from "../../../store/transactions";


import "./IndividualStockPage.css"

export default function PurchaseComponent({ ticker, user, close }) {
    const dispatch = useDispatch();
    const [shares, setShares] = useState("")
    const [errors, setErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [tickerInHoldings, setTickerInHoldings] = useState(false)
    const [buySelected, setBuySelected] = useState(true)

    const portfolio = useSelector(state => state.portfolio)
    const holdingsArray = Object.values(portfolio.holdings);
    const [sharesAvailable, setSharesAvailable] = useState(0)
    
    
    useEffect(() => {
        const output = isStockInHoldings(ticker)
        console.log('output', output)
        console.log('ticker', ticker)
        console.log(tickerInHoldings)
    }, [ticker, portfolio.holdings])
    
    if (!portfolio) return null
    
    const isStockInHoldings = (ticker) => {
        for (let i = 0; i < holdingsArray.length; i += 1) {
            const holding = holdingsArray[i];
            if (holding.ticker_id === ticker) {
                setSharesAvailable(holding.shares)
                setTickerInHoldings(true)
                return true;
            }
        }
        setTickerInHoldings(false)
        return false;
    }

    const selectBuy = () => {
        setBuySelected(true)
    }

    const selectSell = () => {
        setBuySelected(false)
    }
    
    const handlePurchase = async (e) => {
        e.preventDefault();
        
        setHasSubmitted(true)
        
        await dispatch(thunkBuyStock(ticker, +shares))
        .then(() => dispatch(thunkGetTransactionsByUserId()))
        .then(() => dispatch(thunkGetUserPortfolio()))
        .catch(async (response) => {
            const data = await response.json();
            console.log("data------>: ", data)
            if (data && data.error) setErrors(data.error);
        })
    }

    return (
        <div className="purchase-container">
                    <div className="order-selector">
                        <div 
                            className={
                                "purchase-buy-div" +
                                (buySelected ? ' active-type' : '')
                            }
                            onClick={selectBuy}
                        >
                            Buy {ticker}
                        </div>
                        <div 
                            className={
                                "sell-div" + 
                                (tickerInHoldings ? '' : ' hidden') +
                                (buySelected ? '' : ' active-type')
                            }
                            onClick={selectSell}
                        >
                            Sell {ticker}
                        </div>
                    </div>
                    <div style= {{ display: "flex", justifyContent: "space-between", }}>
                        <div className="left-order-type-div">
                            Order Type
                        </div>
                        <div className="right-order-type-div">
                            { buySelected ? 'Buy Market Order' : 'Sell Market Order'}
                        </div>
                    </div>
                    <div style= {{ display: "flex", justifyContent: "space-between", borderBottom: "solid 1px rgb(172, 171, 171)" }}>
                        <div className="left-shares-div">Shares</div>
                        <div className="right-shares-div">
                            <input
                                className="shares-input"
                                type="number"
                                min="1"
                                placeholder="0"
                                value={shares}
                                onChange={e => setShares(e.target.value)}
                                >
                            </input>
                        </div>
                    </div>
                    <div style= {{ display: "flex", justifyContent: "space-between" }}>
                        <div className="left-est-div">
                            Estimated Cost
                        </div>
                        <div className="right-est-div">
                            {`$ ${Number(close * shares).toFixed(2)}`}
                        </div>
                    </div>
                    <div className="purchase-error">
                        {hasSubmitted && errors.length > 0 && errors.map(error => (
                            <li key={error}>
                                {error}
                            </li>
                        ))}
                    </div>
                    <div className="transaction-button-div">
                        <button className="button"
                            onClick={handlePurchase}
                        >
                            {buySelected ? 'Purchase Stock' : 'Sell Stock'}
                        </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", padding: "10px", borderTop: "1px solid rgb(172, 171, 171)", borderBottom: "1px solid rgb(172, 171, 171)" }}>
                        { buySelected ? 
                            <div className="buying-power-div"> ${Number(portfolio.cash_balance).toFixed(2)} buying power available</div>
                            : (<div className="shares-available-div">{sharesAvailable}.0 Shares Available</div>) 
                        }
                    </div>
                    {/* <div style={{ display: "flex", padding: "10px", justifyContent: "center", alignItems: "center" }}>
                        <div className="transaction-bottom-div">Brokerage</div>
                    </div> */}
                    <div className="transaction-button-div">
                        <button className="watchlist-button">Add to WatchList</button>
                    </div>
                </div>
    )
}
