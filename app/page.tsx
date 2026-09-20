'use client';
import React, { useState, useEffect } from "react";
import Clock from "@/components/Clock/clock";
import Alarms from "@/components/Alarms/alarm";
import Timer from "@/components/Timer/timer";
import Weather from "@/components/Weather/weather";
import Tasks from "@/components/Tasks/tasks";
import StatusBar from "@/components/StatusBar/statusBar";
import { AlarmProvider, useAlarm } from "@/context/AlarmContext";

const screens = [Alarms, Clock, Weather, Tasks, Timer];

function HomeContent() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const { isRinging } = useAlarm();

  // If an alarm rings, automatically rotate to the Clock screen in the front
  useEffect(() => {
    if (isRinging) {
      setCurrentScreen(0);
    }
  }, [isRinging]);

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-black text-white select-none">
      {/* Dynamic top bar for updates */}
      {/* <StatusBar /> */}

      <div
        className="flex-1 w-full overflow-hidden relative"
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;

          const handleTouchEnd = (event: TouchEvent) => {
            const endX = event.changedTouches[0].clientX;
            const distance = endX - startX;
            if (distance < -50) {
              setCurrentScreen((current) => (current + 1) % screens.length);
            }
            if (distance > 50) {
              setCurrentScreen((current) => (current - 1 + screens.length) % screens.length);
            }
            document.removeEventListener("touchend", handleTouchEnd);
          };
          document.addEventListener("touchend", handleTouchEnd);
        }}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${screens.length * 100}vw`,
            transform: `translateX(-${currentScreen * 100}vw)`,
          }}
        >
          {screens.map((Screen, index) => (
            <div key={index} className="h-full w-screen shrink-0 overflow-hidden">
              <Screen></Screen>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AlarmProvider>
      <HomeContent />
    </AlarmProvider>
  );
}
