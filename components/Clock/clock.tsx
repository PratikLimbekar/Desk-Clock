'use client';
import { useEffect, useState } from "react";
import TimeDisplay from "./timeDisplay";
import DateDisplay from "./dateDisplay";
import { useClock } from "@/hooks/useClock";
import StatusBar from "@/components/StatusBar/statusBar";

export default function Clock() {
    const date = useClock();
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
    };

    return (
        <div className="mainClock">
            <StatusBar />
            <TimeDisplay time={date}></TimeDisplay>
            <DateDisplay date={date}></DateDisplay>
            {installPrompt && <button onClick={install}>Install app</button>}
        </div>
    )
}