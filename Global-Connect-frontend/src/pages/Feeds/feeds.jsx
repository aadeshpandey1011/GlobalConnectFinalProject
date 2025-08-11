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
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Feeds = () => {

  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true); // Add loading state
  const [addPostModal, setAddPostModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true at start
      
      const [userData, postData] = await Promise.all([
        axios.get('http://localhost:4000/api/auth/self', { withCredentials: true }),
        axios.get('http://localhost:4000/api/post/getAllPost')
      ]);
      
      // FIXED: This was the main bug - you wrote personalData.data.user instead of userData.data.user
      setPersonalData(userData.data.user); // CORRECTED
      localStorage.setItem('userInfo', JSON.stringify(userData.data.user));  
      setPost(postData.data.posts);

      console.log('Personal Data:', userData.data.user); // Debug log
      console.log('Posts Data:', postData.data.posts); // Debug log

    } catch (err) {
      console.error('Fetch Error:', err); // Better error logging
      toast.error(err?.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenPostModal = () => {
    setAddPostModal(prev => !prev)
  }

  // Add loading state
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
              <div className="text-blue-900">23</div>
            </div>
            <div className=" w-full flex justify-between">
              <div>Post Impressions</div>
              <div className="text-blue-900">90</div>
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
              <img src={personalData?.profilePic} className='rounded-4xl border-2 h-13 w-13 border-white cursor-pointer' />
              <div onClick={() => setAddPostModal(true)} className='w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100'>Start a post</div>
            </div>

            <div className='w-full flex mt-3 '>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100' >
                <VideoCallIcon sx={{color:"blue"}} className='text-blue-900' />
                Video
              </div>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <InsertPhotoIcon sx={{color:"green"}} className='text-green-600' />
                Photo
              </div>
              <div onClick={() => setAddPostModal(true)} className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <ArticleIcon sx={{color:"red"}} className='text-red-600' />
                Article
              </div>
            </div>
          </Card> 
        </div>

        <div className="border-b-1 border-gray-400 w-[100%] my-5" />

        <div className='w-full flex flex-col gap-5'>
          {/* Debug: Show message if no posts */}
          {post.length === 0 ? (
            <Card padding={1}>
              <div className="text-center text-gray-500 py-8">
                No posts to display
              </div>
            </Card>
          ) : (
            post.map((item, index) => {
              return <Post item={item} key={item._id || index} personalData={personalData} />; // Use item._id as key if available
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
          </Card>
        </div>

        <div className='my-5 sticky top-19'>
          <Advertisement />
        </div>
      </div>

      {
        addPostModal && <Modal closeModal={handleOpenPostModal} title={""}>
          <AddModal personalData={personalData} />
        </Modal>
      }
      <ToastContainer />
    </div>
  )
}

export default Feeds