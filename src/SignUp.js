import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   
    axios.defaults.headers.post['X-CSRFToken'] = getCSRFToken();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post('/api/register/', { username, password });
            

            
            const token = response.data.token;
            localStorage.setItem('access_token', token);
            localStorage.setItem('username', username);

            navigate('/home');
        } catch (error) {
            console.error("Registration error:", error.response?.data || "An unexpected error occurred.");
            alert("An error occurred during registration. Please try again.");
        }
    };

    return (

        <div class="sign-up-page">

            <div class="sign-up-page-logo"></div>
            <div class="sign-up-page-container">

                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp} class="form-container">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div class="button-container">
                        <button className="sign-up-page-singup" type="submit"></button>
                        <button className="sign-up-page-singin" type="button" onClick={() => navigate('/signin')}></button>
                    </div>
                </form>

            </div>
            
        </div>


    );
};


function getCSRFToken() {
    const name = 'csrftoken';
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return cookieValue ? cookieValue.split('=')[1] : null;
}

export default SignUp;
