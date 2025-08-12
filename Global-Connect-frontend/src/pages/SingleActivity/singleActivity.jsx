// import React, { useState, useEffect } from 'react'
// import ProfileCard from '../../components/ProfileCard/profileCard'
// import Card from '../../components/Card/card'
// import Post from '../../components/Post/post'
// import Advertisement from '../../components/Advertisement/advertisement'
// import axios from 'axios'
// import { useParams } from 'react-router-dom'

// const SingleActivity = () => {

//     const { id, postId } = useParams();

//     const [post, setPost] = useState(null)
//     const [ownData, setOwnData] = useState(null);


//     const fetchDataOnLoad = async () => {
//         await axios.get(`http://localhost:4000/api/post/getPostById/${postId}`).then(res => {
//             console.log(res)
//             setPost(res.data.post)
//         }).catch(err => {
//             console.log(err)
//             alert(err?.response?.data?.error)
//         })

//     }

//     useEffect(() => {
//         fetchDataOnLoad()
//         let userData = localStorage.getItem('userInfo')
//         setOwnData(userData ? JSON.parse(userData) : null)
//     }, [])

//     return (
//         <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
//             {/* left side */}
//             <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
//                 <div className='h-fit'>
//                     <ProfileCard data={post?.user}/>
//                 </div>



//             </div>

//             {/* middle side */}
//             <div className='w-[100%] py-5 sm:w-[50%] '>
//                 <div>
//                     <Post item={post} personalData={ownData}/>
//                 </div>
//             </div>

//             {/* right side */}
//             <div className='w-[26%] py-5 hidden md:block'>



//                 <div className='my-5 sticky top-19'>
//                     <Advertisement />
//                 </div>

//             </div>

//         </div>
//     )
// }

// export default SingleActivity


















import React, { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import Card from '../../components/Card/card'
import Post from '../../components/Post/post'
import Advertisement from '../../components/Advertisement/advertisement'
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'

const SingleActivity = () => {
    const { id, postId } = useParams();
    const location = useLocation();

    const [post, setPost] = useState(null)
    const [ownData, setOwnData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debug logging
    console.log('=== SINGLE ACTIVITY DEBUG ===');
    console.log('URL params - id:', id, 'postId:', postId);
    console.log('Current location:', location);
    console.log('Full pathname:', location.pathname);

    const fetchDataOnLoad = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Attempting API call to:', `https://globalconnectfinalproject.onrender.com/api/post/getPostById/${postId}`);
            
            // Check if postId exists
            if (!postId || postId === 'undefined') {
                throw new Error('Post ID is missing or invalid');
            }

            const res = await axios.get(`https://globalconnectfinalproject.onrender.com/api/post/getPostById/${postId}`);
            console.log('API Response:', res);
            console.log('Post data:', res.data);

            if (res.data && res.data.post) {
                setPost(res.data.post);
            } else {
                throw new Error('No post data received from API');
            }

        } catch (err) {
            console.error('API Error:', err);
            console.error('Error response:', err.response);
            
            const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
            setError(errorMessage);
            
            // Don't show alert in production, just log
            console.error('Error fetching post:', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('useEffect triggered with postId:', postId);
        
        if (postId) {
            fetchDataOnLoad();
        } else {
            setError('No post ID provided in URL');
            setLoading(false);
        }

        let userData = localStorage.getItem('userInfo');
        console.log('User data from localStorage:', userData);
        setOwnData(userData ? JSON.parse(userData) : null);
    }, [postId]);

    // Debug render
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div>Loading post... (ID: {postId})</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 p-4">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <div className="text-sm text-gray-600 mb-2">Debug Info:</div>
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    <div>Post ID: {postId || 'undefined'}</div>
                    <div>User ID: {id || 'undefined'}</div>
                    <div>URL: {location.pathname}</div>
                </div>
                <button 
                    onClick={fetchDataOnLoad}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center h-64">
                <div>Post not found (ID: {postId})</div>
            </div>
        );
    }

    return (
        <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
            {/* Debug panel - remove in production */}
            {/* <div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs z-50 max-w-xs">
                <div>Debug: Post ID = {postId}</div>
                <div>User ID = {id}</div>
                <div>Post loaded = {post ? 'Yes' : 'No'}</div>
            </div> */}

            {/* left side */}
            <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
                <div className='h-fit'>
                    <ProfileCard data={post?.user}/>
                </div>
            </div>

            {/* middle side */}
            <div className='w-[100%] py-5 sm:w-[50%] '>
                <div>
                    <Post item={post} personalData={ownData}/>
                </div>
            </div>

            {/* right side */}
            <div className='w-[26%] py-5 hidden md:block'>
                <div className='my-5 sticky top-19'>
                    <Advertisement />
                </div>
            </div>
        </div>
    )
}

export default SingleActivity
