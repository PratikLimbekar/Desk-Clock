'use client';
import Clock from "@/components/Clock/clock";
import Timer from "@/components/Timer/timer";
import Weather from "@/components/Weather/weather";
import { useState } from "react";

const screens = [Clock, Timer, Weather];

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(0);

  return (
    <main className="h-screen w-screen overflow-hidden"
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX;

        const handleTouchEnd = (event: TouchEvent) => {
          const endX = event.changedTouches[0].clientX;
          const distance = endX - startX;
          if (distance < -50) {
            setCurrentScreen((current) => Math.min(current + 1, screens.length - 1));
          }
          if (distance > 50) {
            setCurrentScreen((current) => Math.max(current - 1, 0));
          }
          document.removeEventListener("touchend", handleTouchEnd);
        }
        document.addEventListener("touchend", handleTouchEnd);
      }}>

      <div className="flex h-full transition-transform duration-300 ease-out"
        style={{
          width: `${screens.length * 100}vw`,
          transform: `translateX(-${currentScreen * 100}vw)`
        }}>
          {screens.map((Screen, index) => (
            <div key={index} className="h-screen w-screen shrink-0">
              <Screen></Screen>
            </div>
          ))}
      </div>
    </main>

  );
}
