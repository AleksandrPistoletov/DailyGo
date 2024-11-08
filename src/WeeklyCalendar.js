import React, { useState } from 'react';

const WeeklyCalendar = ({ tasks, onClose, onCompleteTask }) => {
    const [selectedDayTasks, setSelectedDayTasks] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [openDescriptions, setOpenDescriptions] = useState({});

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

       
        const tasksForDay = tasks.filter(task => task.calculation_date && task.calculation_date.startsWith(dateString));

        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: dateString,
            displayDate: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            taskCount: tasksForDay.length, 
        };
    });

    const handleDayClick = (date) => {
        const tasksForDay = tasks.filter(task => task.calculation_date && task.calculation_date.startsWith(date));
        setSelectedDayTasks(tasksForDay);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const toggleDescription = (index) => {
        setOpenDescriptions((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const completeTask = async (taskId) => {
        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            const response = await fetch('/api/complete-task/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ task_id: taskId }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert("Task completed successfully!");
                    onCompleteTask();

                   
                    setSelectedDayTasks(prevTasks =>
                        prevTasks.map(task =>
                            task.id === taskId ? { ...task, final_date: new Date().toISOString() } : task
                        )
                    );
                } else {
                    alert(data.message || "Error completing task");
                }
            } else {
                console.error("Failed to complete task:", response.status);
                alert("Failed to complete task. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            {isPopupVisible && <div className="overlay" onClick={closePopup}></div>}
            <div className="weekly-calendar">
                <div className="calendar-days">
                    {daysOfWeek.map(({ day, date, displayDate, taskCount }) => (
                        <div key={date} className="calendar-day" onClick={() => handleDayClick(date)}>
                            <p>{day}</p>
                            <p>{displayDate}</p>
                            <p>Tasks: {taskCount}</p> {}
                        </div>
                    ))}
                </div>
            </div>
            {isPopupVisible && (
                <div className={`task-popup ${isPopupVisible ? 'slide-in' : ''}`}>
                    <button className="close-popup-button" onClick={closePopup}>✖</button>
                    <h3>Tasks for Selected Day:</h3>
                    <ul>
                        {selectedDayTasks.map((task, index) => (
                            <li key={task.id} className="task-block">
                                <div className="task-title">
                                    <strong>{task.title || 'Untitled Task'}</strong>
                                </div>
                                <div className="task-controls">
                                    <button onClick={() => toggleDescription(index)} className="toggle-description-button">
                                        {openDescriptions[index] ? 'Hide Description' : 'Show Description'}
                                    </button>
                                </div>
                                {openDescriptions[index] && (
                                    <p>{task.description || 'No description provided'}</p>
                                )}
                                <div className="task-status">
                                    {task.final_date ? (
                                        <p>Status: Completed</p>
                                    ) : (
                                        <button onClick={() => completeTask(task.id)} className="complete-task-button">Complete Task</button>
                                    )}
                                </div>
                                <p>Calculation Date: {task.calculation_date || 'Not specified'}</p>
                            </li>

                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default WeeklyCalendar;
