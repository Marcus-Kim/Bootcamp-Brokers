import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkGetUserPortfolio } from "../../../store/portfolio";
import { thunkGetTransactionsByUserId } from "../../../store/transactions";
import AddToWatchlistModalButton from "./individualStockPageModal/AddToWatchlistModalButton";
import AddToWatchlistModal from "./individualStockPageModal/AddToWatchlistModal";
import "./IndividualStockPage.css"
import { thunkGetAllWatchlistsUserId } from '../../../store/watchlist'

export default function PurchaseComponent({ ticker, user, close }) {

    const dispatch = useDispatch();
    const [shares, setShares] = useState("")
    const [errors, setErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const portfolio = useSelector(state => state.portfolio)
    const watchlists = useSelector(state => state.watchlist)

    useEffect(() => {
        dispatch(thunkGetAllWatchlistsUserId(user.id))
    }, [dispatch])

    if (!portfolio) return null
    if (!watchlists) return null

    const handlePurchase = async (e) => {
        e.preventDefault();

        setHasSubmitted(true)
        // if (+shares <= 0) return
        // if (errors.length > 0) return


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
                    <div style={{ borderBottom: "solid 1px rgb(172, 171, 171)" }}>
                        <div className="purchase-buy-div">Buy {ticker}</div>
                    </div>
                    <div style= {{ display: "flex", justifyContent: "space-between", }}>
                        <div className="left-order-type-div">
                            Order Type
                        </div>
                        <div className="right-order-type-div">
                            Buy Order Market
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
                            >Purchase Stock</button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", padding: "10px", borderTop: "1px solid rgb(172, 171, 171)", borderBottom: "1px solid rgb(172, 171, 171)" }}>
                        <div className="buying-power-div"> ${Number(portfolio.cash_balance).toFixed(2)} buying power available</div>
                    </div>
                    {/* <div style={{ display: "flex", padding: "10px", justifyContent: "center", alignItems: "center" }}>
                        <div className="transaction-bottom-div">Brokerage</div>
                    </div> */}
                    <div className="transaction-button-div">
                        <AddToWatchlistModalButton modalComponent={<AddToWatchlistModal ticker={ticker} watchlists={watchlists}/>} buttonText={'Add to Watchlist'}/>
                    </div>
                </div>
    )
}
