import React, { useState } from 'react';

const UserProfile = ({ username, projectsCount }) => {
    const [isProfileVisible, setProfileVisible] = useState(false);
    const [isExiting, setExiting] = useState(false);

    const toggleProfile = () => {
        if (isProfileVisible) {
            setExiting(true);
            setTimeout(() => {
                setProfileVisible(false);
                setExiting(false);
            }, 500);
        } else {
            setProfileVisible(true);
        }
    };

    return (
        <div>
            <button className="home-header-button-profile" onClick={toggleProfile}>
                
            </button>

            {isProfileVisible && (
                <div className="overlay">
                    <div className={`profile-container ${isExiting ? 'slide-up' : 'slide-down'}`}>
                        <button className="close-button" onClick={toggleProfile}>✖</button>

                        <div className="profile-container-block-photo"></div>

                        <div className="profile-container-block-data">
                            <div className="profile-container-block-data-name">Name: {username}</div>
                            <div className="profile-container-block-projects">Projects: {projectsCount}</div>

                            <button className="profile-container-block-email"></button>

                            <button className="profile-container-block-friends"></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
