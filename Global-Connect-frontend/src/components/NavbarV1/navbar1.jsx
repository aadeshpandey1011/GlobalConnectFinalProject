import React from 'react'
import { Link } from 'react-router-dom'
const Navbar1 = () => {
    return (
        <nav className='w-[100%] bg-gray-100 md:px-[100px] px-[20px] flex justify-between py-4 box-border'>
            <Link to={'/'} className=" flex justify-between">
                {
                    <div className="flex gap-1 items-center cursor-pointer">
                        <h3 className='text-red-400 font-bold text-3xl'>Global</h3>
                        <img src="/images/newlogo.png" width={50} height={50} alt="Global connect logo" />
                        <h3 className='text-red-400 font-bold text-3xl'>Connect</h3>
                    </div>
                }
            </Link>

            <div className="flex box-border md:gap-4 gap-2 justify-center items-center">
                <Link to={'/signUp'} className="md:px-4 md:py-2 box-border text-black rounded-3xl text-xl hover:bg-gray-200 cursor-pointer">Join now</Link>
                <Link to={'/login'} className="px-4 py-2 box-border border-1 text-red-400 border-red-400 rounded-3xl text-xl hover:bg-blue-50 cursor-pointer">Sign in</Link>
            </div>
        </nav>
    )
}

export default Navbar1
// updated navbar1 code you can copy it out 