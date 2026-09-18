'use client';
import TimeDisplay from "./timeDisplay";
import DateDisplay from "./dateDisplay";
import { useClock } from "@/hooks/useClock";

export default function Clock() {
    const date = useClock();
    console.log(date);
    return (
        <div className="mainClock">
            <TimeDisplay time={date}></TimeDisplay>
            <DateDisplay date={date}></DateDisplay>
        </div>
    )
}