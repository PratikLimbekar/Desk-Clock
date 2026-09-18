import '@/components/Clock/clock.css';

export default function DateDisplay({date} : {date : Date | null}) {
    const currentDate = date?.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: '2-digit'
    });
    return(
        <div className="dateClock">
            <div>
                {currentDate}
            </div>
        </div>
    )
}