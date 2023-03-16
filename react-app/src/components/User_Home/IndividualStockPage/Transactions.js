import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetTransactionsByUserId } from "../../../store/transactions";
import "./IndividualStockPage.css"



export default function TransactionComponent({ ticker, user }) {

    const dispatch = useDispatch()
    const transactions = useSelector(state => state.transaction.allTransactions)

    useEffect(() => {
        dispatch(thunkGetTransactionsByUserId())
    }, [dispatch, ticker])

    if (!transactions) return null;

    const transactionArr = Object.values(transactions)
    const filteredTransaction =  transactionArr.filter(transaction => (
        transaction.ticker_id === ticker
    ))
    // console.log("filteredTransaction: ", filteredTransaction)


    const reformatDate = (stockDate) => {
        // const date = new Date(stockDate);
        // options = {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "long",
        //     day: "numeric",
        // };
        // const formattedDate = new Intl.DateTimeFormat({
        //     day: 'numeric',
        //     month: 'long',
        //     year: 'numeric',
        // }).format(date);
        // return formattedDate;
        const date = stockDate.split(" ")
        return `${date[2]} ${date[1]}, ${date[3]}`
    }

    return (
        <div>
            <div className="transaction-title-div">
                <div>Transactions Component</div>
            </div>
            <div>
                { filteredTransaction.map(transaction => (
                    <div key={transaction.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "7px" }}>
                        <div style={{ display: "flex", flexDirection: "column", padding: "5px"}}>
                            <div>{+transaction.shares > 0 ? `${transaction.ticker_id} Buy` : `${transaction.ticker_id} Sell`}</div>
                            <div>{reformatDate(transaction.date)}</div>
                        </div>
                        <div style={{ color: transaction.shares > 0 ? "rgb(0,200,6)" : "red", padding: "15px" }}>{transaction.shares}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
