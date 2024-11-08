import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">

            <div className="welcome-page-container">

                <h1>Welcome</h1>
                <div className="button-container">
                    <button className="welcome-bitton-singup" onClick={() => navigate('/signup')}></button>
                    <button className="welcome-bitton-singin" onClick={() => navigate('/signin')}></button>
                </div>

            </div>
            
        </div>

    );
};

export default WelcomePage;
