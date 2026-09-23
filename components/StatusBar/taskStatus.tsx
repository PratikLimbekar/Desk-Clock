//BIG ISSUE: Google Tasks API does not 

'use client';

import React from 'react';
import { MdAssignment, MdWarning } from 'react-icons/md';
import { useTasks } from '@/hooks/useTasks';

import '@/components/StatusBar/statusBar.css';

export default function TaskStatus() {
    const { tasks } = useTasks();

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const task = tasks.find((task) => task.status !== 'completed' && task.due && new Date(task.due) <= today);

    if (!task) return null;

    const dueDate = new Date(task.due!);
    dueDate.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const isOverdue = dueDate < todayStart;
    const message = isOverdue ? 'Overdue' : 'Due today';

    // // Get today's date in local time
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);

    // //extract year-month-day
    // const dueDateString = task.due!.split('T')[0];

    // const [year, month, day] = dueDateString
    //     .split('-')
    //     .map(Number);

    // const dueDate = new Date(year, month - 1, day);
    // dueDate.setHours(0, 0, 0, 0);

    // const difference =
    //     dueDate.getTime() - today.getTime();

    // const daysUntilDue =
    //     difference / (24 * 60 * 60 * 1000);

    // let message = '';

    // if (daysUntilDue < 0) {
    //     message = 'Overdue';
    // } else if (daysUntilDue === 0) {
    //     message = 'Due today';
    // } else if (daysUntilDue === 1) {
    //     message = 'Due tomorrow';
    // } else {
    //     message = `Due in ${daysUntilDue}d`;
    // }

    // const isOverdue = daysUntilDue < 0;

    return (
        <div
            className={`statusBarItem ${isOverdue
                    ? 'statusTask statusTaskUrgent'
                    : 'statusTask'
                }`}
        >
            {isOverdue ? (
                <MdWarning size={14} />
            ) : (
                <MdAssignment size={14} />
            )}

            <span>
                {task.title} - {message}
            </span>
        </div>
    );
}