'use client';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Alarm, AlarmContextType } from '@/types/alarm';
import { useClock } from '@/hooks/useClock';

const STORAGE_KEY = 'desk-clock-alarms';

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: React.ReactNode }) {
    const currentTime = useClock();
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
    const [isRinging, setIsRinging] = useState(false);
    const [currentVolume, setCurrentVolume] = useState<number>(0.3);
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // Track triggered alarms for specific minute strings to avoid double rings within the same minute:
    const triggeredMinutesRef = useRef<Record<string, string>>({});

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio('/alarm.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
            if (volumeIntervalRef.current) {
                clearInterval(volumeIntervalRef.current);
            }
        };
    }, []);

    // Unlock audio playback on first user interaction anywhere on the page
    useEffect(() => {
        const handleFirstInteraction = () => {
            const audio = audioRef.current;
            if (audio) {
                // Play and immediately pause to establish audio permission token
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    setAudioUnlocked(true);
                }).catch(() => {
                    setAudioUnlocked(true);
                });
            } else {
                setAudioUnlocked(true);
            }
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('pointerdown', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    // Load alarms from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed: Alarm[] = JSON.parse(stored);
                setAlarms(parsed);
            } else {
                // Default sample alarm for user convenience
                setAlarms([
                    {
                        id: 'default-1',
                        time: '07:30',
                        repeat: 'weekdays',
                        days: [1, 2, 3, 4, 5],
                        enabled: false,
                        label: 'Morning Alarm',
                    }
                ]);
            }
        } catch (err) {
            console.error('Failed to load alarms:', err);
        }
        setLoaded(true);
    }, []);

    // Save alarms to localStorage
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
        } catch (err) {
            console.error('Failed to save alarms:', err);
        }
    }, [alarms, loaded]);

    // Start gradual volume ramping from 30% to 100%
    const startVolumeIncrease = useCallback(() => {
        if (!audioRef.current) return;
        if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
        }

        audioRef.current.volume = 0.3;
        setCurrentVolume(0.3);

        // Increase by 5% every 6 seconds until 100% is reached
        volumeIntervalRef.current = setInterval(() => {
            if (!audioRef.current) return;
            const nextVolume = Math.min(+(audioRef.current.volume + 0.05).toFixed(2), 1.0);
            audioRef.current.volume = nextVolume;
            setCurrentVolume(nextVolume);

            if (nextVolume >= 1.0) {
                if (volumeIntervalRef.current) {
                    clearInterval(volumeIntervalRef.current);
                    volumeIntervalRef.current = null;
                }
            }
        }, 6000);
    }, []);

    // Play alarm audio and mark ringing state
    const triggerAlarm = useCallback((alarm: Alarm) => {
        setRingingAlarm(alarm);
        setIsRinging(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.3;
            startVolumeIncrease();
            audioRef.current.play().catch((err) => {
                console.warn('Audio play blocked or waiting user interaction:', err);
            });
        }
    }, [startVolumeIncrease]);

    // Stop ringing audio and reset intervals
    const stopAudio = useCallback(() => {
        if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
            volumeIntervalRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.3;
        }
        setCurrentVolume(0.3);
    }, []);

    // Snooze alarm for 10 minutes
    const snoozeAlarm = useCallback(() => {
        if (!ringingAlarm) return;
        stopAudio();
        const tenMinutesLater = Date.now() + 10 * 60 * 1000;

        if (ringingAlarm.id !== 'test-alarm') {
            setAlarms((prev) =>
                prev.map((a) =>
                    a.id === ringingAlarm.id
                        ? { ...a, snoozedUntil: tenMinutesLater }
                        : a
                )
            );
        }
        setIsRinging(false);
        setRingingAlarm(null);
    }, [ringingAlarm, stopAudio]);

    // Stop alarm completely
    const stopAlarm = useCallback(() => {
        if (!ringingAlarm) return;
        stopAudio();

        if (ringingAlarm.id !== 'test-alarm') {
            setAlarms((prev) =>
                prev.map((a) => {
                    if (a.id === ringingAlarm.id) {
                        return {
                            ...a,
                            snoozedUntil: null,
                            // If repeat was "once", disable it once stopped
                            enabled: a.repeat === 'once' ? false : a.enabled,
                        };
                    }
                    return a;
                })
            );
        }
        setIsRinging(false);
        setRingingAlarm(null);
    }, [ringingAlarm, stopAudio]);

    // Test alarm helper
    // const testAlarm = useCallback(() => {
    //     const fakeAlarm: Alarm = {
    //         id: 'test-alarm',
    //         time: currentTime
    //             ? `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`
    //             : '12:00',
    //         repeat: 'once',
    //         days: [],
    //         enabled: true,
    //         label: 'Test Alarm Ringing',
    //     };
    //     triggerAlarm(fakeAlarm);
    // }, [currentTime, triggerAlarm]);

    // Check alarms every second using useClock hook
    useEffect(() => {
        if (!currentTime || isRinging) return;

        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        const currentHHmm = `${hours}:${minutes}`;
        const currentDay = currentTime.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
        const nowMs = currentTime.getTime();
        const minuteKey = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}-${currentHHmm}`;

        for (const alarm of alarms) {
            // Check snoozed alarms first
            if (alarm.enabled && alarm.snoozedUntil && nowMs >= alarm.snoozedUntil) {
                // Clear snooze timestamp and trigger
                setAlarms((prev) =>
                    prev.map((a) => (a.id === alarm.id ? { ...a, snoozedUntil: null } : a))
                );
                triggerAlarm(alarm);
                break;
            }

            // Normal alarm schedule check
            if (!alarm.enabled) continue;

            if (alarm.time === currentHHmm) {
                // Prevent multi-firing within the same minute
                if (triggeredMinutesRef.current[alarm.id] === minuteKey) {
                    continue;
                }

                let matchesPeriodicity = false;
                switch (alarm.repeat) {
                    case 'once':
                        matchesPeriodicity = true;
                        break;
                    case 'daily':
                        matchesPeriodicity = true;
                        break;
                    case 'weekdays':
                        matchesPeriodicity = currentDay >= 1 && currentDay <= 5;
                        break;
                    case 'weekends':
                        matchesPeriodicity = currentDay === 0 || currentDay === 6;
                        break;
                    case 'custom':
                        matchesPeriodicity = alarm.days.includes(currentDay);
                        break;
                }

                if (matchesPeriodicity) {
                    triggeredMinutesRef.current[alarm.id] = minuteKey;
                    triggerAlarm(alarm);
                    break;
                }
            }
        }
    }, [currentTime, alarms, isRinging, triggerAlarm]);

    // CRUD operations
    const addAlarm = useCallback((newAlarmData: Omit<Alarm, 'id'>) => {
        const id = 'alarm-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
        const newAlarm: Alarm = { ...newAlarmData, id };
        setAlarms((prev) => [newAlarm, ...prev]);
    }, []);

    const toggleAlarm = useCallback((id: string) => {
        setAlarms((prev) =>
            prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled, snoozedUntil: null } : a))
        );
    }, []);

    const deleteAlarm = useCallback((id: string) => {
        setAlarms((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
        setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    }, []);

    return (
        <AlarmContext.Provider
            value={{
                alarms,
                ringingAlarm,
                isRinging,
                currentVolume,
                audioUnlocked,
                addAlarm,
                toggleAlarm,
                deleteAlarm,
                updateAlarm,
                snoozeAlarm,
                stopAlarm,
            }}
        >
            {children}
        </AlarmContext.Provider>
    );
}

export function useAlarm() {
    const context = useContext(AlarmContext);
    if (!context) {
        throw new Error('useAlarm must be used within an AlarmProvider');
    }
    return context;
}
