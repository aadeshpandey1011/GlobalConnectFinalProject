import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComp = (props) => {

    const navigate= useNavigate();
    const handleOnSucess = async (credResponse) => {
        const token = credResponse.credential;
        const res = await axios.post('https://globalconnectfinalproject.onrender.com/api/auth/google', { token }, { withCredentials: true });

        localStorage.setItem('isLogin', 'true');
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.jwttoken); // Store token here
        props.changeLoginValue(true)
        navigate('/feeds')

    }
    return (
        <div className='w-full'>
            <GoogleLogin
                onSuccess={(credentialResponse) => handleOnSucess(credentialResponse)}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    )
}

export default GoogleLoginComp
