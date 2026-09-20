export type AlarmRepeat = 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Alarm {
    id: string;
    time: string; // HH:mm format (24-hour)
    repeat: AlarmRepeat;
    days: number[]; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    enabled: boolean;
    label?: string;
    snoozedUntil?: number | null; // Timestamp (ms) if snoozed
}

export interface AlarmContextType {
    alarms: Alarm[];
    ringingAlarm: Alarm | null;
    isRinging: boolean;
    currentVolume: number;
    audioUnlocked: boolean;
    addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
    toggleAlarm: (id: string) => void;
    deleteAlarm: (id: string) => void;
    updateAlarm: (id: string, updates: Partial<Alarm>) => void;
    snoozeAlarm: () => void;
    stopAlarm: () => void;
    testAlarm: () => void;
}
