import React, { useState, useEffect } from 'react'
import Card from '../Card/card'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import RepeatIcon from '@mui/icons-material/Repeat';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import RepostModal from '../RepostModal/repostmodal'; // Import the RepostModal

const Post = ({ profile, item, personalData, onRepost }) => {
    // Enhanced data validation
    const validatePostData = (postItem) => {
        if (!postItem) {
            console.warn('Post item is null or undefined');
            return false;
        }
        
        if (!postItem._id) {
            console.warn('Post ID is missing:', postItem);
            return false;
        }
        
        // For reposts, check both repost user and original post user
        const repostUser = postItem.user;
        const originalUser = postItem.originalPost?.user;
        const displayUser = originalUser || repostUser;
        
        if (!displayUser) {
            console.warn('No user data found:', postItem);
            return false;
        }
        
        return true;
    };

    // Early return if post data is invalid
    if (!validatePostData(item)) {
        return (
            <Card padding={1}>
                <div className="text-center text-red-500 py-4">
                    Error: Invalid post data
                </div>
            </Card>
        );
    }

    const [seeMore, setSeeMore] = useState(false);
    const [comment, setComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [reposted, setReposted] = useState(false);
    const [noOfLikes, setNoOfLikes] = useState(item?.likes?.length || 0);
    const [noOfComments, setNoOfComments] = useState(item?.comments || 0);
    const [noOfReposts, setNoOfReposts] = useState(item?.reposts?.length || 0);
    const [commentText, setCommentText] = useState("");
    const [showRepostMenu, setShowRepostMenu] = useState(false);
    const [showRepostModal, setShowRepostModal] = useState(false);

    useEffect(() => {
        if (personalData?._id && item?.likes) {
            const isLiked = item.likes.some(likeId => 
                likeId.toString() === personalData._id.toString()
            );
            setLiked(isLiked);
        }
        
        if (personalData?._id && item?.reposts) {
            const isReposted = item.reposts.some(repostId => 
                repostId.toString() === personalData._id.toString()
            );
            setReposted(isReposted);
        }
    }, [personalData?._id, item?.likes, item?.reposts]);

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (commentText.trim().length === 0) {
            return toast.error("Please enter comment");
        }

        try {
            const response = await axios.post(`https://globalconnectfinalproject.onrender.com/api/comment`, 
                { postId: item._id, comment: commentText },
                { withCredentials: true }
            );
            
            setComments([response.data.comment, ...comments]);
            setCommentText("");
            setNoOfComments(prev => prev + 1);
            toast.success("Comment added successfully!");
            
        } catch (err) {
            console.error("Comment error:", err);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    };

    const handleLikeFunc = async () => {
        try {
            await axios.post('https://globalconnectfinalproject.onrender.com/api/post/likeDislike', 
                { postId: item._id }, 
                { withCredentials: true }
            );
            
            if (liked) {
                setNoOfLikes((prev) => prev - 1);
                setLiked(false);
            } else {
                setLiked(true);
                setNoOfLikes((prev) => prev + 1);
            }
            
        } catch (err) {
            console.error("Like error:", err);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDirectRepost = async () => {
        try {
            if (!item?._id) {
                toast.error('Invalid post ID');
                return;
            }
            
            const response = await axios.post('https://globalconnectfinalproject.onrender.com/api/post/repost', 
                { postId: item._id, repostType: 'direct' }, 
                { withCredentials: true }
            );
            
            if (reposted) {
                setNoOfReposts(prev => prev - 1);
                setReposted(false);
                toast.success("Repost removed!");
            } else {
                setNoOfReposts(prev => prev + 1);
                setReposted(true);
                toast.success("Post reposted!");
            }
            setShowRepostMenu(false);
            
            if (onRepost) {
                onRepost(response.data);
            }
            
        } catch (err) {
            console.error("Repost error:", err);
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    };

    const handleRepostWithThoughts = () => {
        setShowRepostMenu(false);
        setShowRepostModal(true);
    };

    const handleRepostModalSubmit = (repostData) => {
        if (repostData) {
            setNoOfReposts(prev => prev + 1);
            setReposted(true);
            
            if (onRepost) {
                onRepost(repostData);
            }
        }
        setShowRepostModal(false);
    };

    const handleCommentBoxOpenClose = async () => {
        if (!comment) {
            setComment(true);
            try {
                const response = await axios.get(`https://globalconnectfinalproject.onrender.com/api/comment/${item._id}`);
                setComments(response.data.comments || []);
            } catch (err) {
                console.error("Fetch comments error:", err);
                toast.error('Failed to load comments');
            }
        } else {
            setComment(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            const userId = item?.user?._id || item?.originalPost?.user?._id;
            const postId = item._id;
            
            if (!userId || !postId) {
                toast.error('Missing user or post information');
                return;
            }
            
            if (userId === 'undefined' || postId === 'undefined') {
                toast.error('Invalid user or post ID');
                return;
            }
            
            const url = `https://globalconnectfinalproject.onrender.com/profile/${userId}/activities/${postId}`;
            await navigator.clipboard.writeText(url);
            toast.success('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy!', err);
            toast.error('Failed to copy link');
        }
    };

    // Determine post type and data to display
    const isRepostWithThoughts = item?.originalPost && item?.repostThoughts;
    const isDirectRepost = item?.originalPost && !item?.repostThoughts;
    const displayPost = item?.originalPost || item;
    const desc = displayPost?.desc || "";

    // Get user data safely
    const getDisplayUser = () => {
        if (displayPost?.user) {
            return displayPost.user;
        }
        return {
            _id: 'unknown',
            f_name: 'Unknown User',
            profilePic: '/default-avatar.png',
            headline: ''
        };
    };

    const displayUser = getDisplayUser();
    const repostUser = item?.user;

    return (
        <>
            <Card padding={0}>
                {/* Repost indicator */}
                {(isRepostWithThoughts || isDirectRepost) && repostUser && (
                    <div className='flex items-center gap-2 p-4 pb-2 text-sm text-gray-600'>
                        <RepeatIcon sx={{ fontSize: 16, color: 'gray' }} />
                        <Link 
                            to={`/profile/${repostUser._id}`} 
                            className='font-medium hover:text-blue-600'
                        >
                            {repostUser.f_name || 'Unknown User'} reposted
                        </Link>
                    </div>
                )}

                {/* Repost thoughts (if any) */}
                {isRepostWithThoughts && (
                    <div className='px-4 pb-2'>
                        <div className='text-sm bg-gray-50 p-3 rounded-lg'>
                            {item.repostThoughts}
                        </div>
                    </div>
                )}

                {/* Original post content */}
                <div className={`${(isRepostWithThoughts || isDirectRepost) ? 'border-l-2 border-gray-200 ml-4 pl-4' : ''}`}>
                    <div className='flex gap-3 p-4'>
                        <Link to={`/profile/${displayUser._id}`} className='w-12 h-12 rounded-4xl'>
                            <img 
                                className='rounded-4xl w-12 h-12 border-2 border-white cursor-pointer' 
                                src={displayUser.profilePic || '/default-avatar.png'} 
                                alt={displayUser.f_name || 'User'}
                                onError={(e) => { e.target.src = '/default-avatar.png' }}
                            />
                        </Link>
                        <div>
                            <div className="text-lg font-semibold">
                                {displayUser.f_name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {displayUser.headline || ''}
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
                    {displayPost?.imageLink && (
                        <div className='w-[100%] h-[300px]'>
                            <img 
                                className='w-full h-full object-cover' 
                                src={displayPost.imageLink} 
                                alt="Post content"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                    )}

                    {/* Likes, comments and reposts count */}
                    <div className='my-2 p-4 flex justify-between items-center'>
                        <div className='flex gap-4'>
                            <div className='flex gap-1 items-center'>
                                <ThumbUpIcon sx={{ color: "blue", fontSize: 12 }} />
                                <div className='text-sm text-gray-600'>{noOfLikes} Likes</div>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <RepeatIcon sx={{ color: "green", fontSize: 12 }} />
                                <div className='text-sm text-gray-600'>{noOfReposts} Reposts</div>
                            </div>
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
                                className='w-[25%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
                            > 
                                {liked ? 
                                    <ThumbUpIcon sx={{ fontSize: 22, color: "blue" }} /> : 
                                    <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />
                                } 
                                <span>{liked ? 'Liked' : "Like"}</span> 
                            </div>
                            
                            <div 
                                onClick={handleCommentBoxOpenClose} 
                                className='w-[25%] justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
                            > 
                                <CommentIcon sx={{ fontSize: 22 }} /> 
                                <span>Comment</span> 
                            </div>
                            
                            {/* Repost button with dropdown */}
                            <div className='w-[25%] relative'>
                                <div 
                                    onClick={() => setShowRepostMenu(!showRepostMenu)} 
                                    className='w-full justify-center flex gap-2 items-center border-r-1 border-gray-100 p-2 cursor-pointer hover:bg-gray-100'
                                > 
                                    <RepeatIcon sx={{ fontSize: 22, color: reposted ? "green" : "inherit" }} /> 
                                    <span style={{ color: reposted ? "green" : "inherit" }}>
                                        {reposted ? 'Reposted' : 'Repost'}
                                    </span> 
                                </div>
                                
                                {/* Repost dropdown menu */}
                                {showRepostMenu && (
                                    <div className='absolute bottom-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mb-1'>
                                        <div 
                                            onClick={handleDirectRepost}
                                            className='p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100'
                                        >
                                            <div className='flex items-center gap-2'>
                                                <RepeatIcon sx={{ fontSize: 16 }} />
                                                <div>
                                                    <div className='text-sm font-medium'>
                                                        {reposted ? 'Remove repost' : 'Repost'}
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {reposted ? 'Remove from your profile' : 'Share immediately'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!reposted && (
                                            <div 
                                                onClick={handleRepostWithThoughts}
                                                className='p-3 hover:bg-gray-100 cursor-pointer'
                                            >
                                                <div className='flex items-center gap-2'>
                                                    <CommentIcon sx={{ fontSize: 16 }} />
                                                    <div>
                                                        <div className='text-sm font-medium'>Repost with thoughts</div>
                                                        <div className='text-xs text-gray-500'>Add your own commentary</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div 
                                onClick={copyToClipboard} 
                                className='w-[25%] justify-center flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-100'
                            > 
                                <SendIcon sx={{ fontSize: 22 }} /> 
                                <span>Share</span> 
                            </div>
                        </div>
                    )}
                </div>

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
                                    onChange={(event) => setCommentText(event.target.value)} 
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

                {/* Click outside to close repost menu */}
                {showRepostMenu && (
                    <div 
                        className='fixed inset-0 z-5' 
                        onClick={() => setShowRepostMenu(false)}
                    />
                )}
            </Card>

            {/* Repost Modal */}
            <RepostModal
                isOpen={showRepostModal}
                onClose={() => setShowRepostModal(false)}
                post={displayPost}
                personalData={personalData}
                onRepost={handleRepostModalSubmit}
            />
        </>
    );
};

export default Post;














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
