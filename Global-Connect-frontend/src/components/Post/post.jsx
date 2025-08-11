import React, { useState, useEffect } from 'react'
import Card from '../Card/card'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Post = ({ profile, item, personalData }) => {
    const [seeMore, setSeeMore] = useState(false);
    const [comment, setComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [noOfLikes, setNoOfLike] = useState(item?.likes?.length || 0);
    const [noOfComments, setNoOfComments] = useState(item?.comments || 0);
    const [commentText, setCommenttext] = useState("")

    useEffect(() => {
        if (personalData?._id && item?.likes) {
            const isLiked = item.likes.some(likeId => likeId.toString() === personalData._id.toString());
            setLiked(isLiked);
        }
    }, [personalData?._id, item?.likes]);

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (commentText.trim().length === 0) return toast.error("Please enter comment");

        try {
            const response = await axios.post(`http://localhost:4000/api/comment`, 
                { postId: item?._id, comment: commentText },
                { withCredentials: true }
            );
            
            setComments([response.data.comment, ...comments]);
            setCommenttext("");
            setNoOfComments(prev => prev + 1);
            toast.success("Comment added successfully!");
            
        } catch (err) {
            console.error("Comment error:", err);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleLikeFunc = async () => {
        try {
            await axios.post('http://localhost:4000/api/post/likeDislike', 
                { postId: item?._id }, 
                { withCredentials: true }
            );
            
            if (liked) {
                setNoOfLike((prev) => prev - 1);
                setLiked(false);
            } else {
                setLiked(true);
                setNoOfLike((prev) => prev + 1);
            }
            
        } catch (err) {
            console.error("Like error:", err);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleCommentBoxOpenClose = async () => {
        if (!comment) {
            setComment(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/comment/${item?._id}`);
                setComments(response.data.comments);
            } catch (err) {
                console.error("Fetch comments error:", err);
                toast.error('Failed to load comments');
            }
        } else {
            setComment(false);
        }
    }

    // FIXED: Use item._id instead of postId parameter
    // Add this debug function to your Post component
const copyToClipboard = async () => {
    try {
        let string = `http://localhost:5173/profile/${item?.user?._id}/activities/${item?._id}`
        
        // DEBUG: Log what we're copying
        console.log('=== COPY TO CLIPBOARD DEBUG ===');
        console.log('item._id:', item?._id);
        console.log('item.user._id:', item?.user?._id);
        console.log('Generated URL:', string);
        console.log('================================');
        
        await navigator.clipboard.writeText(string);
        toast.success('Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy!', err);
        toast.error('Failed to copy link');
    }
};

    const desc = item?.desc || "";

    if (!item) {
        return null;
    }

    return (
        <Card padding={0}>
            <div className='flex gap-3 p-4'>
                <Link to={`/profile/${item?.user?._id}`} className='w-12 h-12 rounded-4xl'>
                    <img 
                        className='rounded-4xl w-12 h-12 border-2 border-white cursor-pointer' 
                        src={item?.user?.profilePic || '/default-avatar.png'} 
                        alt={item?.user?.f_name || 'User'}
                        onError={(e) => { e.target.src = '/default-avatar.png' }}
                    />
                </Link>
                <div>
                    <div className="text-lg font-semibold">
                        {item?.user?.f_name || 'Unknown User'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {item?.user?.headline || ''}
                    </div>
                </div>
            </div>

            {/* Post description */}
            {desc.length > 0 && (
                <div className='text-md p-4 my-3 whitespace-pre-line flex-grow'>
                    {seeMore ? desc : desc?.length > 50 ? `${desc.slice(0, 50)}...` : desc}
                    {desc?.length > 50 && (
                        <span 
                            onClick={() => setSeeMore(prev => !prev)} 
                            className="cursor-pointer text-gray-500 ml-1"
                        >
                            {seeMore ? "See Less" : 'See More'}
                        </span>
                    )}
                </div>
            )}

            {/* Post image */}
            {item?.imageLink && (
                <div className='w-[100%] h-[300px]'>
                    <img 
                        className='w-full h-full object-cover' 
                        src={item.imageLink} 
                        alt="Post content"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                </div>
            )}

            {/* Likes and comments count */}
            <div className='my-2 p-4 flex justify-between items-center'>
                <div className='flex gap-1 items-center'>
                    <ThumbUpIcon sx={{ color: "blue", fontSize: 12 }} />
                    <div className='text-sm text-gray-600'>{noOfLikes} Likes</div>
                </div>
                <div className='flex gap-1 items-center'>
                    <div className='text-sm text-gray-600'>{noOfComments} Comments</div>
                </div>
            </div>

            {/* Action buttons */}
            {!profile && (
                <div className='flex p-1 border-t-1 border-gray-200'>
                    <div 
                        onClick={handleLikeFunc} 
                        className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
                    > 
                        {liked ? 
                            <ThumbUpIcon sx={{ fontSize: 22, color: "blue" }} /> : 
                            <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />
                        } 
                        <span>{liked ? 'Liked' : "Like"}</span> 
                    </div>
                    
                    <div 
                        onClick={handleCommentBoxOpenClose} 
                        className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
                    > 
                        <CommentIcon sx={{ fontSize: 22 }} /> 
                        <span>Comment</span> 
                    </div>
                    
                    {/* FIXED: Remove postId parameter from onClick */}
                    <div 
                        onClick={copyToClipboard} 
                        className='w-[33%] justify-center flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-100'
                    > 
                        <SendIcon sx={{ fontSize: 22 }} /> 
                        <span>Share</span> 
                    </div>
                </div>
            )}

            {/* Comment Section */}
            {comment && (
                <div className='p-4 w-full border-t-1 border-gray-200'>
                    <div className='flex gap-2 items-center mb-4'>
                        <img 
                            src={personalData?.profilePic || '/default-avatar.png'} 
                            className='rounded-full w-12 h-12 border-2 border-white cursor-pointer' 
                            alt="Your avatar"
                            onError={(e) => { e.target.src = '/default-avatar.png' }}
                        />

                        <form className="w-full flex gap-2" onSubmit={handleSendComment}>
                            <input 
                                value={commentText} 
                                onChange={(event) => setCommenttext(event.target.value)} 
                                placeholder="Add a comment..." 
                                className="w-full border-1 py-3 px-5 rounded-3xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                            <button 
                                type='submit' 
                                className='cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-3 hover:bg-blue-900 disabled:opacity-50'
                                disabled={commentText.trim().length === 0}
                            >
                                Send
                            </button>
                        </form>
                    </div>

                    {/* Other's comment section */}
                    <div className='w-full'>
                        {comments.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">No comments yet</div>
                        ) : (
                            comments.map((commentItem, index) => (
                                <div key={commentItem._id || index} className='my-4'>
                                    <Link to={`/profile/${commentItem?.user?._id}`} className='flex gap-3'>
                                        <img 
                                            src={commentItem?.user?.profilePic || '/default-avatar.png'} 
                                            className='rounded-full w-10 h-10 border-white cursor-pointer' 
                                            alt={commentItem?.user?.f_name || 'User'}
                                            onError={(e) => { e.target.src = '/default-avatar.png' }}
                                        />
                                        <div className='cursor-pointer'>
                                            <div className="text-md font-medium">
                                                {commentItem?.user?.f_name || 'Unknown User'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {commentItem?.user?.headline || ''}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="px-11 my-2 text-sm">
                                        {commentItem?.comment}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}

export default Post














// import React, { useState, useEffect } from 'react'
// import Card from '../Card/card'
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import CommentIcon from '@mui/icons-material/Comment';
// import SendIcon from '@mui/icons-material/Send';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const Post = ({ profile, item, personalData }) => {
//     const [seeMore, setSeeMore] = useState(false);
//     const [comment, setComment] = useState(false);
//     const [comments, setComments] = useState([]);
//     const [liked, setLiked] = useState(false);
//     const [noOfLikes, setNoOfLike] = useState(item?.likes?.length || 0); // FIXED: Added fallback
//     const [noOfComments, setNoOfComments] = useState(item?.comments || 0); // FIXED: Track comments count
//     const [commentText, setCommenttext] = useState("")

//     // FIXED: Improved like checking logic
//     useEffect(() => {
//         if (personalData?._id && item?.likes) {
//             const isLiked = item.likes.some(likeId => likeId.toString() === personalData._id.toString());
//             setLiked(isLiked);
//         }
//     }, [personalData?._id, item?.likes]);

//     const handleSendComment = async (e) => {
//         e.preventDefault();
//         if (commentText.trim().length === 0) return toast.error("Please enter comment");

//         try {
//             const response = await axios.post(`http://localhost:4000/api/comment`, 
//                 { postId: item?._id, comment: commentText },
//                 { withCredentials: true }
//             );
            
//             setComments([response.data.comment, ...comments]);
//             setCommenttext(""); // FIXED: Clear input after sending
//             setNoOfComments(prev => prev + 1); // FIXED: Update comment count
//             toast.success("Comment added successfully!");
            
//         } catch (err) {
//             console.error("Comment error:", err);
//             toast.error(err?.response?.data?.message || 'Something went wrong');
//         }
//     }

//     const handleLikeFunc = async () => {
//         try {
//             await axios.post('http://localhost:4000/api/post/likeDislike', 
//                 { postId: item?._id }, 
//                 { withCredentials: true }
//             );
            
//             if (liked) {
//                 setNoOfLike((prev) => prev - 1);
//                 setLiked(false);
//             } else {
//                 setLiked(true);
//                 setNoOfLike((prev) => prev + 1);
//             }
            
//         } catch (err) {
//             console.error("Like error:", err);
//             toast.error(err?.response?.data?.message || 'Something went wrong');
//         }
//     }

//     const handleCommentBoxOpenClose = async () => {
//         if (!comment) { // Only fetch if opening for first time
//             setComment(true);
//             try {
//                 const response = await axios.get(`http://localhost:4000/api/comment/${item?._id}`);
//                 setComments(response.data.comments);
//             } catch (err) {
//                 console.error("Fetch comments error:", err);
//                 toast.error('Failed to load comments');
//             }
//         } else {
//             setComment(false);
//         }
//     }

//     const copyToClipboard = async (postId) => {
//         try {
//             let string = `http://localhost:5173/profile/${item?.user?._id}/activities/${postId}`
//             await navigator.clipboard.writeText(string);
//             toast.success('Copied to clipboard!');
//         } catch (err) {
//             console.error('Failed to copy!', err);
//             toast.error('Failed to copy link');
//         }
//     };

//     const desc = item?.desc || "";

//     // FIXED: Add safety checks
//     if (!item) {
//         return null;
//     }

//     return (
//         <Card padding={0}>
//             <div className='flex gap-3 p-4'>
//                 <Link to={`/profile/${item?.user?._id}`} className='w-12 h-12 rounded-4xl'>
//                     <img 
//                         className='rounded-4xl w-12 h-12 border-2 border-white cursor-pointer' 
//                         src={item?.user?.profilePic || '/default-avatar.png'} 
//                         alt={item?.user?.f_name || 'User'}
//                         onError={(e) => { e.target.src = '/default-avatar.png' }}
//                     />
//                 </Link>
//                 <div>
//                     <div className="text-lg font-semibold">
//                         {item?.user?.f_name || 'Unknown User'}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                         {item?.user?.headline || ''}
//                     </div>
//                 </div>
//             </div>

//             {/* Post description */}
//             {desc.length > 0 && (
//                 <div className='text-md p-4 my-3 whitespace-pre-line flex-grow'>
//                     {seeMore ? desc : desc?.length > 50 ? `${desc.slice(0, 50)}...` : desc}
//                     {desc?.length > 50 && (
//                         <span 
//                             onClick={() => setSeeMore(prev => !prev)} 
//                             className="cursor-pointer text-gray-500 ml-1"
//                         >
//                             {seeMore ? "See Less" : 'See More'}
//                         </span>
//                     )}
//                 </div>
//             )}

//             {/* Post image */}
//             {item?.imageLink && (
//                 <div className='w-[100%] h-[300px]'>
//                     <img 
//                         className='w-full h-full object-cover' 
//                         src={item.imageLink} 
//                         alt="Post content"
//                         onError={(e) => { e.target.style.display = 'none' }}
//                     />
//                 </div>
//             )}

//             {/* Likes and comments count - FIXED */}
//             <div className='my-2 p-4 flex justify-between items-center'>
//                 <div className='flex gap-1 items-center'>
//                     <ThumbUpIcon sx={{ color: "blue", fontSize: 12 }} />
//                     <div className='text-sm text-gray-600'>{noOfLikes} Likes</div>
//                 </div>
//                 <div className='flex gap-1 items-center'>
//                     <div className='text-sm text-gray-600'>{noOfComments} Comments</div>
//                 </div>
//             </div>

//             {/* Action buttons */}
//             {!profile && (
//                 <div className='flex p-1 border-t-1 border-gray-200'>
//                     <div 
//                         onClick={handleLikeFunc} 
//                         className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
//                     > 
//                         {liked ? 
//                             <ThumbUpIcon sx={{ fontSize: 22, color: "blue" }} /> : 
//                             <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />
//                         } 
//                         <span>{liked ? 'Liked' : "Like"}</span> 
//                     </div>
                    
//                     <div 
//                         onClick={handleCommentBoxOpenClose} 
//                         className='w-[33%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
//                     > 
//                         <CommentIcon sx={{ fontSize: 22 }} /> 
//                         <span>Comment</span> 
//                     </div>
                    
//                     <div 
//                         onClick={() => copyToClipboard(item._id)} 
//                         className='w-[33%] justify-center flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-100'
//                     > 
//                         <SendIcon sx={{ fontSize: 22 }} /> 
//                         <span>Share</span> 
//                     </div>
//                 </div>
//             )}

//             {/* Comment Section */}
//             {comment && (
//                 <div className='p-4 w-full border-t-1 border-gray-200'>
//                     <div className='flex gap-2 items-center mb-4'>
//                         <img 
//                             src={personalData?.profilePic || '/default-avatar.png'} 
//                             className='rounded-full w-12 h-12 border-2 border-white cursor-pointer' 
//                             alt="Your avatar"
//                             onError={(e) => { e.target.src = '/default-avatar.png' }}
//                         />

//                         <form className="w-full flex gap-2" onSubmit={handleSendComment}>
//                             <input 
//                                 value={commentText} 
//                                 onChange={(event) => setCommenttext(event.target.value)} 
//                                 placeholder="Add a comment..." 
//                                 className="w-full border-1 py-3 px-5 rounded-3xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
//                             />
//                             <button 
//                                 type='submit' 
//                                 className='cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-3 hover:bg-blue-900 disabled:opacity-50'
//                                 disabled={commentText.trim().length === 0}
//                             >
//                                 Send
//                             </button>
//                         </form>
//                     </div>

//                     {/* Other's comment section */}
//                     <div className='w-full'>
//                         {comments.length === 0 ? (
//                             <div className="text-gray-500 text-center py-4">No comments yet</div>
//                         ) : (
//                             comments.map((commentItem, index) => (
//                                 <div key={commentItem._id || index} className='my-4'>
//                                     <Link to={`/profile/${commentItem?.user?._id}`} className='flex gap-3'>
//                                         <img 
//                                             src={commentItem?.user?.profilePic || '/default-avatar.png'} 
//                                             className='rounded-full w-10 h-10 border-white cursor-pointer' 
//                                             alt={commentItem?.user?.f_name || 'User'}
//                                             onError={(e) => { e.target.src = '/default-avatar.png' }}
//                                         />
//                                         <div className='cursor-pointer'>
//                                             <div className="text-md font-medium">
//                                                 {commentItem?.user?.f_name || 'Unknown User'}
//                                             </div>
//                                             <div className="text-sm text-gray-500">
//                                                 {commentItem?.user?.headline || ''}
//                                             </div>
//                                         </div>
//                                     </Link>
//                                     <div className="px-11 my-2 text-sm">
//                                         {commentItem?.comment}
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             )}
//         </Card>
//     )
// }

// export default Post