'use client';
import { useEffect, useState } from "react";
import '@/components/Weather/weather.css';

type WeatherData = {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    condition: {
        text: string;
        icon: string;
    };
};

export default function Weather() {
    const [data, setData] = useState<WeatherData | null>(null);
    const params = new URLSearchParams({
        // key: "YOUR_API_KEY",
        q: "Pune",
    });

    useEffect(() => {
        async function getWeather() {
            const response = await fetch(`/api/weather?${params}`);
            console.log(response);
            const datalol = await response.json();
            setData(datalol.current);
        }

        getWeather();
        const interval = setInterval(() => {
            getWeather();
        }, 60 * 60 * 1000);

        return () => {
            clearInterval(interval);
        }

    }, []);


    return (
        <div className="weather">
            <div className="leftWeather">
                <h2 className="Location">Pune</h2>

                <img src={data?.condition.icon} />

                <div className="temperature">
                    {data?.temp_c}°
                </div>

                <div className="feels">
                    Feels like {data?.feelslike_c}°
                </div>
            </div>
            <div className="rightWeather">
                <div>Condition: {data?.condition.text}</div>
                <div>Chance of Rain: {data?.chance_of_rain}%</div>
                <div>Will it Rain: {data?.will_it_rain}%</div>
                <div>Humidity: {data?.humidity}%</div>
            </div>

        </div>
    )
}