// import React, { useState, useEffect } from 'react'
// import Card from '../Card/card'
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import CommentIcon from '@mui/icons-material/Comment';
// import SendIcon from '@mui/icons-material/Send';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const Post = ({ profile, item, key, personalData }) => {
//     const [seeMore, setSeeMore] = useState(false);
//     const [comment, setComment] = useState(false);

//     const [comments, setComments] = useState([]);

//     const [liked, setLiked] = useState(false);
//     const [noOfLikes, setNoOfLike] = useState(item?.likes.length)

//     const [commentText, setCommenttext] = useState("")

//     const handleSendComment = async (e) => {
//         e.preventDefault();
//         if (commentText.trim().length === 0) return toast.error("Please enter comment");

//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }

//     useEffect(() => {
//         let selfId = personalData?._id;
//         item?.likes?.map((item) => {
//             if (item.toString() === selfId.toString()) {
//                 setLiked(true);
//                 return
//             } else {
//                 setLiked(false)
//             }
//         })
//     }, [])

//     const handleLikeFunc = async () => {
//         await axios.post('http://localhost:4000/api/post/likeDislike', { postId: item?._id }, { withCredentials: true }).then(res => {
//             {/* 
//                         Please Watch the video for full code
//                     */}
//         }).catch(err => {
//             console.log(err)
//             alert('Something Went Wrong')
//         })
//     }

//     const handleCommentBoxOpenClose = async () => {
//         setComment(true)
//         await axios.get(`http://localhost:4000/api/comment/${item?._id}`).then(resp => {
//             console.log(resp)
//             setComments(resp.data.comments)
//         }).catch(err => {
//             console.log(err)
//             alert('Something Went Wrong')
//         })
//     }

//     const copyToClipboard = async () => {
//         try {
//             let string = `http://localhost:5173/profile/${item?.user?._id}/activities/${item?._id}`
//             {/* 
//                         Please Watch the video for full code
//                     */}
//         } catch (err) {
//             console.error('Failed to copy!', err);
//         }
//     };


//     const desc = item?.desc;
//     return (
//         <Card padding={0}>
//             <div className='flex gap-3 p-4'>
//                 <Link to={`/profile/${item?.user?._id}`} className='w-12 h-12 rounded-4xl'>
//                     <img className='rounded-4xl w-12 h-12 border-2 border-white cursor-pointer' src={item?.user?.profilePic} />
//                 </Link>
//                 {/* 
//                         Please Watch the video for full code
//                     */}
//             </div>


//             <div className='text-md p-4 my-3 whitespace-pre-line flex-grow'>
//                 {seeMore ? desc : desc?.length > 50 ? `${desc.slice(0, 50)}...` : `${desc}`} {desc?.length < 50 ? null : <span onClick={() => setSeeMore(prev => !prev)} className="cursor-pointer text-gray-500">{seeMore ? "See Less" : 'See More'}</span>}
//             </div>


//             {
//                 item?.imageLink && <div className='w-[100%] h-[300px]'>
//                     <img className='w-full h-full' src={item?.imageLink} />
//                 </div>
//             }

//             <div className='my-2 p-4 flex justify-between items-center'>
//                 {/* 
//                         Please Watch the video for full code
//                     */}
//             </div>

//             {
//                 !profile && <div className='flex p-1'>
//                     <div onClick={handleLikeFunc} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> {liked ? <ThumbUpIcon sx={{ fontSize: 22, color: "blue" }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />} <span>{liked ? 'Liked' : "Like"}</span> </div>
//                     <div onClick={handleCommentBoxOpenClose} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> <CommentIcon sx={{ fontSize: 22 }} /> <span>Comment</span> </div>
//                     <div onClick={copyToClipboard} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> <SendIcon sx={{ fontSize: 22 }} /> <span>Share</span> </div>
//                 </div>
//             }

//             {/* Comment Section */}
//             {
//                 comment && <div className='p-4 w-full'>
//                     <div className='flex gap-2 items-center'>
//                         <img src={personalData?.profilePic} className='rounded-full w-12 h-12 border-2 border-white cursor-pointer' />

//                         <form className="w-full flex gap-2" onSubmit={handleSendComment} >
//                             <input value={commentText} onChange={(event) => setCommenttext(event.target.value)} placeholder="Add a comment..." className="w-full border-1 py-3 px-5 rounded-3xl hover:bg-gray-100" />
//                             <button type='submit' className='cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-3'>Send</button>
//                         </form>

//                     </div>

//                     {/* other's comment section */}
//                     <div className='w-full p-4'>

//                         {
//                             comments.map((item, index) => {
//                                 return (
//                                     <div className='my-4'>
//                                         <Link to={`/profile/${item?.user?._id}`} className='flex gap-3'>
//                                             {/* 
//                         Please Watch the video for full code
//                     */}
//                                         </Link>

//                                         <div className="px-11 my-2">{item?.comment}</div>
//                                     </div>
//                                 );
//                             })
//                         }



//                     </div>
//                 </div>
//             }
//             <ToastContainer />

//         </Card>
//     )
// }

// export default Post

import React, { useState, useEffect } from 'react'
import Card from '../Card/card'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Post = ({ profile, item, key, personalData }) => {
    const [seeMore, setSeeMore] = useState(false);
    const [comment, setComment] = useState(false);

    const [comments, setComments] = useState([]);

    const [liked, setLiked] = useState(false);
    const [noOfLikes, setNoOfLike] = useState(item?.likes.length)

    const [commentText, setCommenttext] = useState("")

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (commentText.trim().length === 0) return toast.error("Please enter comment");

        await axios.post(`http://localhost:4000/api/comment`, { postId: item?._id, comment: commentText },
            { withCredentials: true }).then((res) => {
                setComments([res.data.comment, ...comments]);
            }).catch(err => {
                console.log(err)
                alert('Something Went Wrong')
            })

    }

    useEffect(() => {
        let selfId = personalData?._id;
        item?.likes?.map((item) => {
            if (item.toString() === selfId.toString()) {
                setLiked(true);
                return
            } else {
                setLiked(false)
            }
        })
    }, [])

    const handleLikeFunc = async () => {
        await axios.post('http://localhost:4000/api/post/likeDislike', { postId: item?._id }, { withCredentials: true }).then(res => {
            if (liked) {
                setNoOfLike((prev) => prev - 1);
                setLiked(false);
            } else {
                setLiked(true);
                setNoOfLike((prev) => prev + 1);
            }

        }).catch(err => {
            console.log(err)
            alert('Something Went Wrong')
        })
    }

    const handleCommentBoxOpenClose = async () => {
        setComment(true)
        await axios.get(`http://localhost:4000/api/comment/${item?._id}`).then(resp => {
            console.log(resp)
            setComments(resp.data.comments)
        }).catch(err => {
            console.log(err)
            alert('Something Went Wrong')
        })
    }

    const copyToClipboard = async (postId) => {
        try {
            let string = `http://localhost:5173/profile/${item?.user?._id}/activities/${postId}`
            await navigator.clipboard.writeText(string);
            toast.success('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };



    const desc = item?.desc;
    return (
        <Card padding={0}>
            <div className='flex gap-3 p-4'>

                <Link to={`/profile/${item?.user?._id}`} className='w-12 h-12 rounded-4xl'>
                    <img className='rounded-4xl w-12 h-12 border-2 border-white cursor-pointer' src={item?.user?.profilePic} />
                </Link>
                <div>
                    <div className="text-lg font-semibold">
                        {item?.user?.f_name}
                    </div>

                    <div className="text-xs text-gray-500">
                        {item?.user?.headline}
                    </div>

                </div>
            </div>

            {/* change +++++ */}
            {/* {
                desc.length > 0 && <div className='text-md p-4 my-3 whitespace-pre-line flex-grow'>
                    {seeMore ? desc : desc?.length > 50 ? `${desc.slice(0, 50)}...` : `${desc}`} {desc?.length < 50 ? null : <span onClick={() => setSeeMore(prev => !prev)} className="cursor-pointer text-gray-500">{seeMore ? "See Less" : 'See More'}</span>}
                </div>
            } */}

            <div className='text-md p-4 my-3 whitespace-pre-line flex-grow'>
                {seeMore ? desc : desc?.length > 50 ? `${desc.slice(0, 50)}...` : `${desc}`} {desc?.length < 50 ? null : <span onClick={() => setSeeMore(prev => !prev)} className="cursor-pointer text-gray-500">{seeMore ? "See Less" : 'See More'}</span>}
            </div>



            {
                item?.imageLink && <div className='w-[100%] h-[300px]'>
                    <img className='w-full h-full' src={item?.imageLink} />
                </div>
            }

            <div className='my-2 p-4 flex justify-between items-center'>
                <div className='flex gap-1 items-center'>
                    <ThumbUpIcon sx={{ color: "blue", fontSize: 12 }} />
                    <div className='text-sm text-gray-600'>{item?.likes.length} Likes</div>
                </div>
                <div className='flex gap-1 items-center'>
                    <div className='text-sm text-gray-600'>{item?.comments} Comments</div>
                </div>
            </div>

            {
                !profile && <div className='flex p-1'>
                    <div onClick={handleLikeFunc} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> {liked ? <ThumbUpIcon sx={{ fontSize: 22, color: "blue" }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />} <span>{liked ? 'Liked' : "Like"}</span> </div>
                    <div onClick={handleCommentBoxOpenClose} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> <CommentIcon sx={{ fontSize: 22 }} /> <span>Comment</span> </div>
                    <div onClick={copyToClipboard} className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'> <SendIcon sx={{ fontSize: 22 }} /> <span>Share</span> </div>
                </div>
            }

            {/* Comment Section */}
            {
                comment && <div className='p-4 w-full'>
                    <div className='flex gap-2 items-center'>
                        <img src={personalData?.profilePic} className='rounded-full w-12 h-12 border-2 border-white cursor-pointer' />

                        <form className="w-full flex gap-2" onSubmit={handleSendComment} >
                            <input value={commentText} onChange={(event) => setCommenttext(event.target.value)} placeholder="Add a comment..." className="w-full border-1 py-3 px-5 rounded-3xl hover:bg-gray-100" />
                            <button type='submit' className='cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-3'>Send</button>
                        </form>

                    </div>

                    {/* other's comment section */}
                    <div className='w-full p-4'>

                        {
                            comments.map((item, index) => {
                                return (
                                    <div className='my-4'>
                                        {/* if something went wrong part28 18minwatch */}
                                        <Link to={`/profile/${item?.user?._id}`} className='flex gap-3'>
                                        
                                        {/* ++++++++++ */}
                                            <img src={item?.user?.profilePic} className='rounded-full w-10 h-10 border-white cursor-pointer' />

                                            <div className='cursor-pointer'>
                                                <div className="text-md">{item?.user?.f_name}</div>
                                                <div className="text-sm text-gray-500">{item?.user?.headline}</div>

                                            </div>
                                        </Link>

                                        <div className="px-11 my-2">{item?.comment}</div>
                                    </div>
                                );
                            })
                        }



                    </div>
                </div>
            }
            <ToastContainer />

        </Card>
    )
}

export default Post