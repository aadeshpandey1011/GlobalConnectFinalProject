// import React, { useState, useEffect, useRef } from 'react'
// import Card from '../../components/Card/card'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import Conversation from '../../components/Conversation/conversation';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import ImageIcon from '@mui/icons-material/Image';
// import Advertisement from '../../components/Advertisement/advertisement';
// import axios from 'axios';
// import socket from '../../../socket';

// const Messages = () => {

//     const [conversations, setConversations] = useState([]);

//     const [ownData, setOwnData] = useState(null);

//     const [activeConvId, setActiveConvId] = useState(null)
//     const [selectedConvDetails, setSelectedConDetail] = useState(null)

//     const [messages, setMessages] = useState([]);

//     const [loading, setLoading] = useState(false);
//     const [imageLink, setImageLink] = useState(null);

//     const [messageText, setMessageText] = useState("")


//     const ref = useRef();

//     useEffect(() => {
//         ref?.current?.scrollIntoView({ behaviour: "smooth" });
//     }, [messages])


//     const handleSelectedConv = (id, userData) => {
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }



//     useEffect(() => {
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }, [])



//     useEffect(() => {
//         if (activeConvId) {

//             fetchMessages();
//         }
//     }, [activeConvId])

//     useEffect(() => {
//         socket.on("receiveMessage", (response) => {
//             setMessages([...messages, response])
//         })
//     }, [messages])

//     const fetchMessages = async () => {
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }


//     const fetchConversationOnLoad = async () => {
//         await axios.get('http://localhost:4000/api/conversation/get-conversation', { withCredentials: true }).then(res => {
//             {/* 
//                         Please Watch the video for full code
//                     */}
//         }).catch(err => {
//             console.log(err)
//             alert("Something Went Wrong")
//         })
//     }


//     const handleInputImage = async (e) => {
//         const files = e.target.files;
//         const data = new FormData();
//         data.append('file', files[0]);

//         data.append('upload_preset', 'linkedInClone');
//         setLoading(true)
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }

//     const handleSendMessaeg = async () => {
//         await axios.post(`http://localhost:4000/api/message`, { conversation: activeConvId, message: messageText, picture: imageLink }, { withCredentials: true }).then(res => {

//             socket.emit("sendMessage", activeConvId, res.data)
//             {/* 
//                         Please Watch the video for full code
//                     */}
//         }).catch(err => {
//             console.log(err)
//             alert("Something Went Wrong")
//         })
//     }
//     return (
//         <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
//             <div className='w-full justify-between flex pt-5'>

//                 {/* left side  */}
//                 <div className='w-full md:w-[70%]'>
//                     <Card padding={0}>
//                         {/* 
//                         Please Watch the video for full code
//                     */}

//                         {/* div for chat */}
//                         <div className='w-full md:flex'>
//                             <div className='h-[590px] overflow-auto w-full md:w-[40%] border-r-1 border-gray-400'>

//                                 {/* for each chat */}

//                                 {
//                                     conversations.map((item, index) => {
//                                         return (
//                                             <Conversation activeConvId={activeConvId} handleSelectedConv={handleSelectedConv} item={item} key={index} ownData={ownData} />

//                                         );
//                                     })
//                                 }

//                             </div>

//                             <div className=' w-full md:w-[60%] border-gray-400'>
//                                 {/* 
//                         Please Watch the video for full code
//                     */}
//                                 <div className='h-[360px] w-full overflow-auto border-b-1 border-gray-300'>
//                                     <div className='w-full border-b-1 border-gray-300 gap-3 p-4'>
//                                         <img className=' rounded-[100%] cursor-pointer w-16 h-15' src={selectedConvDetails?.profilePic} />

//                                         <div className="my-2">
//                                             <div className="text-md">{selectedConvDetails?.f_name}</div>
//                                             <div className="text-sm text-gray-500">{selectedConvDetails?.headline}</div>
//                                         </div>
//                                     </div>

//                                     <div className='w-full'>

//                                         {/* for each messages */}

//                                         {
//                                             messages.map((item, index) => {
//                                                 return (
//                                                     <div ref={ref} key={index} className='flex w-full cursor-pointer border-gray-300 gap-3 p-4 '>
//                                                         {/* 
//                         Please Watch the video for full code
//                     */}
//                                                     </div>
//                                                 );
//                                             })
//                                         }

//                                     </div>
//                                 </div>

//                                 {/* Space for typing messages */}
//                                 <div className='p-2 w-full border-b-1 border-gray-200'>
//                                     <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3" placeholder="Write a message" />
//                                 </div>

//                                 <div className='p-3 flex justify-between'>
//                                     <div>
//                                         <label htmlFor="messageImage" className="cursor-pointer"><ImageIcon /></label>
//                                         <input id="messageImage" type='file' onChange={handleInputImage} className="hidden" />
//                                     </div>
//                                     {
//                                         !loading && <div onClick={handleSendMessaeg} className="px-3 py-1 cursor-pointer rounded-2xl border-1 bg-blue-950 text-white">
//                                             Send
//                                         </div>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>


//                 {/* Right Side */}
//                 <div className='hidden md:flex md:w-[25%]'>
//                     <div className='sticky top-19'>
//                         <Advertisement />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Messages

import React, { useState, useEffect, useRef } from 'react'
import Card from '../../components/Card/card'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Conversation from '../../components/Conversation/conversation';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ImageIcon from '@mui/icons-material/Image';
import Advertisement from '../../components/Advertisement/advertisement';
import axios from 'axios';
import socket from '../../../socket';

const Messages = () => {

    const [conversations, setConversations] = useState([]);

    const [ownData, setOwnData] = useState(null);

    const [activeConvId, setActiveConvId] = useState(null)
    const [selectedConvDetails, setSelectedConDetail] = useState(null)

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [imageLink, setImageLink] = useState(null);

    const [messageText, setMessageText] = useState("")


    const ref = useRef();

    useEffect(() => {
        ref?.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages])


    const handleSelectedConv = (id, userData) => {
        {/* 
                        Please Watch the video for full code
                    */}
    }



    useEffect(() => {
        {/* 
                        Please Watch the video for full code
                    */}
    }, [])



    useEffect(() => {
        if (activeConvId) {

            fetchMessages();
        }
    }, [activeConvId])

    useEffect(() => {
        socket.on("receiveMessage", (response) => {
            setMessages([...messages, response])
        })
    }, [messages])

    const fetchMessages = async () => {
        {/* 
                        Please Watch the video for full code
                    */}
    }


    const fetchConversationOnLoad = async () => {
        await axios.get('http://localhost:4000/api/conversation/get-conversation', { withCredentials: true }).then(res => {
            {/* 
                        Please Watch the video for full code
                    */}
        }).catch(err => {
            console.log(err)
            alert("Something Went Wrong")
        })
    }


    const handleInputImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);

        data.append('upload_preset', 'linkedInClone');
        setLoading(true)
        {/* 
                        Please Watch the video for full code
                    */}
    }

    const handleSendMessaeg = async () => {
        await axios.post(`http://localhost:4000/api/message`, { conversation: activeConvId, message: messageText, picture: imageLink }, { withCredentials: true }).then(res => {

            socket.emit("sendMessage", activeConvId, res.data)
            {/* 
                        Please Watch the video for full code
                    */}
        }).catch(err => {
            console.log(err)
            alert("Something Went Wrong")
        })
    }
    return (
        <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
            <div className='w-full justify-between flex pt-5'>

                {/* left side  */}
                <div className='w-full md:w-[70%]'>
                    <Card padding={0}>
                        <div className='border-b-1 border-gray-300 px-5 py-2 font-semibold text-lg'>
                            Messaging

                        </div>
                        <div className="border-b-1 border-gray-300 px-5 py-2">
                            <div className="py-1 px-3 cursor-pointer hover:bg-green-900 bg-green-800 font-semibold flex gap-2 w-fit rounded-md text-white">focused <ArrowDropDownIcon /></div>

                        </div>
                        {/* div for chat */}
                        <div className='w-full md:flex'>
                            <div className='h-[590px] overflow-auto w-full md:w-[40%] border-r-1 border-gray-400'>

                                {/* for each chat */}
                                {/* for each chat */}


                                {
                                    conversations.map((item, index) => {
                                        return (
                                            <Conversation activeConvId={activeConvId} handleSelectedConv={handleSelectedConv} item={item} key={index} ownData={ownData} />

                                        );
                                    })
                                }

                            </div>

                            <div className=' w-full md:w-[60%] border-gray-400'>

                                <div className='w-full md:w-[60%] border-gray-400'>
                                    <div className='border-gray-300 px-2 py-2 border-b-2 flex justify-between items-center'>
                                        <div>
                                            <p className="text-sm font-semibold">User 1</p>
                                            <p className="text-sm text-gray-400">hi this is user 1</p>
                                        </div>
                                        <div><MoreHorizIcon /></div>
                                    </div>
                                </div>




                                <div className='h-[360px] w-full overflow-auto border-b-1 border-gray-300'>
                                    <div className='w-full border-b-1 border-gray-300 gap-3 p-4'>
                                        <img className=' rounded-[100%] cursor-pointer w-16 h-15' src={selectedConvDetails?.profilePic} />

                                        <div className="my-2">
                                            <div className="text-md">{selectedConvDetails?.f_name}</div>
                                            <div className="text-sm text-gray-500">{selectedConvDetails?.headline}</div>
                                        </div>
                                    </div>

                                    <div className='w-full'>

                                        {/* for each messages */}

                                        {
                                            messages.map((item, index) => {
                                                return (
                                                    <div ref={ref} key={index} className='flex w-full cursor-pointer border-gray-300 gap-3 p-4 '>

                                                        <div className='flex w-full cursor-pointer border-gray-300 gap-3 p-4'>
                                                            <div className='shrink-0'>
                                                                <img className='w-8 h-8 rounded-[100%] cursor-pointer' src='http://res.cloudinary.com/dbraoytbj/image/upload/v1/sample.jpg' />
                                                            </div>
                                                            <div className='mb-2 w-full'>
                                                                <div className='text-md'>User 1</div>
                                                                <div className='text-sm mt-6 hover:bg-gray-200'>This is text message</div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                );
                                            })
                                        }

                                    </div>
                                </div>

                                {/* Space for typing messages */}
                                <div className='p-2 w-full border-b-1 border-gray-200'>
                                    <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3" placeholder="Write a message" />
                                </div>

                                <div className='p-3 flex justify-between'>
                                    <div>
                                        <label htmlFor="messageImage" className="cursor-pointer"><ImageIcon /></label>
                                        <input id="messageImage" type='file' onChange={handleInputImage} className="hidden" />
                                    </div>
                                    {
                                        !loading && <div onClick={handleSendMessaeg} className="px-3 py-1 cursor-pointer rounded-2xl border-1 bg-blue-950 text-white">
                                            Send
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>


                {/* Right Side */}
                <div className='hidden md:flex md:w-[25%]'>
                    <div className='sticky top-19'>
                        <Advertisement />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages