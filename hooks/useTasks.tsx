//NOT A HOOK, it is both context and hook
'use client';

import {
    createContext, useContext, useEffect, useState, ReactNode
} from "react";
import { Task } from "@/types/task";

type TaskContextType = {
    tasks: Task[];
    connected: boolean;
    loading: boolean;

    addTask: (title: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined); //creates a space where react can store info

//owns tasks and exposes them to its children
//so if a component is between <TaskProvider></TaskProvider>, it can access tasks and funcitons and shit
export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    async function refreshTasks() {
        try {
            const response = await fetch("/api/tasks");
            const data = await response.json();

            if (response.status === 401) {
                setConnected(false);
                return;
            }

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setConnected(true);
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }

    async function addTask(title: string) {
    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        console.error("Failed to create task");
        return;
    }

    const newTask = await response.json();

    setTasks((currentTasks) => [...currentTasks, newTask]);
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
    useEffect(() => {
        refreshTasks();

        const interval = setInterval(() => {
            refreshTasks();
        }, 30000);

        return () => {
            clearInterval(interval);
        }
    }, []); 

    return(
        <TaskContext.Provider value={{
            tasks, connected, loading, addTask, completeTask, deleteTask
        }}>
            {children}
        </TaskContext.Provider>
    );
}


export function useTasks() {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error("useTasks must be used inside a TaskProvider");//if someone calls hook, make sure it is inside <TaskProvider>
    }

    return context;
}

