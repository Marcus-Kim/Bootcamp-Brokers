import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetTransactionsByUserId } from "../../../store/transactions";

export default function TransactionComponent({ ticker, user }) {

    const dispatch = useDispatch()
    // const transactions = useSelector(state =>)


    useEffect(() => {
        dispatch(thunkGetTransactionsByUserId())
    }, [dispatch])

    return (
        <div>
            <h3>Transactions Component</h3>
        </div>
    )
}
