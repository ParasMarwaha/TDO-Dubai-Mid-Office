import React, { useState } from 'react';
import ControlPanelAuth from '../PasswordProtectedRoutes/PasswordPromt.jsx';

const ProtectedRoute = ({ component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <>
            {!isAuthenticated ? (
                <ControlPanelAuth onAuthSuccess={setIsAuthenticated} />
            ) : (
                component
            )}
        </>
    );
};

export default ProtectedRoute;
