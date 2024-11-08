import React, { useState } from 'react';

const TaskForm = ({ onSave }) => {
    const [task, setTask] = useState({
        title: '',
        task_description: '',
        task_project: '',
        create_date: new Date().toISOString(),
        calculation_date: '',
        final_date: ''
    });

    const [isFormVisible, setFormVisible] = useState(false);
    const [isExiting, setExiting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task);
        handleCloseClick();
    };

    const handleCreateClick = () => {
        setTask({
            title: '',
            task_description: '',
            task_project: '',
            create_date: new Date().toISOString(),
            calculation_date: '',
            final_date: ''
        });
        setFormVisible(true);
    };

    const handleCloseClick = () => {
        setExiting(true); 
        setTimeout(() => {
            setExiting(false);
            setFormVisible(false); 
        }, 500); 
    };

    return (
        <div>
            <button className='home-menu-left-button-create-task'  onClick={handleCreateClick}></button>
            {isFormVisible && (
                <div className={`overlay ${isExiting ? 'exiting' : ''}`}>
                    <div className={`task-form-container ${isExiting ? 'exiting' : ''}`}>
                        <button className="close-button" onClick={handleCloseClick}>✖</button>
                        <form onSubmit={handleSubmit} className="task-form">
                            <input
                                type="text"
                                name="title"
                                placeholder="Task title"
                                required
                                value={task.title}
                                onChange={handleChange}
                            />
                            <textarea
                                name="task_description"
                                placeholder="Description of the task"
                                value={task.task_description}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="task_project"
                                placeholder="Project"
                                value={task.task_project}
                                onChange={handleChange}
                            />
                            <input
                                type="datetime-local"
                                name="calculation_date"
                                value={task.calculation_date}
                                onChange={handleChange}
                            />
                            <button type="submit">Save task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskForm;
