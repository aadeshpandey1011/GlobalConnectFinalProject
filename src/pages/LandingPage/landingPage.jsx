import React from 'react'
import { Link } from 'react-router-dom'
import GoogleLoginComp from '../../components/GoogleLogin/googleLoginComp'
const LandingPage = (props) => {
  return (
    <div className="my-4 py-[50px] md:pl-[120px] px-5 md:flex justify-between ">
        <div className="md:w-[40%]">
          {/* 
                        Please Watch the video for full code
                    */}
        </div>
        <div className="md:w-[50%] h-120">
          <img alt="image" className='w-full h-full' src={'/images/globalconnect.jpeg'} />
        </div>
      </div>
  )
}

export default LandingPage
// landing page logo update 