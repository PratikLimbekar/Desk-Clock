'use client';
import { useState, useEffect } from "react";
import Clock from "../Clock/clock";
import "@/components/Timer/timer.css";

export default function Timer() {
    const [timer, setTimer] = useState(0 * 60);
    const [inputTime, setInputTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const hours = `${String(Math.floor(timer / 3600)).padStart(2, '0')}`;
    const minutes = `${String(Math.floor((timer % 3600) / 60)).padStart(2, '0')}`;
    const seconds = `${String(timer % 60).padStart(2, '0')}`;

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {//for repeated, timed actions
            setTimer((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);//1000 ms = 1 second => function runs each second.

        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <div className="timerWidget">
            <div className="timerHeading">
                Timer
            </div>
            {/* //Fix the clock later: */}
            {/* <div className="clockDiv">
                <Clock></Clock>
            </div> */}
            <div className="splitTimer">
            <div className="mainTimer">
                {hours !== '00' ? `${hours}:` : ''}{minutes}:{seconds}
            </div>
            <div className="setTimer">
                {!isRunning && <p>Set time in minutes:</p>}
                {!isRunning && <div className="timeButtons">
                    {/* remember prev => prev + 1 */}
                    <button onClick={() => setInputTime((prev) => prev + 1)} className="timeButton"> + </button>
                    <input type="number" value={inputTime} onChange={(e) => setInputTime(Number(e.target.value))} />
                    <button onClick={() => {if (inputTime !== 0) setInputTime((prev) => prev - 1)}} className="timeButton"> - </button>
                </div>}
                <div className="startTimer">
                    <button
                        onClick={() => {
                            if (isRunning) {
                                setIsRunning(false);
                            } else {
                                if (timer === 0) {
                                    if (inputTime > 0) {
                                        setTimer(inputTime * 60);
                                        setIsRunning(true);
                                    }
                                }
                                if (timer > 0) {
                                setIsRunning(true);
                                }
                            }
                        }}
                    className="controlButton">
                        {isRunning ? "Pause Timer" : timer === 0 ? "Start Timer" : "Continue"}
                    </button>
                    {isRunning && <button onClick={() => {setIsRunning((prev) => !prev)
                setInputTime(0)
                setTimer(0)}} className="controlButton">Reset</button>}
                </div>
                
            </div>
            </div>
        </div>
    )
}