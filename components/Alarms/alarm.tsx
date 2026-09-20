'use client';
import React, { useState } from 'react';
import { useAlarm } from '@/context/AlarmContext';
import { AlarmRepeat } from '@/types/alarm';
import {
    MdAlarm,
    MdAddAlarm,
    MdDeleteOutline,
    MdLabelOutline,
    MdPlayArrow,
    MdToggleOn,
    MdToggleOff,
    MdAccessTime,
    MdRepeat,
    MdSnooze
} from 'react-icons/md';
import './alarm.css';

const REPEAT_OPTIONS: { value: AlarmRepeat; label: string }[] = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Wkdays' },
    { value: 'weekends', label: 'Wkends' },
    { value: 'custom', label: 'Custom' },
];

const DAYS_OF_WEEK = [
    { day: 1, label: 'M' },
    { day: 2, label: 'T' },
    { day: 3, label: 'W' },
    { day: 4, label: 'T' },
    { day: 5, label: 'F' },
    { day: 6, label: 'S' },
    { day: 0, label: 'S' },
];

export default function Alarms() {
    const { alarms, addAlarm, toggleAlarm, deleteAlarm} = useAlarm();

    const [newTime, setNewTime] = useState('07:30');
    const [newRepeat, setNewRepeat] = useState<AlarmRepeat>('daily');
    const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [newLabel, setNewLabel] = useState('');

    const toggleDaySelection = (day: number) => {
        setNewDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
        );
    };

    const handleCreateAlarm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTime) return;

        let selectedDays: number[] = [];
        if (newRepeat === 'daily') {
            selectedDays = [0, 1, 2, 3, 4, 5, 6];
        } else if (newRepeat === 'weekdays') {
            selectedDays = [1, 2, 3, 4, 5];
        } else if (newRepeat === 'weekends') {
            selectedDays = [0, 6];
        } else if (newRepeat === 'custom') {
            selectedDays = newDays.length > 0 ? newDays : [1, 2, 3, 4, 5];
        }

        addAlarm({
            time: newTime,
            repeat: newRepeat,
            days: selectedDays,
            enabled: true,
            label: newLabel.trim() || undefined,
        });

        setNewLabel('');
    };

    const formatRepeatLabel = (repeat: AlarmRepeat, days: number[]) => {
        switch (repeat) {
            case 'once':
                return 'Once';
            case 'daily':
                return 'Daily';
            case 'weekdays':
                return 'Mon - Fri';
            case 'weekends':
                return 'Sat - Sun';
            case 'custom': {
                const dayMap: Record<number, string> = {
                    0: 'Sun',
                    1: 'Mon',
                    2: 'Tue',
                    3: 'Wed',
                    4: 'Thu',
                    5: 'Fri',
                    6: 'Sat',
                };
                return days.map((d) => dayMap[d]).join(', ') || 'Custom';
            }
        }
    };

    return (
        <div className="alarmsContainer">
            {/* Minimal Header */}
            <div className="alarmsHeader">
                <div className="alarmsHeaderTitle">
                    <MdAlarm size={20} />
                    <span>Alarms</span>
                </div>
            </div>

            {/* Horizontal 2-Column Split for Landscape Phone */}
            <div className="alarmsLandscapeSplit">
                {/* Left Panel: Form */}
                <form className="alarmFormPanel" onSubmit={handleCreateAlarm}>
                    <div>
                        <div className="formSectionTitle">
                            <MdAccessTime size={14} />
                            <span>Set Time</span>
                        </div>
                        <div className="timeInputWrapper">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="timeInput"
                                required
                            />
                        </div>

                        <div className="formSectionTitle">
                            <MdRepeat size={14} />
                            <span>Repeat</span>
                        </div>
                        <div className="repeatButtonsGroup">
                            {REPEAT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setNewRepeat(opt.value)}
                                    className={`repeatChip ${newRepeat === opt.value ? 'repeatChipActive' : ''}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {newRepeat === 'custom' && (
                            <div className="customDaysGroup">
                                {DAYS_OF_WEEK.map(({ day, label }) => {
                                    const isSelected = newDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDaySelection(day)}
                                            className={`dayBtn ${isSelected ? 'dayBtnSelected' : ''}`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="formSectionTitle">
                            <MdLabelOutline size={14} />
                            <span>Label</span>
                        </div>
                        <div className="labelInputWrapper">
                            <input
                                type="text"
                                placeholder="e.g. Wake up, Gym, Meeting"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="labelInput"
                                maxLength={30}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btnSaveAlarm">
                        <MdAddAlarm size={18} />
                        <span>Add Alarm</span>
                    </button>
                </form>

                {/* Right Panel: Alarms List */}
                <div className="alarmsListPanel">
                    <div className="formSectionTitle mb-2">
                        <MdAlarm size={14} />
                        <span>Your Alarms ({alarms.length})</span>
                    </div>

                    {alarms.length === 0 ? (
                        <div className="emptyAlarms">
                            <MdAlarm size={36} className="opacity-30" />
                            <span>No alarms set. Add one on the left.</span>
                        </div>
                    ) : (
                        alarms.map((alarm) => {
                            const isSnoozed = alarm.snoozedUntil && alarm.snoozedUntil > Date.now();
                            return (
                                <div
                                    key={alarm.id}
                                    className={`alarmCard ${!alarm.enabled ? 'alarmCardDisabled' : ''}`}
                                >
                                    <div className="alarmCardLeft">
                                        <div className="alarmCardTime">{alarm.time}</div>
                                        <div className="alarmCardDetails">
                                            <span className="alarmCardTag">
                                                {formatRepeatLabel(alarm.repeat, alarm.days)}
                                            </span>
                                            {alarm.label && (
                                                <span className="text-neutral-400">· {alarm.label}</span>
                                            )}
                                            {isSnoozed && (
                                                <span className="alarmSnoozeTag">
                                                    <MdSnooze size={12} />
                                                    <span>Snoozed</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="alarmCardRight">
                                        <button
                                            type="button"
                                            className={`iconToggleBtn ${alarm.enabled ? 'iconToggleBtnOn' : 'iconToggleBtnOff'}`}
                                            onClick={() => toggleAlarm(alarm.id)}
                                            title={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
                                        >
                                            {alarm.enabled ? (
                                                <MdToggleOn size={32} />
                                            ) : (
                                                <MdToggleOff size={32} />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="deleteAlarmBtn"
                                            onClick={() => deleteAlarm(alarm.id)}
                                            title="Delete alarm"
                                        >
                                            <MdDeleteOutline size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}