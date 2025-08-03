import React from 'react'
import Card from '../Card/card'
import { Link } from 'react-router-dom'

const ProfileCard = (props) => {
    return (
        <Card padding={0}>
            <Link to={`/profile/${props.data?._id}`} className='relative h-25'>
                <div className='relative w-full h-22 rounded-md'>
                    <img src={props.data?.cover_pic} className='rounded-t-md h-full w-full' />
                </div>
                <div className='absolute top-14 left-6 z-10'>
                    <img src={props?.data?.profilePic} className='rounded-full border-2 h-16 w-16 border-white cursor-pointer' />
                </div>
            </Link>
            <div className='p-5'>
                {/* 
                        Please Watch the video for full code
                    */}
            </div>
        </Card>
    )
}

export default ProfileCard