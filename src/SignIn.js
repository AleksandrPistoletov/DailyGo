import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const csrfToken = getCSRFToken();
    console.log("Получен CSRF токен:", csrfToken);

    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post(
                '/api/token/',
                { username, password },
                { headers: { 'X-CSRFToken': csrfToken } }
            );

            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('username', username); 

                navigate('/home');
            }
        } catch (error) {
            console.error("Ошибка при входе:", error.response?.data || "Неожиданная ошибка");
            alert("An error occurred while trying to sign in. Please try again.");
        }
    };


    return (
        <div class="sign-in-page">

            <div class="sign-up-page-logo"></div>
            <div class="sign-up-page-container">



                <h2>Sign In</h2>
                <form onSubmit={handleSignIn} class="form-container">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div class="button-container">
                        <button className="welcome-bitton-singin" type="submit"></button>
                        <button className="sign-in-page-singup" type="button" onClick={() => navigate('/signup')}></button>
                    </div>
                </form>



            
            </div>
            
        </div>






    );
};

function getCSRFToken() {
    const name = 'csrftoken';
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    console.log("Получение CSRF-токена из cookies:", cookieValue);
    return cookieValue ? cookieValue.split('=')[1] : null;
}

export default SignIn;
