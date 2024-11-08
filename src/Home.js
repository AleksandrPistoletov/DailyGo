import React, { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import PieChart from './PieChart';
import BarChart from './BarChart';
import UserProfile from './UserProfile';
import WeeklyTasksChart from './WeeklyTasksChart';
import WeeklyCalendar from './WeeklyCalendar';



import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('Welcome to the Home Page');
    const [username, setUsername] = useState(localStorage.getItem('username') || 'User');
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], values: [] });
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [tasksExpiringToday, setTasksExpiringToday] = useState(0);
    const [currentTasksCount, setCurrentTasksCount] = useState(0);
    const [doneTasksCount, setDoneTasksCount] = useState(0);
    const [overdueTasksCount, setOverdueTasksCount] = useState(0);
    const [isActive, setIsActive] = useState(false);

   
    const toggleActiveClass = () => setIsActive(prevState => !prevState);

    const toggleCalendar = () => {
        if (!isCalendarVisible) {  
            setCalendarVisible(true);
        }
    };






    

    const uniqueProjectsCount = [...new Set(tasks.map(task => task.project))].filter(Boolean).length;


    function getCsrfToken() {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return '';
    }

    const saveTask = async (task) => {
        const csrfToken = getCsrfToken();
        const token = localStorage.getItem('access_token');
        const taskWithCreateDate = { ...task, create_date: new Date().toISOString() };

        try {
            const response = await fetch('/api/save-task/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskWithCreateDate)
            });

            const data = await response.json();
            if (data.success) {
                fetchTasks();
            } else {
                alert('Error saving task.');
            }
        } catch (error) {
            console.error('An error occurred while saving the task:', error);
            alert('An error occurred while saving the task.');
        }
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch('/api/get-tasks/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok && data.tasks) {
                setTasks(data.tasks);
                countTasksExpiringToday(data.tasks);
                countCurrentTasks(data.tasks);
                countDoneTasks(data.tasks);
                countOverdueTasks(data.tasks);
                updateChartData(data.tasks);
            } else {
                console.error('Error fetching tasks:', data);
            }
        } catch (error) {
            console.error('An error occurred while fetching tasks:', error);
        }
    };

    const updateChartData = (tasks) => {
        if (!tasks || tasks.length === 0) {
            setChartData({ labels: [], values: [] });
            return;
        }

        const projectCounts = tasks.reduce((acc, task) => {
            const project = task.project || 'No Project'; 
            acc[project] = (acc[project] || 0) + 1;
            return acc;
        }, {});

        setChartData({
            labels: Object.keys(projectCounts),
            values: Object.values(projectCounts),
        });
    };














    const countTasksExpiringToday = (tasks) => {
        const today = new Date().toISOString().split('T')[0];
        const count = tasks.filter(task => !task.final_date && task.calculation_date && task.calculation_date.startsWith(today)).length;
        setTasksExpiringToday(count);
    };

    const countCurrentTasks = (tasks) => {
        const now = new Date();
        const count = tasks.filter(task => !task.final_date && new Date(task.calculation_date) > now).length;
        setCurrentTasksCount(count);
    };

    const countDoneTasks = (tasks) => {
        const count = tasks.filter(task => task.final_date).length;
        setDoneTasksCount(count);
    };

    const countOverdueTasks = (tasks) => {
        const count = tasks.filter(task => task.final_date && new Date(task.final_date) > new Date(task.calculation_date)).length;
        setOverdueTasksCount(count);
    };

    const updateGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 12) {
            setGreeting(`Good Morning, ${username}`);
        } else if (currentHour >= 12 && currentHour < 16) {
            setGreeting(`Good Day, ${username}`);
        } else if (currentHour >= 16 && currentHour < 23) {
            setGreeting(`Good Evening, ${username}`);
        } else {
            setGreeting(`Good Night, ${username}`);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/signin');
        } else {
            updateGreeting();
            fetchTasks();
        }
    }, [navigate]);

    return (
        <div className="home-page">




            <div className="home-header">
                <div className="home-header-logo"></div>


               

                <UserProfile username={username} projectsCount={uniqueProjectsCount} />



            </div>





            <div className="home-content">


                <div className={`home-menu-left ${isActive ? 'active' : ''}`}>
                    

                    <button className={`home-menu-left-button ${isActive ? 'active' : ''}`} onClick={toggleActiveClass}></button>

                    <TaskForm onSave={saveTask} />
                    
                    <button
                        className={`home-menu-left-button-create-task-home ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (isCalendarVisible) setCalendarVisible(false); 
                        }}
                    >
                        
                    </button>




                    <button className={`home-menu-left-button-create-task-calendar ${isActive ? 'active' : ''}`} onClick={() => setCalendarVisible(true)}></button>
                   
                </div>




               


                <div className={`home-content-right ${isActive ? 'active' : ''}`}>
                    {isCalendarVisible ? (
                        <WeeklyCalendar tasks={tasks} onClose={() => setCalendarVisible(false)} onCompleteTask={fetchTasks} />
                    ) : (
                        <>
                            <div className="home-content-right-up">
                                <h1>{greeting}</h1>
                            </div>
                            <div className="home-content-right-lw">
                                {}
                                <div className="home-content-right-lw-1">
                                    <RealTimeClock />
                                    <p>Expires Today: {tasksExpiringToday}</p>
                                    <p>Current: {currentTasksCount}</p>
                                    <p>Done: {doneTasksCount}</p>
                                    <p>Overdue: {overdueTasksCount}</p>
                                </div>
                                <div className="home-content-right-lw-2">
                                    <div className="chart-container">
                                        <h2>Weekly Tasks Forecast</h2>
                                        <WeeklyTasksChart tasks={tasks} />
                                    </div>
                                    <div className="chart-container">
                                        <h2 className="home-zag">Completed vs Overdue Tasks</h2>
                                        <BarChart completedTasks={doneTasksCount} overdueTasks={overdueTasksCount} />
                                    </div>
                                </div>
                                <div className="home-content-right-lw-3">
                                    <div className="diogramm1">
                                        <h2>Tasks by Project</h2>
                                        <PieChart data={chartData} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


            </div>
        </div>
    );
};

const RealTimeClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const formattedDate = currentTime.toLocaleDateString();

    return (
        <div>
            <h2>Current Date: {formattedDate}</h2>
            {}
        </div>
    );
};

export default Home;
