'use client';
import '@/components/Tasks/tasks.css';
import { MdDeleteOutline } from "react-icons/md";
import { useTasks } from '@/hooks/useTasks';

export default function Tasks() {
    const { tasks, connected, loading, completeTask, addTask, deleteTask } = useTasks();

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

                <button
                    className="add-task"
                    onClick={() => {
                        const title = prompt("Task name:");

                        if (title?.trim()) {
                            addTask(title.trim());
                        }
                    }}
                >
                    +
                </button>
            </div>

            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <p className="empty">No tasks.</p>
                ) : (
                    tasks.map((task) => (
                        <div className="task" key={task.id}>
                            <button className='task-check' onClick={() => completeTask(task.id)} aria-label={`Complete ${task.title}`} />

                            <div className="task-content">
                                <span className="task-title">
                                    {task.title}
                                </span>
                                {task.due && (
                                    <span className="task-due">
                                        {new Date(task.due).toLocaleDateString()}
                                    </span>
                                )}
                                <button onClick={() => deleteTask(task.id)}><MdDeleteOutline /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
