'use client';
import React, { useState, useEffect } from "react";
import Clock from "@/components/Clock/clock";
import Alarms from "@/components/Alarms/alarm";
import Timer from "@/components/Timer/timer";
import Weather from "@/components/Weather/weather";
import Tasks from "@/components/Tasks/tasks";
import StatusBar from "@/components/StatusBar/statusBar";
import { AlarmProvider, useAlarm } from "@/context/AlarmContext";
import { TaskProvider } from "@/hooks/useTasks";
import Settings from "@/components/Settings/settings";

const screens = [Clock, Alarms, Weather, Settings,
  // Timer,
   Tasks];

function HomeContent() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { isRinging } = useAlarm();

  // Clone the last screen at the beginning
  // and the first screen at the end.
  const infiniteScreens = [
    screens[screens.length - 1],
    ...screens,
    screens[0],
  ];

  // If an alarm rings, automatically rotate to the Clock screen
  useEffect(() => {
    if (isRinging) {
      setIsTransitioning(true);
      setCurrentScreen(1);
    }
  }, [isRinging]);

  const goNext = () => {
    setIsTransitioning(true);
    setCurrentScreen((current) => current + 1);
  };

  const goPrevious = () => {
    setIsTransitioning(true);
    setCurrentScreen((current) => current - 1);
  };

  const handleTransitionEnd = () => {
    // We reached the cloned Clock at the end.
    // Silently jump back to the real Clock.
    if (currentScreen === screens.length + 1) {
      setIsTransitioning(false);
      setCurrentScreen(1);
    }

    // We reached the cloned Timer at the beginning.
    // Silently jump back to the real Timer.
    if (currentScreen === 0) {
      setIsTransitioning(false);
      setCurrentScreen(screens.length);
    }
  };

  return (
    <TaskProvider>
      <main className="h-screen w-screen overflow-hidden flex flex-col bg-black text-white select-none">
        <div
          className="flex-1 w-full overflow-hidden relative"
          onTouchStart={(e) => {
            const startX = e.touches[0].clientX;

            const handleTouchEnd = (event: TouchEvent) => {
              const endX = event.changedTouches[0].clientX;
              const distance = endX - startX;

              if (distance < -50) {
                // Swipe left → next screen
                goNext();
              }

              if (distance > 50) {
                // Swipe right → previous screen
                goPrevious();
              }

              document.removeEventListener("touchend", handleTouchEnd);
            };

            document.addEventListener("touchend", handleTouchEnd);
          }}
        >
          <div
            className={`flex h-full ${
              isTransitioning
                ? "transition-transform duration-300 ease-out"
                : ""
            }`}
            style={{
              width: `${infiniteScreens.length * 100}vw`,
              transform: `translateX(-${currentScreen * 100}vw)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {infiniteScreens.map((Screen, index) => (
              <div
                key={index}
                className="h-full w-screen shrink-0 overflow-hidden"
              >
                <Screen />
              </div>
            ))}
          </div>
        </div>
      </main>
    </TaskProvider>
  );
}


export default function Home() {
  return (
    <AlarmProvider>
      <HomeContent />
    </AlarmProvider>
  );
}
