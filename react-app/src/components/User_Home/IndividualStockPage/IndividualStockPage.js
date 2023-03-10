import { useState, useEffect } from "react";
import { useFinanceAPI } from "../../../context/FinanceApiContext";
import "./IndividualStockPage.css"



export default function IndividualStockPage() {

    const { ticker, setTicker } = useFinanceAPI()
    const { queryType, setQueryType } = useFinanceAPI()
    const { fetchStockData, fetchStockNewsData } = useFinanceAPI()
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState([])

    useEffect(() => {
        
        async function fetchData() {
            const result = await fetchStockData()
            setData(result)
        }
        fetchData()

    }, [fetchStockData])

    if (!data) return null;
    if (!data["Time Series (Daily)"]) return null;

    console.log("data: ", data)

    return (
        <div className="stock-page-main-container">
            <h1>Individual Stock Page</h1>
            <h3>{data["Meta Data"]["2. Symbol"]}</h3>

            <div className="key-stats-container">
                <div className="key-stat-title-div">
                    Key Statistics
                </div>
                <div className="stat-value-container">
                    <div>
                        <div>Market Cap </div>
                    </div>
                    <div>
                        <div>Price-Earning ratio </div>
                    </div>
                    <div>
                        <div>Average Volume </div>
                    </div>
                    <div>
                        <div>Dividend yield </div>
                        <div>${data["Time Series (Daily)"]["2023-03-08"]["7. dividend amount"]}</div>
                    </div>
                    <div className="stat-box">
                        <div>Yesterday High </div>
                        <div>${data["Time Series (Daily)"]["2023-03-08"]["2. high"]}</div>
                    </div>
                    <div>
                        <div>Yesterday Low </div>
                        <div>${data["Time Series (Daily)"]["2023-03-08"]["3. low"]}</div>
                    </div>
                    <div>
                        <div>Volume </div>
                        <div>{data["Time Series (Daily)"]["2023-03-08"]["6. volume"]}</div>
                    </div>
                    <div>
                        <div>Yesterday Open </div>
                        <div>${data["Time Series (Daily)"]["2023-03-08"]["1. open"]}</div>
                    </div>
                    <div>
                        <div>Yesterday Close </div>
                        <div>{data["Time Series (Daily)"]["2023-03-08"]["4. close"]}</div>
                    </div>
                </div>
                <div className="purchase-container">

                </div>
            </div>
            
        </div>
    )
}
