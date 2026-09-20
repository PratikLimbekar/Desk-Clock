'use client';
import React from 'react';
import { useAlarm } from '@/context/AlarmContext';
import { useClock } from '@/hooks/useClock';
import { MdAlarm, MdAlarmOff, MdSnooze, MdVolumeUp, MdNotificationsActive } from 'react-icons/md';
import './statusBar.css';

interface StatusBarProps {
    extraContent?: React.ReactNode;
}

export default function StatusBar({ extraContent }: StatusBarProps) {
    const { ringingAlarm, isRinging, currentVolume, snoozeAlarm, stopAlarm, alarms } = useAlarm();
    const time = useClock();

    // Check for snoozed alarm
    const snoozedAlarm = alarms.find((a) => a.snoozedUntil && a.snoozedUntil > Date.now());
    const snoozeMinutesLeft = snoozedAlarm?.snoozedUntil
        ? Math.max(1, Math.ceil((snoozedAlarm.snoozedUntil - Date.now()) / 60000))
        : null;

    // Check for next upcoming enabled alarm
    const nextAlarm = alarms
        .filter((a) => a.enabled && (!a.snoozedUntil || a.snoozedUntil <= Date.now()))
        .sort((a, b) => a.time.localeCompare(b.time))[0];

    const currentTimeString = time?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    if (isRinging && ringingAlarm) {
        return (
            <div className="statusBarContainer statusBarRinging">
                <div className="ringingInfo">
                    <MdAlarm className="ringingIconPulse" />
                    <div className="ringingDetails">
                        <div className="ringingTitle">
                            <span>{ringingAlarm.label || 'Alarm'}</span>
                            <span className="text-red-400 font-mono text-sm">({currentTimeString})</span>
                        </div>
                        <div className="ringingSub">
                            <MdVolumeUp />
                            <span>Escalating volume: {Math.round(currentVolume * 100)}%</span>
                        </div>
                    </div>
                </div>

                <div className="ringingActions">
                    <button
                        type="button"
                        className="btnSnooze"
                        onClick={snoozeAlarm}
                        title="Snooze for 10 minutes"
                    >
                        <MdSnooze size={18} />
                        <span>Snooze (10m)</span>
                    </button>
                    <button
                        type="button"
                        className="btnStop"
                        onClick={stopAlarm}
                        title="Stop alarm"
                    >
                        <MdAlarmOff size={18} />
                        <span>Stop Alarm</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="statusBarContainer statusBarIdle">
            <div className="statusBarIdleLeft">
                {snoozedAlarm && snoozeMinutesLeft && (
                    <div className="statusSnoozeBadge">
                        <MdSnooze size={14} />
                        <span>Snoozed: rings in {snoozeMinutesLeft}m</span>
                    </div>
                )}
                {nextAlarm && !snoozedAlarm && (
                    <div className="statusUpcomingBadge">
                        <MdAlarm size={14} />
                        <span>Next: {nextAlarm.time} {nextAlarm.label ? `· ${nextAlarm.label}` : ''}</span>
                    </div>
                )}
                {extraContent}
            </div>
                {/* Idle Status Bar */}
            {/* <div className="statusBarIdleRight">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <MdNotificationsActive size={14} />
                    <span>{alarms.filter((a) => a.enabled).length} active</span>
                </div>
            </div> */}
        </div>
    );
}
