'use client';
import Clock from "@/components/Clock/clock";
import Timer from "@/components/Timer/timer";
import Weather from "@/components/Weather/weather";
import { useState } from "react";

//repeat the following screeens so as to not hjave that flying back animation
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
            setCurrentScreen((current) => (current + 1)%screens.length);
          }
          if (distance > 50) {
            setCurrentScreen((current) => (current - 1 + screens.length)%screens.length);
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
