// import React, { useEffect, useState } from 'react'
// import ProfileCard from '../../components/ProfileCard/profileCard'
// import { useParams } from 'react-router-dom'
// import Advertisement from '../../components/Advertisement/advertisement';
// import Card from '../../components/Card/card';
// import Post from '../../components/Post/post';
// import axios from 'axios'

// const AllActivities = () => {

//   const { id } = useParams();

//   console.log(id)
//   // Fixed: Proper state declarations
//   const [posts, setPosts] = useState([]) // Changed 'post' to 'posts'
//   const [ownData, setOwnData] = useState(null) // Added missing state

//   const fetchDataOnLoad = async () => {
//     try {
//       const res = await axios.get(`http://localhost:4000/api/post/getAllPostForUser/${id}`)
//       console.log(res)
//       setPosts(res.data.posts)
//     } catch (err) {
//       console.log(err)
//       alert(err?.response?.data?.error || 'An error occurred')
//     }
//   }

//   useEffect(() => {
//     fetchDataOnLoad();

//     let userData = localStorage.getItem('userInfo')
//     setOwnData(userData ? JSON.parse(userData) : null)
//   }, [id])

//   return (
//     <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
//       {/* left side */}
//       <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
//         <div className='h-fit'>
//           {/* Fixed: Check if posts array has data before accessing */}
//           <ProfileCard data={posts[0]?.user} />
//         </div>
//       </div>

//       {/* middle side */}
//       <div className='w-[100%] py-5 sm:w-[50%] '>
//         <div>
//           <Card padding={1} >
//             <div className='text-xl'>All Activity</div>
//             <div className='cursor-pointer w-fit p-2 border-1 rounded-4xl bg-green-800 my-2 text-white font-semibold'>Posts</div>

//             <div className='my-2 flex flex-col gap-2'>
//               {/* Fixed: Use 'posts' instead of 'post' */}
//               {posts.length > 0 ? (
//                 posts.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <Post item={item} personalData={ownData}/>
//                     </div>
//                   )
//                 })
//               ) : (
//                 <div>No posts found</div>
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* right side */}
//       <div className='w-[26%] py-5 hidden md:block'>
//         <div className='my-5 sticky top-19'>
//           <Advertisement />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AllActivities


















import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import { useParams } from 'react-router-dom'
import Advertisement from '../../components/Advertisement/advertisement';
import Card from '../../components/Card/card';
import Post from '../../components/Post/post';
import axios from 'axios'

const AllActivities = () => {

  const { id } = useParams();

  console.log('AllActivities - User ID:', id)
  const [posts, setPosts] = useState([])
  const [ownData, setOwnData] = useState(null)

  const fetchDataOnLoad = async () => {
    try {
      const res = await axios.get(`https://globalconnectfinalproject.onrender.com/api/post/getAllPostForUser/${id}`)
      console.log('API Response:', res)
      console.log('Posts data:', res.data.posts)
      
      // DEBUG: Log all post IDs
      res.data.posts.forEach((post, index) => {
        console.log(`Post ${index}:`, {
          id: post._id,
          type: typeof post._id,
          user: post.user?._id,
          desc: post.desc?.substring(0, 50)
        });
      });
      
      setPosts(res.data.posts)
    } catch (err) {
      console.log(err)
      alert(err?.response?.data?.error || 'An error occurred')
    }
  }

  useEffect(() => {
    fetchDataOnLoad();

    let userData = localStorage.getItem('userInfo')
    setOwnData(userData ? JSON.parse(userData) : null)
  }, [id])

  return (
    <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
      {/* left side */}
      <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
        <div className='h-fit'>
          <ProfileCard data={posts[0]?.user} />
        </div>
      </div>

      {/* middle side */}
      <div className='w-[100%] py-5 sm:w-[50%] '>
        <div>
          <Card padding={1} >
            <div className='text-xl'>All Activity</div>
            <div className='cursor-pointer w-fit p-2 border-1 rounded-4xl bg-green-800 my-2 text-white font-semibold'>Posts</div>

            <div className='my-2 flex flex-col gap-2'>
              {posts.length > 0 ? (
                posts.map((item, index) => {
                  // DEBUG: Log each post before rendering
                  console.log(`Rendering post ${index}:`, item._id);
                  return (
                    <div key={item._id || index}>
                      <Post item={item} personalData={ownData}/>
                    
                      
                    </div>
                  )
                })
              ) : (
                <div>No posts found</div>
              )}
            </div>
          </Card>
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

export default AllActivities
