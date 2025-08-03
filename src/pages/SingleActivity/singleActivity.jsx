import React, { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import Card from '../../components/Card/card'
import Post from '../../components/Post/post'
import Advertisement from '../../components/Advertisement/advertisement'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const SingleActivity = () => {

    const { id, postId } = useParams();

    const [post,setPost] = useState(null)
    const [ownData, setOwnData] = useState(null);


    const fetchDataOnLoad = async () => {
        // Please Watch the video for full code
    }

    useEffect(() => {
        fetchDataOnLoad()
        let userData = localStorage.getItem('userInfo')
        setOwnData(userData ? JSON.parse(userData) : null)
    }, [])

    return (
        <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
            {/* left side */}
            <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
                {/* 
                        Please Watch the video for full code
                    */}



            </div>

            {/* middle side */}
            <div className='w-[100%] py-5 sm:w-[50%] '>
                    
                    {/* 
                        Please Watch the video for full code
                    */}
                
            </div>

            {/* right side */}
            <div className='w-[26%] py-5 hidden md:block'>



                {/* 
                        Please Watch the video for full code
                    */}

            </div>

        </div>
    )
}

export default SingleActivity