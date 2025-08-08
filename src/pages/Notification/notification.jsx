// import React, { useEffect, useState } from 'react'
// import ProfileCard from '../../components/ProfileCard/profileCard'
// import Advertisement from '../../components/Advertisement/advertisement'
// import Card from '../../components/Card/card'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// const Notification = () => {
//   const navigate = useNavigate();
//   const [ownData, setOwnData] = useState(null);

//   const [notifications, setNotifications] = useState([]);

//   const fetchNotificationData = async () => {
//     await axios.get('http://localhost:4000/api/notification', { withCredentials: true }).then(res => {
//       {/* 
//                         Please Watch the video for full code
//                     */}
//     }).catch(err => {
//       console.log(err);
//       alert("Something went wrong")
//     })
//   }

//   const handleOnClickNotification = async(item)=>{
//     await axios.put('http://localhost:4000/api/notification/isRead',{notificationId:item._id},{withCredentials:true}).then(res=>{
//         {/* 
//                         Please Watch the video for full code
//                     */}
//     }).catch(err => {
//       console.log(err);
//       alert("Something went wrong")
//     })
//   }

//   useEffect(() => {
//     let userData = localStorage.getItem('userInfo')
//     setOwnData(userData ? JSON.parse(userData) : null)

//     fetchNotificationData()
//   }, [])
//   return (
//     <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
//       {/* left side */}
//       <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
//         <div className='h-fit'>
//           <ProfileCard data={ownData} />
//         </div>
//       </div>

//       {/* middle side */}
//       <div className='w-[100%] py-5 sm:w-[50%]'>

//         <div>
//           <Card padding={0} >
//             <div className="w-full">

//               {/* For each notification */}


//               {/* 
//                         Please Watch the video for full code
//                     */}



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

// export default Notification



import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/ProfileCard/profileCard'
import Advertisement from '../../components/Advertisement/advertisement'
import Card from '../../components/Card/card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Notification = () => {
  const navigate = useNavigate();
  const [ownData, setOwnData] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const fetchNotificationData = async () => {
    await axios.get('http://localhost:4000/api/notification', { withCredentials: true }).then(res => {
      {/* 
                        Please Watch the video for full code
                    */}
    }).catch(err => {
      console.log(err);
      alert("Something went wrong")
    })
  }

  const handleOnClickNotification = async(item)=>{
    await axios.put('http://localhost:4000/api/notification/isRead',{notificationId:item._id},{withCredentials:true}).then(res=>{
        {/* 
                        Please Watch the video for full code
                    */}
    }).catch(err => {
      console.log(err);
      alert("Something went wrong")
    })
  }

  useEffect(() => {
    let userData = localStorage.getItem('userInfo')
    setOwnData(userData ? JSON.parse(userData) : null)

    fetchNotificationData()
  }, [])
  return (
    <div className='px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100'>
      {/* left side */}
      <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
        <div className='h-fit'>
          <ProfileCard data={ownData} />
        </div>
      </div>

      {/* middle side */}
      <div className='w-[100%] py-5 sm:w-[50%]'>

        <div>
          <Card padding={0} >
            <div className="w-full">

              {/* For each notification */}  {/*  Updated code by me i.e Dushyant kumar */}
                   <div className='border-b-1 cursor-pointer  flex gap-4 items-center  border-gray-300 p-3 '>
                   <img src='http://res.cloudinary.com/dbraoytbj/image/upload/v1747306941/xrwoi4wh6ytmzcksnvdf.jpg' className='rounded-full  cursor-pointer w-15 h-15' />
                   <div> Dummy User sent you friend request</div>
                </div>
          
                {/* For each notification */}  {/*  Updated code by me i.e Dushyant kumar */}

                        Please Watch the video for full code
                   <div className='border-b-1 cursor-pointer  flex gap-4 items-center  border-gray-300 p-3 '>
                   <img src='http://res.cloudinary.com/dbraoytbj/image/upload/v1747306941/xrwoi4wh6ytmzcksnvdf.jpg' className='rounded-full  cursor-pointer w-15 h-15' />
                   <div> Dummy User has Commented on your post </div>
                </div>
                  
                    {/*  yaha tk code add hua hai bsss mtlb ki line no. 59 to 70 */}

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

export default Notification