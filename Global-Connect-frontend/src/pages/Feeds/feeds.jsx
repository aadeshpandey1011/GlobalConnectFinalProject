import React, { useState, useEffect } from 'react'
import Card from '../../components/Card/card'
import ProfileCard from '../../components/ProfileCard/profileCard'
import VideoCallIcon from '@mui/icons-material/VideoCall';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import Advertisement from '../../components/Advertisement/advertisement';
import Post from '../../components/Post/post';
import Modal from '../../components/Modal/modal';
import AddModal from '../../components/AddModal/addModal';
import Loader from '../../components/Loader/loader';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import authService from '../../utils/authService'; // Import the auth service

const Feeds = () => {
  const navigate = useNavigate();

  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true);
  const [addPostModal, setAddPostModal] = useState(false);
  const [profileViews, setProfileViews] = useState(0);
  const [postImpressions, setPostImpressions] = useState(0);

  // ✅ Validation function for post data
  const validatePostData = (postItem) => {
    if (!postItem) {
      console.warn('Post item is null or undefined');
      return false;
    }

    if (!postItem._id) {
      console.warn('Post ID is missing:', postItem);
      return false;
    }

    // For reposts, check originalPost.user, for regular posts check user
    const userToCheck = postItem.originalPost?.user || postItem.user;

    if (!userToCheck || !userToCheck._id || !userToCheck.f_name) {
      console.warn('Post user data is missing or incomplete:', {
        postId: postItem._id,
        isRepost: postItem.isRepost,
        user: userToCheck,
        originalUser: postItem.originalPost?.user,
        regularUser: postItem.user
      });
      return false;
    }

    return true;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check authentication first
      if (!authService.isAuthenticated()) {
        toast.error('Please login to view feeds');
        navigate('/login');
        return;
      }

      // Validate session
      const isValidSession = await authService.validateSession();
      if (!isValidSession) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      console.log('🔄 Starting data fetch...');

      // Use auth service for consistent API calls
      const [userData, postData] = await Promise.all([
        authService.makeAuthenticatedRequest('GET', '/auth/self'),
        authService.makeAuthenticatedRequest('GET', '/post/getAllPost')
      ]);

      console.log('✅ Raw API responses received');
      console.log('User data:', userData.data.user);
      console.log('Posts data:', postData.data.posts);

      const user = userData.data.user;
      const posts = postData.data.posts || [];

      setPersonalData(user);
      
      // Update auth data with fresh user info
      authService.setAuthData(authService.getAuthData().token, user);

      // ✅ Filter and validate posts before setting state
      const validPosts = posts.filter(validatePostData);

      console.log(`📊 Post validation results:`);
      console.log(`- Raw posts: ${posts.length}`);
      console.log(`- Valid posts: ${validPosts.length}`);
      console.log(`- Invalid posts: ${posts.length - validPosts.length}`);

      setPost(validPosts);

      if (posts.length !== validPosts.length) {
        toast.warning(`Some posts couldn't be loaded due to missing data`);
      }

      // ✅ Count friends (profile viewers)
      setProfileViews(user.friends?.length || 0);

      // ✅ Count total likes + comments for logged-in user's posts
      const myPosts = validPosts.filter(p =>
        p.user === user._id || p.user?._id === user._id
      );
      const impressions = myPosts.reduce((total, p) => {
        const likeCount = p.likes?.length || 0;
        const commentCount = p.comments || 0; // already stored as a number
        return total + likeCount + commentCount;
      }, 0);
      setPostImpressions(impressions);

    } catch (err) {
      console.error('❌ Fetch Error:', err);

      // ✅ Better error handling
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(err?.response?.data?.error || 'Failed to fetch data');
      }

      // ✅ Set empty states on error
      setPost([]);
      setPersonalData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Debug useEffect to log post data
  useEffect(() => {
    if (post.length > 0) {
      console.log('🔍 POST DATA DEBUG:');
      post.forEach((item, index) => {
        console.log(`Post ${index}:`, {
          _id: item._id,
          isRepost: item.isRepost,
          user: item.user,
          userId: item.user?._id,
          originalPost: item.originalPost,
          originalUserId: item.originalPost?.user?._id,
        });

        // ✅ Validate each post
        if (!validatePostData(item)) {
          console.error(`❌ Invalid post at index ${index}:`, item);
        }
      });
    }
  }, [post]);

  const handleOpenPostModal = () => {
    setAddPostModal(prev => !prev)
  }

  // ✅ Handle repost callback with validation
  const handleRepost = (newRepost) => {
    console.log('🔄 Handling new repost:', newRepost);

    if (newRepost && newRepost.post && validatePostData(newRepost.post)) {
      setPost(prevPosts => [newRepost.post, ...prevPosts]);
      toast.success('Repost added to feed!');
    } else {
      console.error('❌ Invalid repost data:', newRepost);
      toast.error('Error adding repost to feed');
      // Refresh the feed to get updated data
      fetchData();
    }
  }

  // ✅ Handle new post creation with validation
  const handleNewPost = (newPost) => {
    console.log('🔄 Handling new post:', newPost);

    if (newPost && validatePostData(newPost)) {
      setPost(prevPosts => [newPost, ...prevPosts]);
      setAddPostModal(false);
      toast.success('Post created successfully!');
    } else {
      console.error('❌ Invalid new post data:', newPost);
      toast.error('Error adding new post');
      setAddPostModal(false);
      // Refresh the feed to get updated data
      fetchData();
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
      {/* left side */}
      <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
        <div className='h-fit'>
          <ProfileCard data={personalData} />
        </div>

        <div className='w-full my-5'>
          <Card padding={1}>
            <div className=" w-full flex justify-between">
              <div>Profile Viewers</div>
              <div className="text-blue-900">{profileViews}</div>
            </div>
            <div className=" w-full flex justify-between">
              <div>Post Impressions</div>
              <div className="text-blue-900">{postImpressions}</div>
            </div>
            <div className=" w-full flex justify-between">
              <div>Post Reposts</div>
              <div className="text-blue-900">
                {post.reduce((total, item) => total + (item?.reposts?.length || 0), 0)}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* middle side */}
      <div className='w-[100%] py-5 sm:w-[50%] '>

        {/* Post Section */}
        <div>
          <Card padding={1}>
            <div className='flex gap-3 items-center'>
              <img
                src={personalData?.profilePic || '/default-avatar.png'}
                className='rounded-4xl border-2 h-13 w-13 border-white cursor-pointer'
                onError={(e) => { e.target.src = '/default-avatar.png' }}
                alt="Profile"
              />
              <div onClick={() => setAddPostModal(true)} className='w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100'>Start a post</div>
            </div>

            <div className='w-full flex mt-3 '>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100' >
                <VideoCallIcon sx={{ color: "blue" }} className='text-blue-900' />
                Video
              </div>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <InsertPhotoIcon sx={{ color: "green" }} className='text-green-600' />
                Photo
              </div>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <ArticleIcon sx={{ color: "red" }} className='text-red-600' />
                Article
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b-1 border-gray-400 w-[100%] my-5" />

        <div className='w-full flex flex-col gap-5'>
          {post.length === 0 ? (
            <Card padding={1}>
              <div className="text-center text-gray-500 py-8">
                {loading ? 'Loading posts...' : 'No posts to display'}
                {!loading && (
                  <button
                    onClick={fetchData}
                    className="block mx-auto mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </Card>
          ) : (
            post.map((item, index) => {
              // ✅ Double-check validation before rendering
              if (!validatePostData(item)) {
                console.error(`❌ Skipping invalid post at render:`, item);
                return null;
              }

              return (
                <Post
                  item={item}
                  key={item._id || index}
                  personalData={personalData}
                  onRepost={handleRepost}
                />
              );
            })
          )}
        </div>
      </div>

      {/* right side */}
      <div className='w-[26%] py-5 hidden md:block'>
        <div>
          <Card padding={1}>
            <div className="text-xl" > GlobalConnect News</div>
            <div className="text-gray-600">Top Stories</div>
            <div className="my-1">
              <div className="text-md">Buffett to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            <div className="my-1">
              <div className="text-md">Foreign Investments surge again</div>
              <div className="text-xs text-gray-400">3h ago</div>
            </div>
            <div className="my-1">
              <div className="text-md">LinkedIn launches new repost features</div>
              <div className="text-xs text-gray-400">5h ago</div>
            </div>
          </Card>
        </div>

        <div className='my-5 sticky top-19'>
          <Advertisement />
        </div>
      </div>

      {
        addPostModal && <Modal closeModal={handleOpenPostModal} title={""}>
          <AddModal personalData={personalData} onNewPost={handleNewPost} />
        </Modal>
      }
      <ToastContainer />
    </div>
  )
}

export default Feeds




















// import React, { useState, useEffect } from 'react'
// import Card from '../../components/Card/card'
// import ProfileCard from '../../components/ProfileCard/profileCard'
// import VideoCallIcon from '@mui/icons-material/VideoCall';
// import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
// import ArticleIcon from '@mui/icons-material/Article';
// import Advertisement from '../../components/Advertisement/advertisement';
// import Post from '../../components/Post/post';
// import Modal from '../../components/Modal/modal';
// import AddModal from '../../components/AddModal/addModal';
// import Loader from '../../components/Loader/loader';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';

// const Feeds = () => {

//   const [personalData, setPersonalData] = useState(null);
//   const [post, setPost] = useState([])
//   const [loading, setLoading] = useState(true);
//   const [addPostModal, setAddPostModal] = useState(false);

//   // ✅ Validation function for post data
//   const validatePostData = (postItem) => {
//     if (!postItem) {
//       console.warn('Post item is null or undefined');
//       return false;
//     }

//     if (!postItem._id) {
//       console.warn('Post ID is missing:', postItem);
//       return false;
//     }

//     // For reposts, check originalPost.user, for regular posts check user
//     const userToCheck = postItem.originalPost?.user || postItem.user;

//     if (!userToCheck || !userToCheck._id || !userToCheck.f_name) {
//       console.warn('Post user data is missing or incomplete:', {
//         postId: postItem._id,
//         isRepost: postItem.isRepost,
//         user: userToCheck,
//         originalUser: postItem.originalPost?.user,
//         regularUser: postItem.user
//       });
//       return false;
//     }

//     return true;
//   };

//   // const fetchData = async () => {
//   //   try {
//   //     setLoading(true);

//   //     console.log('🔄 Starting data fetch...');

//   //     const [userData, postData] = await Promise.all([
//   //       axios.get('http://localhost:4000/api/auth/self', { withCredentials: true }),
//   //       axios.get('http://localhost:4000/api/post/getAllPost')
//   //     ]);

//   //     console.log('✅ Raw API responses received');
//   //     console.log('User data:', userData.data.user);
//   //     console.log('Posts data:', postData.data.posts);

//   //     setPersonalData(userData.data.user);
//   //     localStorage.setItem('userInfo', JSON.stringify(userData.data.user));

//   //     // ✅ Filter and validate posts before setting state
//   //     const rawPosts = postData.data.posts || [];
//   //     const validPosts = rawPosts.filter(validatePostData);

//   //     console.log(`📊 Post validation results:`);
//   //     console.log(`- Raw posts: ${rawPosts.length}`);
//   //     console.log(`- Valid posts: ${validPosts.length}`);
//   //     console.log(`- Invalid posts: ${rawPosts.length - validPosts.length}`);

//   //     setPost(validPosts);

//   //     if (rawPosts.length !== validPosts.length) {
//   //       toast.warning(`Some posts couldn't be loaded due to missing data`);
//   //     }

//   //   } catch (err) {
//   //     console.error('❌ Fetch Error:', err);

//   //     // ✅ Better error handling
//   //     if (err.response?.status === 401) {
//   //       toast.error('Session expired. Please login again.');
//   //       // Redirect to login
//   //     } else if (err.response?.status >= 500) {
//   //       toast.error('Server error. Please try again later.');
//   //     } else {
//   //       toast.error(err?.response?.data?.error || 'Failed to fetch data');
//   //     }

//   //     // ✅ Set empty states on error
//   //     setPost([]);
//   //     setPersonalData(null);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }

//   const [profileViews, setProfileViews] = useState(0);
//   const [postImpressions, setPostImpressions] = useState(0);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       setLoading(true);

//       const [userData, postData] = await Promise.all([
//         axios.get('https://globalconnectfinalproject.onrender.com/api/auth/self', { withCredentials: true }),
//       axios.get('https://globalconnectfinalproject.onrender.com/api/auth/self', {
//           headers: {
//             'Authorization': `Bearer ${ token }`
//                 }
//             }),


//     axios.get('https://globalconnectfinalproject.onrender.com/api/post/getAllPost')
//       ]);

// const user = userData.data.user;
// const posts = postData.data.posts;

// setPersonalData(user);
// localStorage.setItem('userInfo', JSON.stringify(user));
// setPost(posts);

// // ✅ Count friends (profile viewers)
// setProfileViews(user.friends?.length || 0);

// // ✅ Count total likes + comments for logged-in user's posts
// const myPosts = posts.filter(p =>
//   p.user === user._id || p.user?._id === user._id
// );
// const impressions = myPosts.reduce((total, p) => {
//   const likeCount = p.likes?.length || 0;
//   const commentCount = p.comments || 0; // already stored as a number
//   return total + likeCount + commentCount;
// }, 0);
// setPostImpressions(impressions);

//     } catch (err) {
//   console.error('Fetch Error:', err);
//   toast.error(err?.response?.data?.error || 'Failed to fetch data');
// } finally {
//   setLoading(false);
// }
//   };

// useEffect(() => {
//   fetchData()
// }, [])

// // ✅ Debug useEffect to log post data
// useEffect(() => {
//   if (post.length > 0) {
//     console.log('🔍 POST DATA DEBUG:');
//     post.forEach((item, index) => {
//       console.log(`Post ${index}:`, {
//         _id: item._id,
//         isRepost: item.isRepost,
//         user: item.user,
//         userId: item.user?._id,
//         originalPost: item.originalPost,
//         originalUserId: item.originalPost?.user?._id,
//       });

//       // ✅ Validate each post
//       if (!validatePostData(item)) {
//         console.error(`❌ Invalid post at index ${index}:`, item);
//       }
//     });
//   }
// }, [post]);

// const handleOpenPostModal = () => {
//   setAddPostModal(prev => !prev)
// }

// // ✅ Handle repost callback with validation
// const handleRepost = (newRepost) => {
//   console.log('🔄 Handling new repost:', newRepost);

//   if (newRepost && newRepost.post && validatePostData(newRepost.post)) {
//     setPost(prevPosts => [newRepost.post, ...prevPosts]);
//     toast.success('Repost added to feed!');
//   } else {
//     console.error('❌ Invalid repost data:', newRepost);
//     toast.error('Error adding repost to feed');
//     // Refresh the feed to get updated data
//     fetchData();
//   }
// }

// // ✅ Handle new post creation with validation
// const handleNewPost = (newPost) => {
//   console.log('🔄 Handling new post:', newPost);

//   if (newPost && validatePostData(newPost)) {
//     setPost(prevPosts => [newPost, ...prevPosts]);
//     setAddPostModal(false);
//     toast.success('Post created successfully!');
//   } else {
//     console.error('❌ Invalid new post data:', newPost);
//     toast.error('Error adding new post');
//     setAddPostModal(false);
//     // Refresh the feed to get updated data
//     fetchData();
//   }
// }

// if (loading) {
//   return (
//     <div className='flex justify-center items-center h-screen'>
//       <Loader />
//     </div>
//   );
// }

// return (
//   <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
//     {/* left side */}
//     <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
//       <div className='h-fit'>
//         <ProfileCard data={personalData} />
//       </div>

//       <div className='w-full my-5'>
//         <Card padding={1}>
//           <div className=" w-full flex justify-between">
//             <div>Profile Viewers</div>
//             <div className="text-blue-900">{profileViews}</div>
//           </div>
//           <div className=" w-full flex justify-between">
//             <div>Post Impressions</div>
//             <div className="text-blue-900">{postImpressions}</div>
//           </div>
//           <div className=" w-full flex justify-between">
//             <div>Post Reposts</div>
//             <div className="text-blue-900">
//               {post.reduce((total, item) => total + (item?.reposts?.length || 0), 0)}
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>

//     {/* middle side */}
//     <div className='w-[100%] py-5 sm:w-[50%] '>

//       {/* Post Section */}
//       <div>
//         <Card padding={1}>
//           <div className='flex gap-3 items-center'>
//             <img
//               src={personalData?.profilePic || '/default-avatar.png'}
//               className='rounded-4xl border-2 h-13 w-13 border-white cursor-pointer'
//               onError={(e) => { e.target.src = '/default-avatar.png' }}
//             />
//             <div onClick={() => setAddPostModal(true)} className='w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100'>Start a post</div>
//           </div>

//           <div className='w-full flex mt-3 '>
//             <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100' >
//               <VideoCallIcon sx={{ color: "blue" }} className='text-blue-900' />
//               Video
//             </div>
//             <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
//               <InsertPhotoIcon sx={{ color: "green" }} className='text-green-600' />
//               Photo
//             </div>
//             <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
//               <ArticleIcon sx={{ color: "red" }} className='text-red-600' />
//               Article
//             </div>
//           </div>
//         </Card>
//       </div>

//       <div className="border-b-1 border-gray-400 w-[100%] my-5" />

//       <div className='w-full flex flex-col gap-5'>
//         {post.length === 0 ? (
//           <Card padding={1}>
//             <div className="text-center text-gray-500 py-8">
//               {loading ? 'Loading posts...' : 'No posts to display'}
//               {!loading && (
//                 <button
//                   onClick={fetchData}
//                   className="block mx-auto mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Refresh
//                 </button>
//               )}
//             </div>
//           </Card>
//         ) : (
//           post.map((item, index) => {
//             // ✅ Double-check validation before rendering
//             if (!validatePostData(item)) {
//               console.error(`❌ Skipping invalid post at render:`, item);
//               return null;
//             }

//             return (
//               <Post
//                 item={item}
//                 key={item._id || index}
//                 personalData={personalData}
//                 onRepost={handleRepost}
//               />
//             );
//           })
//         )}
//       </div>
//     </div>

//     {/* right side */}
//     <div className='w-[26%] py-5 hidden md:block'>
//       <div>
//         <Card padding={1}>
//           <div className="text-xl" > GlobalConnect News</div>
//           <div className="text-gray-600">Top Stories</div>
//           <div className="my-1">
//             <div className="text-md">Buffett to remain Berkshire chair</div>
//             <div className="text-xs text-gray-400">2h ago</div>
//           </div>
//           <div className="my-1">
//             <div className="text-md">Foreign Investments surge again</div>
//             <div className="text-xs text-gray-400">3h ago</div>
//           </div>
//           <div className="my-1">
//             <div className="text-md">LinkedIn launches new repost features</div>
//             <div className="text-xs text-gray-400">5h ago</div>
//           </div>
//         </Card>
//       </div>

//       <div className='my-5 sticky top-19'>
//         <Advertisement />
//       </div>
//     </div>

//     {
//       addPostModal && <Modal closeModal={handleOpenPostModal} title={""}>
//         <AddModal personalData={personalData} onNewPost={handleNewPost} />
//       </Modal>
//     }
//     <ToastContainer />
//   </div>
// )
// }

// export default Feeds
