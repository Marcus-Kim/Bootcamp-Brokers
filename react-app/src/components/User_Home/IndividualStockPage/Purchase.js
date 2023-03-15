import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



import "./IndividualStockPage.css"

export default function Purchase({ ticker, user }) {

    const dispatch = useDispatch();
    const [shares, setShares] = useState(0)


    const handlePurchase = async (e) => {
        e.preventDefault();

        const newPurchase = {

            ticker_id: ticker,
            shares: shares
        }

    // dispatch thunk!

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
                                value={shares}
                                onChange={e => setShares(e.target.value)}
                                >
                            </input>
                        </div>
                    </div>
                    <div style= {{ display: "flex", justifyContent: "space-between" }}>
                        <div className="left-est-div">
                            Est. Quantity
                        </div>
                        <div className="right-est-div">
                            0.000000
                        </div>
                    </div>
                    <div className="transaction-button-div">
                        <button className="button"
                            onClick={handlePurchase}
                            >Purchase Stock</button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", padding: "10px", borderTop: "1px solid rgb(172, 171, 171)", borderBottom: "1px solid rgb(172, 171, 171)" }}>
                        <div className="buying-power-div"> buying power available</div>
                    </div>
                    <div style={{ display: "flex", padding: "10px", justifyContent: "center", alignItems: "center" }}>
                        <div className="transaction-bottom-div">Brokerage</div>
                    </div>
                    {/* <div className="transaction-button-div">
                        <button className="button">Add to WatchList</button>
                    </div> */}
                </div>
    )
}
