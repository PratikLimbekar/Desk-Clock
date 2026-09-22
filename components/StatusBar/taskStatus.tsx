//BIG ISSUE: Google Tasks API does not 

'use client';

import React from 'react';
import { MdAssignment, MdWarning } from 'react-icons/md';
import { useTasks } from '@/hooks/useTasks';

import '@/components/StatusBar/statusBar.css';

export default function TaskStatus() {
    const { tasks } = useTasks();

    const tasksWithDueDates = tasks.filter(
        (task) => task.status !== 'completed' && task.due
    );

    if (tasksWithDueDates.length === 0) {
        return null;
    }

    // Sort by due date
    const sortedTasks = [...tasksWithDueDates].sort(
        (a, b) =>
            new Date(a.due!).getTime() -
            new Date(b.due!).getTime()
    );

    const task = sortedTasks[0];

    // Get today's date in local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //extract year-month-day
    const dueDateString = task.due!.split('T')[0];

    const [year, month, day] = dueDateString
        .split('-')
        .map(Number);

    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const difference =
        dueDate.getTime() - today.getTime();

    const daysUntilDue =
        difference / (24 * 60 * 60 * 1000);

    let message = '';

    if (daysUntilDue < 0) {
        message = 'Overdue';
    } else if (daysUntilDue === 0) {
        message = 'Due today';
    } else if (daysUntilDue === 1) {
        message = 'Due tomorrow';
    } else {
        message = `Due in ${daysUntilDue}d`;
    }

    const isOverdue = daysUntilDue < 0;

    return (
        <div
            className={`statusBarItem ${
                isOverdue
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