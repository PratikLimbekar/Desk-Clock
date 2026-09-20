'use client';
import '@/components/tasks/tasks.css';
import {MdDeleteOutline} from "react-icons/md";

import { useState, useEffect } from "react";

type Task = {
    id: string;
    title: string;
    notes?: string;
    due?: string;
    status: string;
};

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    async function addTask() {
        const title = prompt("Task name: ");

        if (!title?.trim()) {return;}

        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({title: title.trim()}),
        });

        if (!response.ok) {
            console.error("Failed to create task"); return;
        }

        const newTask = await response.json();

        setTasks((tasks) => [...tasks, newTask]);
    }

    async function completeTask(taskId: string) {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH"
        });
        if (!response.ok) {
            console.error("Failed to complete task.");
            return;
        }
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    }

    async function deleteTask(taskId: string) {
        const response = await fetch(`/api/tasks/delete/${taskId}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            console.error("Failed to delete task");
            return;
        }
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    }

    async function getTasks() {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (response.status === 401) {
            setConnected(false);
            setLoading(false);
            return;
        }

        if (!response.ok) {
            console.error(data.error);
            setLoading(false);
            return;
        }

        setConnected(true);
        setTasks(data);
        setLoading(false);
    }

    useEffect(() => {
        getTasks();

        const interval = setInterval(() => {
            getTasks();
        }, 30000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!connected) {
        return (
            <div>
                <p>Connect your Google account to see your tasks.</p>

                <a href="/api/auth/google">
                    <button>
                        Connect Google Tasks
                    </button>
                </a>
            </div>
        );
    }

    return (
    <div className="tasks">
        <div className="tasks-header">
            <div>
                <h2>Tasks</h2>
                <span>{tasks.length} tasks</span>
            </div>

            <button className="add-task" onClick={addTask}>
                +
            </button>
        </div>

        <div className="tasks-list">
            {tasks.length === 0 ? (
                <p className="empty">No tasks.</p>
            ) : (
                tasks.map((task) => (
                    <div className="task" key={task.id}>
                        <button className='task-check' onClick={() => completeTask(task.id)} aria-label={`Complete ${task.title}`}/>

                        <div className="task-content">
                            <span className="task-title">
                                {task.title}
                            </span>
                            {task.due && (
                                <span className="task-due">
                                    {new Date(task.due).toLocaleDateString()}
                                </span>
                            )}
                            <button onClick={() => deleteTask(task.id)}><MdDeleteOutline/></button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
}