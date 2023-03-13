import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import LineChart from "./LineChart";




export default function DailyChart({ ticker }) {

    const dispatch = useDispatch()


    useEffect(() => {

    }, [dispatch, ticker])



    return (
        <div>
            <h3>Daily Chart Component Loaded!</h3>
            <LineChart />
            <Line></Line>
            <p>{ ticker }</p>
        </div>
    )
}
