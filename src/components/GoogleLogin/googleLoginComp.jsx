import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComp = (props) => {

    const navigate= useNavigate();
    const handleOnSucess = async (credResponse) => {
        {/* 
                        Please Watch the video for full code
                    */}
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