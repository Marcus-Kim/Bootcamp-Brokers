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
    const [shares, setShares] = useState('')
    const [errors, setErrors] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [tickerInHoldings, setTickerInHoldings] = useState(false)
    const [buySelected, setBuySelected] = useState(true)

    const portfolio = useSelector(state => state.portfolio)
    const cashBalance = useSelector(state => state.portfolio.cash_balance)
    const holdingsArray = Object.values(portfolio.holdings);
    const [sharesAvailable, setSharesAvailable] = useState('')

    // const estimatedCost = Number(+close * +shares)
    // const cashBalance = Number(portfolio.cash_balance)

    const [estimatedCost, setEstimatedCost] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    // frontend error handing
    useEffect(() => {
        const fetchAsync = async () => {
            await dispatch(thunkGetUserPortfolio())
            await dispatch(thunkGetTransactionsByUserId())
            await setIsLoaded(true)
        }
        fetchAsync();

        isStockInHoldings(ticker);
        const newEstimatedCost = Number(+close * +shares);

        // Update the state values
        setEstimatedCost(newEstimatedCost);
        setErrors([])

    }, [shares, estimatedCost, ticker, portfolio.holdings, close]);
    // useEffect(() => {
    //     isStockInHoldings(ticker)
    // }, [ticker, portfolio.holdings])
        const watchlists = useSelector(state => state.watchlist)

    const validateBuy = () => {
        const newErrors = [];

        const newEstimatedCost = Number(+close * +shares);
        const newCashBalance = Number(cashBalance);

        // Update the state values
        setEstimatedCost(newEstimatedCost);

        if (newEstimatedCost <= 0) newErrors.push("Please enter valid number of shares")
        if (newEstimatedCost > newCashBalance) {
            newErrors.push("User has insufficient funds to complete purchase");
        }
        setErrors(newErrors);
        console.log('real errors', newErrors)
        return newErrors
    }

    const validateSell = () => {
        const newErrors = [];

        const newEstimatedCost = Number(+close * +shares);

        // Update the state values
        setEstimatedCost(newEstimatedCost);

        if (shares <= 0) newErrors.push("Please enter valid number of shares")
        if (shares > sharesAvailable) newErrors.push("You do not have enough shares")
        setErrors(newErrors)
        return newErrors
    }
    
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

        setErrors([])
        const validationErrors = validateBuy();

        if (validationErrors.length > 0) return
        setHasSubmitted(true)
        

        await dispatch(thunkBuyStock(ticker, +shares))
            .then(() => dispatch(thunkGetTransactionsByUserId()))
            .then(() => dispatch(thunkGetUserPortfolio()))

    }

    const handleSale = async (e) => {
        e.preventDefault();

        setErrors([])
        const validationErrors = validateSell();

        if (validationErrors.length > 0) return
        setHasSubmitted(true)

        await dispatch(thunkSellStock(ticker, +shares))
            .then(() => dispatch(thunkGetTransactionsByUserId()))
            .then(() => dispatch(thunkGetUserPortfolio()))

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
            setShares={setShares}
            setBuySelected={setBuySelected}
            sharesAvailable={sharesAvailable}
            setSharesAvailable={setSharesAvailable}
        />
    } else {
        return (
            <>
                { isLoaded && (
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
                            {`$ ${Number(estimatedCost).toFixed(2)}`}
                        </div>
                    </div>
                    <div>
                        {errors.length > 0 && (
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
                )}
            </>
            
        )
    }
}
