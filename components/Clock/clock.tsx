'use client';
import TimeDisplay from "./timeDisplay";
import DateDisplay from "./dateDisplay";
import { useClock } from "@/hooks/useClock";
import InstallButton from "../installButton";

export default function Clock() {
    const date = useClock();
    return (
        <div className="mainClock">
            <InstallButton></InstallButton>
            <TimeDisplay time={date}></TimeDisplay>
            <DateDisplay date={date}></DateDisplay>
        </div>
    )
}