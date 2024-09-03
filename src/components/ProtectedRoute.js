import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

const updateToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    
    try {
        const res = await axios.post(baseURL + '/token/refresh/', {
            'refresh': refreshToken
        });
        
        if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const fetchUserDetails = async () => {
    const token = localStorage.getItem('access');
    
    try {
        const res = await axios.get(baseURL + '/user/details/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        return {
            is_superuser: res.data.is_superuser,
            is_professional: res.data.is_professional // Assuming this field exists in the API response
        };
    } catch (error) {
        return { is_superuser: false, is_professional: false };
    }
};

const isAuthUser = async () => {
    const accessToken = localStorage.getItem("access");
    
    if (!accessToken) {
        return { 'name': null, isAuthenticated: false, isAdmin: false, isProfessional: false };
    }
    
    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);
    
    if (decoded.exp > currentTime) {
        let userDetails = await fetchUserDetails();
        return { 
            'name': decoded.first_name, 
            isAuthenticated: true, 
            isAdmin: userDetails.is_superuser,
            isProfessional: userDetails.is_professional
        };
    } else {
        const updateSuccess = await updateToken();
        
        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let userDetails = await fetchUserDetails();
            return { 
                'name': decoded.first_name, 
                isAuthenticated: true, 
                isAdmin: userDetails.is_superuser,
                isProfessional: userDetails.is_professional
            };
        } else {
            return { 'name': null, isAuthenticated: false, isAdmin: false, isProfessional: false };
        }
    }
};

const ProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isProfessional: false,
        isLoading: true
    });
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const authInfo = await isAuthUser();
            setAuthState({
                isAuthenticated: authInfo.isAuthenticated,
                isProfessional: authInfo.isProfessional,
                isLoading: false
            });
        };
        checkAuth();
    }, []);

    if (authState.isLoading) {
        return <div>Loading...</div>; // Or any loading indicator
    }

    if (authState.isAuthenticated && authState.isProfessional) {
        return <Navigate to="/professional/home" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;