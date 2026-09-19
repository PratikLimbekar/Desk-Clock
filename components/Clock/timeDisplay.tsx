import '@/components/Clock/clock.css';

export default function TimeDisplay({ time } : {time : Date | null }) {
    const currentTime = time?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit', second: '2-digit', hour12: false //change this to true to implement 12 hr format
    });
    if (currentTime) {
    return (<div className='timeClock'> {currentTime} </div>)
} else {
    return "No time to die.";
}
}