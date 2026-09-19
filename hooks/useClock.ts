'use client'; //needed when importing react hooks
import {useState, useEffect} from "react";

export function useClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer); //cleanup function
    }, []);

    return time;
}