import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkBuyStock, thunkGetUserPortfolio, thunkSellStock } from "../../../store/portfolio";
import { thunkGetTransactionsByUserId } from "../../../store/transactions";
import AddToWatchlistModalButton from "./individualStockPageModal/AddToWatchlistModalButton";
import AddToWatchlistModal from "./individualStockPageModal/AddToWatchlistModal";
import "./IndividualStockPage.css"
import { thunkGetAllWatchlistsUserId } from '../../../store/watchlist'
import OrderConfirmation from "./OrderConfirmation";

export default function PurchaseComponent({ ticker, user, close }) {
    const dispatch = useDispatch();
    const [shares, setShares] = useState(0)
    const [errors, setErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [tickerInHoldings, setTickerInHoldings] = useState(false)
    const [buySelected, setBuySelected] = useState(true)

    const portfolio = useSelector(state => state.portfolio)
    const holdingsArray = Object.values(portfolio.holdings);
    const [sharesAvailable, setSharesAvailable] = useState(0)

    const estimatedCost = Number(+close * +shares).toFixed(2)
    const cashBalance = Number(portfolio.cash_balance).toFixed(2)


    // frontend error handing
    useEffect(() => {
        const newErrors = []
        console.log("cashBalance: ", cashBalance)
        console.log("estimatedCost: ", estimatedCost)
        if (estimatedCost >= cashBalance) {
            newErrors.push("User has insufficient funds to complete purchase")
            setErrors(newErrors)
        } else {
            setErrors([])
        }
        console.log("errors: ", errors)
    }, [shares, estimatedCost, cashBalance, ticker])

    useEffect(() => {
        isStockInHoldings(ticker)
    }, [ticker, portfolio.holdings])
        const watchlists = useSelector(state => state.watchlist)

    useEffect(() => {
        dispatch(thunkGetAllWatchlistsUserId(user.id))
    }, [dispatch])



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
        setBuySelected(() => false)
    }

    const handlePurchase = async (e) => {
        e.preventDefault();

        setHasSubmitted(true)
        if (errors.length > 0) return


        await dispatch(thunkBuyStock(ticker, +shares))
            .then(() => dispatch(thunkGetTransactionsByUserId()))
            .then(() => dispatch(thunkGetUserPortfolio()))
            .catch(async (response) => {
                const data = await response.json();
                if (data && data.error) setErrors(data.error);
            })

        setShares(0)
        // setErrors([])
        setHasSubmitted(false)
    }

    const handleSale = async (e) => {
        e.preventDefault();

        setHasSubmitted(() => true);
        console.log('Submitted')

        await dispatch(thunkSellStock(ticker, +shares))
            .then(() => dispatch(thunkGetTransactionsByUserId()))
            .then(() => dispatch(thunkGetUserPortfolio()))
            .catch(async (response) => {
                const data = await response.json();
                if (data && data.error) setErrors(data.error);
            })

    }

    const disabled = () => {
        return Number(close * shares).toFixed(2) > Number(portfolio.cash_balance).toFixed(2)
    }

    if (hasSubmitted && errors.length === 0) {
        return <OrderConfirmation
            ticker={ticker}
            buySelected={buySelected}
            shares={shares}
            setHasSubmitted={setHasSubmitted}
        />
    } else {
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
                                {`$ ${estimatedCost}`}
                            </div>
                        </div>
                        <div>
                            {hasSubmitted && errors.length > 0 && (
                                    <div className="purchase-error">
                                        {errors.map((error) => (
                                            <li key={error}
                                                style={{ color: "red", listStyle: "none", fontSize: "10px", textAlign: "center"}}
                                                >{error}</li>
                                        ))}
                                    </div>
                            )}
                        </div>
                        <div className="transaction-button-div">
                            { buySelected ?
                                (
                                <button
                                    className="button"
                                    onClick={handlePurchase}
                                >
                                    Purchase Stock
                                </button>)
                                : (
                                <button
                                    className="button"
                                    onClick={handleSale}
                                >
                                    Sell Stock
                                </button>
                                )
                            }
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", padding: "10px", borderTop: "1px solid rgb(172, 171, 171)", borderBottom: "1px solid rgb(172, 171, 171)" }}>
                            { buySelected ?
                                <div className="buying-power-div"> ${cashBalance} buying power available</div>
                                : (<div className="shares-available-div">{sharesAvailable}.0 Shares Available</div>)
                            }
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
}
