import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                await API.get('/api/users/check-auth');
                setIsAuth(true);
            } catch (err) {
                setIsAuth(false);
            }
        };
        verify();
    }, []);

    if (isAuth === null) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;