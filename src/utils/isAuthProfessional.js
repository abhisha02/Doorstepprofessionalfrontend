
import {jwtDecode}from "jwt-decode";
import axios from 'axios';

const baseURL = 'https://doorsteppro.shop';

const updateProfessionalToken = async () => {
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

const fetchisProfessional = async () => {
    const token = localStorage.getItem('access');
    
    try {
        const res = await axios.get(baseURL + '/user/details/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return res.data.is_professional; // Return directly from the function
      

    } catch (error) {
        return false;
    }
};

const isAuthProfessional = async () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        return { 'name': null, isAuthenticated: false, isProfessional: false };
    }

    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);

    if (decoded.exp > currentTime) {
        let checkProfessional = await fetchisProfessional(); // Await the result
        return { 'name': decoded.name, isAuthenticated: true, isProfessional: checkProfessional };
    } else {
        const updateSuccess = await updateProfessionalToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let checkProfessional = await fetchisProfessional(); // Await the result
            return { 'name': decoded.name, isAuthenticated: true, isProfessional: checkProfessional };
        } else {
            return { 'name': null, isAuthenticated: false, isProfessional: false };
        }
    }
};

export default isAuthProfessional;