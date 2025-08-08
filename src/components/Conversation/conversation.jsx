// import React, { useEffect, useState } from 'react'

// const Conversation = ({ item, key, ownData, handleSelectedConv, activeConvId }) => {

//     const [memberData, setMemberData] = useState(null)

//     useEffect(() => {
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }, [])


//     const handleClickFunc = async()=>{
//         handleSelectedConv(item?._id,memberData)
//     }

//     return (
//         <div onClick={handleClickFunc} key={key} className={`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConvId===item?._id?'bg-gray-200':null}`}>
//             <div className='shrink-0'>
//                 <img className='w-12 h-12 rounded-[100%] cursor-pointer' src={memberData?.profilePic} />
//             </div>
//             <div>
//                 <div className="text-md">{memberData?.f_name}</div>
//                 <div className="text-sm text-gray-500">{memberData?.headline}</div>
//             </div>
//         </div>
//     )
// }

// export default Conversation

import React, { useEffect, useState } from 'react'

const Conversation = ({ item, key, ownData, handleSelectedConv, activeConvId }) => {

    const [memberData, setMemberData] = useState(null)

    useEffect(() => {
        {/* 
                        Please Watch the video for full code
                    */}
    }, [])


    const handleClickFunc = async()=>{
        handleSelectedConv(item?._id,memberData)
    }

    return (
        <div onClick={handleClickFunc} key={key} className={`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConvId===item?._id?'bg-gray-200':null}`}>
            <div className='shrink-0'>
                <img className='w-12 h-12 rounded-[100%] cursor-pointer' src={memberData?.profilePic} />
            </div>
            <div>
                <div className="text-md">{memberData?.f_name}</div>
                <div className="text-sm text-gray-500">{memberData?.headline}</div>
            </div>
        </div>
    )
}

export default Conversation