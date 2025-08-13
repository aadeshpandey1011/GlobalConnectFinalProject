import React, { useState, useEffect } from 'react'
import Advertisement from '../../components/Advertisement/advertisement'
import Card from '../../components/Card/card'
import EditIcon from '@mui/icons-material/Edit';
import Post from '../../components/Post/post';
import AddIcon from '@mui/icons-material/Add';
import Modal from '../../components/Modal/modal';
import ImageModal from '../../components/ImageModal/imageModal';
import EditinfoModal from '../../components/EditInfoModal/editinfoModal';
import AboutModal from '../../components/AboutModal/aboutModal';
import ExpModal from '../../components/ExpModal/expModal';
import MessageModal from '../../components/MessageModal/messageModal';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import authService from '../../utils/authService'; // Import the auth service

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imageSetModal, setImageModal] = useState(false);
    const [circularImage, setCircularImage] = useState(true);

    const [infoModal, setInfoModal] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);
    const [expModal, setExpModal] = useState(false);
    const [messageModal, setMessageModal] = useState(false)

    const [userData, setUserData] = useState(null);
    const [postData, setPostData] = useState([]);
    const [ownData, setOwnData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [updateExp, setUpdateExp] = useState({ clicked: "", id: "", datas: {} });

    const updateExpEdit = (id, data) => {
        setUpdateExp({
            ...updateExp,
            clicked: true, id: id, data: data
        })
        setExpModal(prev => !prev)
    }

    useEffect(() => {
        checkAuthAndFetchData();
    }, [id])

    const checkAuthAndFetchData = async () => {
        try {
            setLoading(true);
            
            // Check if user is authenticated
            if (!authService.isAuthenticated()) {
                toast.error('Please login to view profiles');
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

            await fetchDataOnLoad();
        } catch (error) {
            console.error('Auth check failed:', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchDataOnLoad = async () => {
        try {
            // Use the auth service for consistent API calls
            const [userDatas, postDatas, ownDatas] = await Promise.all([
                authService.makeAuthenticatedRequest('GET', `/auth/user/${id}`),
                authService.makeAuthenticatedRequest('GET', `/post/getTop5Post/${id}`),
                authService.makeAuthenticatedRequest('GET', '/auth/self')
            ]);

            setUserData(userDatas.data.user);
            setPostData(postDatas.data.posts);
            setOwnData(ownDatas.data.user);
            
            // Update localStorage with fresh user data
            authService.setAuthData(authService.getAuthData().token, ownDatas.data.user);

        } catch (err) {
            console.error('Fetch error:', err);
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error("Something went wrong while fetching data");
            }
        }
    }

    const handleMessageModal = () => {
        setMessageModal(prev => !prev)
    }

    const handleExpModal = () => {
        if (expModal) {
            setUpdateExp({ clicked: "", id: "", datas: {} });
        }
        setExpModal(prev => !prev)
    }

    const handleAboutModal = () => {
        setAboutModal(prev => !prev)
    }

    const handleInfoModal = () => {
        setInfoModal(prev => !prev)
    }

    const handleImageModalOpenClose = () => {
        setImageModal(prev => !prev)
    }

    const handleOnEditCover = () => {
        setImageModal(true);
        setCircularImage(false)
    }

    const handleCircularimageOpen = () => {
        setImageModal(true);
        setCircularImage(true)
    }

    const handleEditFunc = async (data) => {
        try {
            await authService.makeAuthenticatedRequest('PUT', '/auth/update', { user: data });
            toast.success('Profile updated successfully');
            await fetchDataOnLoad(); // Refresh data instead of full page reload
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Something went wrong");
        }
    }

    const amIfriend = () => {  // userData = panish // ownData = shubham
        let arr = userData?.friends?.filter((item) => { return item === ownData?._id })
        return arr?.length;
    }

    const isInPendingList = () => {
        let arr = userData?.pending_friends?.filter((item) => { return item === ownData?._id })
        return arr?.length;
    }

    const isInSelfPendingList = () => {
        let arr = ownData?.pending_friends?.filter((item) => { return item === userData?._id })
        return arr?.length;
    }
    
    const checkFriendStatus = () => {
        if (amIfriend()) {
            return "Disconnect";
        }
        else if (isInSelfPendingList()) {
            return "Approve Request"
        }
        else if (isInPendingList()) {
            return "Request Sent"
        }
        else {
            return "Connect";
        }
    }
    
    const handleSendFriendRequest = async () => {
        if (checkFriendStatus() === "Request Sent") return;

        try {
            if (checkFriendStatus() === "Connect") {
                const response = await authService.makeAuthenticatedRequest('POST', '/auth/sendFriendReq', { reciever: userData?._id });
                toast.success(response.data.message);
                setTimeout(() => {
                    fetchDataOnLoad(); // Refresh data instead of page reload
                }, 2000)

            } else if (checkFriendStatus() === "Approve Request") {
                const response = await authService.makeAuthenticatedRequest('POST', '/auth/acceptFriendRequest', { friendId: userData?._id });
                toast.success(response.data.message);
                setTimeout(() => {
                    fetchDataOnLoad(); // Refresh data instead of page reload
                }, 2000)

            } else {
                const response = await authService.makeAuthenticatedRequest('DELETE', `/auth/removeFromFriendList/${userData?._id}`);
                toast.success(response.data.message);
                setTimeout(() => {
                    fetchDataOnLoad(); // Refresh data instead of page reload
                }, 2000)
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Something went wrong");
        }
    }

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success('Logged out successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error('Logout failed');
            // Clear local data anyway
            authService.clearAuthData();
            navigate('/login');
        }
    }

    const copyToClipboard = async () => {
        try {
            let string = `https://globalconnectfinalproject.onrender.com/profile/${id}`
            await navigator.clipboard.writeText(string);
            toast.success('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy!', err);
            toast.error('Failed to copy to clipboard');
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    // Show error state if no data
    if (!userData || !ownData) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className="text-xl text-red-500">Failed to load profile data</div>
            </div>
        );
    }

    return (
        <div className='px-5 xl:px-50 py-5 mt-5 flex flex-col gap-5 w-full pt-12 bg-gray-100'>
            <div className='flex justify-between'>

                {/* Left Side Main Section */}
                <div className='w-full md:w-[70%]'>
                    <div>
                        <Card padding={0}>
                            <div className='w-full h-fit '>
                                <div className='w-full h-[200px] relative'>
                                    <div className='absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white' onClick={handleOnEditCover}><EditIcon /></div>
                                    <img src={userData?.cover_pic} className='w-full h-[200px] rounded-tr-lg rounded-tl-lg ' />
                                    <div onClick={handleCircularimageOpen} className='absolute object-cover top-24 left-6 z-10'><img className='rounded-full border=2 border-white cursor-pointer w-35 h-35' src={userData?.profilePic} /></div>
                                </div>

                                <div className='mt-10 relative px-8 py-2'>
                                    {userData?._id === ownData?._id && <div className="absolute cursor-pointer top-0 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white" onClick={handleInfoModal} ><EditIcon /> </div>}
                                    <div className='w-full'>
                                        <div className="text-2xl">{userData?.f_name}</div>
                                        <div className="text-gray-700">{userData?.headline}</div>
                                        <div className="text-sm text-gray-500">{userData?.curr_location}</div>
                                        <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline">{userData?.friends?.length} Connections</div>

                                        <div className=' md:flex w-full justify-between'>
                                            <div className='my-5 flex gap-5'>
                                                <div className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
                                                    Open to
                                                </div>
                                                <div onClick={copyToClipboard} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
                                                    Share
                                                </div>
                                                {
                                                    userData?._id === ownData?._id && <div onClick={handleLogout} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
                                                        LogOut
                                                    </div>
                                                }

                                            </div>
                                            <div className='my-5 flex gap-5'>
                                                {
                                                    amIfriend() ? <div onClick={handleMessageModal} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold" >
                                                        Message
                                                    </div> : null
                                                }
                                                {
                                                    userData?._id === ownData?._id ? null : <div onClick={handleSendFriendRequest} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
                                                        {checkFriendStatus()}

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={1}>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>About</div>
                                {userData?._id === ownData?._id && <div onClick={handleAboutModal} className='cursor-pointer'><EditIcon /></div>}
                            </div>
                            <div className='text-gray-700 text-md w-[80%]'>{userData?.about}</div>

                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={1}>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Skills</div>
                            </div>
                            <div className='text-gray-700 text-md my-2 w-full flex gap-4 flex-wrap'>
                                {
                                    userData?.skills?.map((item, index) => {
                                        return (
                                            <div key={index} className='py-2 px-3 cursor-pointer bg-red-500 text-white rounded-lg'>{item}</div>
                                        )
                                    })
                                }
                            </div>
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={1}>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Activities</div>
                            </div>
                            <div className='cursor-pointer px-3 py-1 w-fit border-1 rounded-4xl bg-green-800 text-white font-semibold'>Posts</div>

                            {/* Parent div for scrollable activities  */}
                            <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
                                {postData.map((item, ind) => {
                                    // If it's a repost but originalPost is missing, show a fallback
                                    if (item.isRepost && !item.originalPost) {
                                        return (
                                            <div key={item._id} className="p-4 border rounded bg-red-50 text-red-500 w-[350px] h-[560px] flex items-center justify-center">
                                                Original post not found or has been deleted.
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            to={`/profile/${id}/activities/${item._id}`}
                                            className='cursor-pointer shrink-0 w-[350px] h-[560px]'
                                            key={item._id}
                                        >
                                            <Post profile={1} item={item} personalData={ownData} />
                                        </Link>
                                    )
                                })}
                            </div>

                            {
                                postData.length > 4 && <div className='w-full flex justify-center items-center'>
                                    <Link to={`/profile/${id}/activities`} className='p-2 rounded-xl cursor-pointer hover:bg-gray-300'>Show All Posts <ArrowRightAltIcon /></Link>
                                </div>
                            }
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={1}>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Experience</div>
                                {
                                    userData?._id === ownData?._id && <div onClick={handleExpModal} className='cursor-pointer'><AddIcon /></div>
                                }
                            </div>

                            <div className='mt-5 '>
                                {
                                    userData?.experience?.map((item, index) => {
                                        return (
                                            <div key={index} className='p-2 border-t-1 border-gray-300 flex justify-between'>
                                                <div>
                                                    <div className="text-lg">{item.designation}</div>
                                                    <div className="text-sm">{item.company_name}</div>
                                                    <div className="text-sm text-gray-500">{item.duration}</div>
                                                    <div className="text-sm text-gray-500">{item.location} </div>
                                                </div>
                                                {
                                                    userData?._id === ownData?._id && <div onClick={() => { updateExpEdit(item._id, item) }} className='cursor-pointer'><EditIcon /></div>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Side Add */}
                <div className='hidden md:flex md:w-[28%]'>
                    <div className='sticky top-19'>
                        <Advertisement />
                    </div>
                </div>

            </div>

            {
                imageSetModal && <Modal title='Upload Image' closeModal={handleImageModalOpenClose}>
                    <ImageModal handleEditFunc={handleEditFunc} selfData={ownData} isCircular={circularImage} />
                </Modal>
            }

            {
                infoModal && <Modal title="Edit Info" closeModal={handleInfoModal}>
                    <EditinfoModal handleEditFunc={handleEditFunc} selfData={ownData} />
                </Modal>
            }

            {
                aboutModal && <Modal title="Edit About" closeModal={handleAboutModal}>
                    <AboutModal handleEditFunc={handleEditFunc} selfData={ownData} />
                </Modal>
            }

            {
                expModal && <Modal title="Experience" closeModal={handleExpModal}>
                    <ExpModal handleEditFunc={handleEditFunc} selfData={ownData} updateExp={updateExp} setUpdateExp={updateExpEdit} />
                </Modal>
            }

            {
                messageModal && <Modal title="Send Message" closeModal={handleMessageModal}>
                    <MessageModal selfData={ownData} userData={userData} />
                </Modal>
            }

            <ToastContainer />
        </div>
    )
}

export default Profile



















// import React, { useState, useEffect } from 'react'
// import Advertisement from '../../components/Advertisement/advertisement'
// import Card from '../../components/Card/card'
// import EditIcon from '@mui/icons-material/Edit';
// import Post from '../../components/Post/post';
// import AddIcon from '@mui/icons-material/Add';
// import Modal from '../../components/Modal/modal';
// import ImageModal from '../../components/ImageModal/imageModal';
// import EditinfoModal from '../../components/EditInfoModal/editinfoModal';
// import AboutModal from '../../components/AboutModal/aboutModal';
// import ExpModal from '../../components/ExpModal/expModal';
// import MessageModal from '../../components/MessageModal/messageModal';
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';

// const Profile = () => {
//     const { id } = useParams();

//     const [imageSetModal, setImageModal] = useState(false);
//     const [circularImage, setCircularImage] = useState(true);

//     const [infoModal, setInfoModal] = useState(false);
//     const [aboutModal, setAboutModal] = useState(false);
//     const [expModal, setExpModal] = useState(false);
//     const [messageModal, setMessageModal] = useState(false)

//     const [userData, setUserData] = useState(null);
//     const [postData, setPostData] = useState([]);
//     const [ownData, setOwnData] = useState(null);

//     const [updateExp, setUpdateExp] = useState({ clicked: "", id: "", datas: {} });

//     const updateExpEdit = (id, data) => {
//         setUpdateExp({
//             ...updateExp,
//             clicked: true, id: id, data: data
//         })
//         setExpModal(prev => !prev)
//     }

//     useEffect(() => {
//         fetchDataOnLoad()
//     }, [id])

//     const fetchDataOnLoad = async () => {
//         try {
//             const [userDatas, postDatas, ownDatas] = await Promise.all([
//                 axios.get(`https://globalconnectfinalproject.onrender.com/api/auth/user/${id}`),
//                 axios.get(`https://globalconnectfinalproject.onrender.com/api/post/getTop5Post/${id}`),
//                 axios.get('https://globalconnectfinalproject.onrender.com/api/auth/self', { withCredentials: true }),
//                 axios.get('https://globalconnectfinalproject.onrender.com/api/auth/self', {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })

//             ]);

//             setUserData(userDatas.data.user);
//             setPostData(postDatas.data.posts);
//             setOwnData(ownDatas.data.user);
//             localStorage.setItem('userInfo', JSON.stringify(ownDatas.data.user));

//         } catch (err) {
//             console.log(err)
//             alert("Something Went Wrong")
//         }
//     }

//     const handleMessageModal = () => {
//         setMessageModal(prev => !prev)
//     }

//     const handleExpModal = () => {
//         if (expModal) {
//             setUpdateExp({ clicked: "", id: "", datas: {} });
//         }
//         setExpModal(prev => !prev)
//     }

//     const handleAboutModal = () => {
//         setAboutModal(prev => !prev)
//     }

//     const handleInfoModal = () => {
//         setInfoModal(prev => !prev)
//     }

//     const handleImageModalOpenClose = () => {
//         setImageModal(prev => !prev)
//     }

//     const handleOnEditCover = () => {
//         setImageModal(true);
//         setCircularImage(false)
//     }

//     const handleCircularimageOpen = () => {
//         setImageModal(true);
//         setCircularImage(true)
//     }

//     const handleEditFunc = async (data) => {
//         await axios.put(`https://globalconnectfinalproject.onrender.com/api/auth/update`, { user: data }, { withCredentials: true }).then(res => {
//             window.location.reload();
//         }).catch(err => {
//             console.log(err)
//             alert("Something Went Wrong")
//         })
//     }

//     const amIfriend = () => {  // userData = panish // ownData = shubham
//         let arr = userData?.friends?.filter((item) => { return item === ownData?._id })
//         return arr?.length;
//     }

//     const isInPendingList = () => {
//         let arr = userData?.pending_friends?.filter((item) => { return item === ownData?._id })
//         return arr?.length;
//     }

//     const isInSelfPendingList = () => {
//         let arr = ownData?.pending_friends?.filter((item) => { return item === userData?._id })
//         return arr?.length;
//     }
    
//     const checkFriendStatus = () => {
//         if (amIfriend()) {
//             return "Disconnect";
//         }
//         else if (isInSelfPendingList()) {
//             return "Approve Request"
//         }
//         else if (isInPendingList()) {
//             return "Request Sent"
//         }
//         else {
//             return "Connect";
//         }
//     }
    
//     const handleSendFriendRequest = async () => {
//         if (checkFriendStatus() === "Request Sent") return;

//         if (checkFriendStatus() === "Connect") {
//             await axios.post('https://globalconnectfinalproject.onrender.com/api/auth/sendFriendReq', { reciever: userData?._id }, { withCredentials: true }).then(res => {
//                 toast.success(res.data.message);
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000)

//             }).catch(err => {
//                 console.log(err);
//                 toast.error(err?.response?.data?.error)
//             })
//         } else if (checkFriendStatus() === "Approve Request") {
//             await axios.post('https://globalconnectfinalproject.onrender.com/api/auth/acceptFriendRequest', { friendId: userData?._id }, { withCredentials: true }).then(res => {
//                 toast.success(res.data.message);
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000)

//             }).catch(err => {
//                 console.log(err);
//                 toast.error(err?.response?.data?.error)
//             })
//         } else {
//             await axios.delete(`https://globalconnectfinalproject.onrender.com/api/auth/removeFromFriendList/${userData?._id}`, { withCredentials: true }).then(res => {
//                 toast.success(res.data.message);
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000)

//             }).catch(err => {
//                 console.log(err);
//                 toast.error(err?.response?.data?.error)
//             })
//         }
//     }

//     const handleLogout = async () => {
//         await axios.post('https://globalconnectfinalproject.onrender.com/api/auth/logout', {}, { withCredentials: true }).then(res => {
//             toast.success(res.data.message);
//             localStorage.clear();
//             setTimeout(() => {
//                 // window.location.reload();
//                 window.location.href = "/";
//             }, 2000)

//         }).catch(err => {
//             console.log(err);
//             toast.error(err?.response?.data?.error)
//         })
//     }

//     const copyToClipboard = async () => {
//         try {
//             let string = `https://globalconnectfinalproject.onrender.com/profile/${id}`
//             await navigator.clipboard.writeText(string);
//             toast.success('Copied to clipboard!');
//         } catch (err) {
//             console.error('Failed to copy!', err);
//         }
//     };

//     return (
//         <div className='px-5 xl:px-50 py-5 mt-5 flex flex-col gap-5 w-full pt-12 bg-gray-100'>
//             <div className='flex justify-between'>

//                 {/* Left Side Main Section */}
//                 <div className='w-full md:w-[70%]'>
//                     <div>
//                         <Card padding={0}>
//                             <div className='w-full h-fit '>
//                                 <div className='w-full h-[200px] relative'>
//                                     <div className='absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white' onClick={handleOnEditCover}><EditIcon /></div>
//                                     <img src={userData?.cover_pic} className='w-full h-[200px] rounded-tr-lg rounded-tl-lg ' />
//                                     <div onClick={handleCircularimageOpen} className='absolute object-cover top-24 left-6 z-10'><img className='rounded-full border=2 border-white cursor-pointer w-35 h-35' src={userData?.profilePic} /></div>
//                                 </div>

//                                 <div className='mt-10 relative px-8 py-2'>
//                                     {userData?._id === ownData?._id && <div className="absolute cursor-pointer top-0 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white" onClick={handleInfoModal} ><EditIcon /> </div>}
//                                     <div className='w-full'>
//                                         <div className="text-2xl">{userData?.f_name}</div>
//                                         <div className="text-gray-700">{userData?.headline}</div>
//                                         <div className="text-sm text-gray-500">{userData?.curr_location}</div>
//                                         <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline">{userData?.friends?.length} Connections</div>

//                                         <div className=' md:flex w-full justify-between'>
//                                             <div className='my-5 flex gap-5'>
//                                                 <div className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
//                                                     Open to
//                                                 </div>
//                                                 <div onClick={copyToClipboard} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
//                                                     Share
//                                                 </div>
//                                                 {
//                                                     userData?._id === ownData?._id && <div onClick={handleLogout} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
//                                                         LogOut
//                                                     </div>
//                                                 }

//                                             </div>
//                                             <div className='my-5 flex gap-5'>
//                                                 {
//                                                     amIfriend() ? <div onClick={handleMessageModal} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold" >
//                                                         Message
//                                                     </div> : null
//                                                 }
//                                                 {
//                                                     userData?._id === ownData?._id ? null : <div onClick={handleSendFriendRequest} className="cursor-pointer p-2 border rounded-lg bg-red-500 text-white font-semibold">
//                                                         {checkFriendStatus()}

//                                                     </div>
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>

//                     <div className='mt-5'>
//                         <Card padding={1}>
//                             <div className='flex justify-between items-center'>
//                                 <div className='text-xl'>About</div>
//                                 {userData?._id === ownData?._id && <div onClick={handleAboutModal} className='cursor-pointer'><EditIcon /></div>}
//                             </div>
//                             <div className='text-gray-700 text-md w-[80%]'>{userData?.about}</div>

//                         </Card>
//                     </div>

//                     <div className='mt-5'>
//                         <Card padding={1}>
//                             <div className='flex justify-between items-center'>
//                                 <div className='text-xl'>Skills</div>
//                             </div>
//                             <div className='text-gray-700 text-md my-2 w-full flex gap-4 flex-wrap'>
//                                 {
//                                     userData?.skills?.map((item, index) => {
//                                         return (
//                                             <div key={index} className='py-2 px-3 cursor-pointer bg-red-500 text-white rounded-lg'>{item}</div>
//                                         )
//                                     })
//                                 }
//                             </div>
//                         </Card>
//                     </div>

//                     <div className='mt-5'>
//                         <Card padding={1}>
//                             <div className='flex justify-between items-center'>
//                                 <div className='text-xl'>Activities</div>
//                             </div>
//                             <div className='cursor-pointer px-3 py-1 w-fit border-1 rounded-4xl bg-green-800 text-white font-semibold'>Posts</div>

//                             {/* Parent div for scrollable activities  */}
//                             <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
//                                 {postData.map((item, ind) => {
//                                     // If it's a repost but originalPost is missing, show a fallback
//                                     if (item.isRepost && !item.originalPost) {
//                                         return (
//                                             <div key={item._id} className="p-4 border rounded bg-red-50 text-red-500 w-[350px] h-[560px] flex items-center justify-center">
//                                                 Original post not found or has been deleted.
//                                             </div>
//                                         );
//                                     }
//                                     return (
//                                         <Link
//                                             to={`/profile/${id}/activities/${item._id}`}
//                                             className='cursor-pointer shrink-0 w-[350px] h-[560px]'
//                                             key={item._id}
//                                         >
//                                             <Post profile={1} item={item} personalData={ownData} />
//                                         </Link>
//                                     )
//                                 })}
//                             </div>

//                             {
//                                 postData.length > 4 && <div className='w-full flex justify-center items-center'>
//                                     <Link to={`/profile/${id}/activities`} className='p-2 rounded-xl cursor-pointer hover:bg-gray-300'>Show All Posts <ArrowRightAltIcon /></Link>
//                                 </div>
//                             }
//                         </Card>
//                     </div>

//                     <div className='mt-5'>
//                         <Card padding={1}>
//                             <div className='flex justify-between items-center'>
//                                 <div className='text-xl'>Experience</div>
//                                 {
//                                     userData?._id === ownData?._id && <div onClick={handleExpModal} className='cursor-pointer'><AddIcon /></div>
//                                 }
//                             </div>

//                             <div className='mt-5 '>
//                                 {
//                                     userData?.experience?.map((item, index) => {
//                                         return (
//                                             <div key={index} className='p-2 border-t-1 border-gray-300 flex justify-between'>
//                                                 <div>
//                                                     <div className="text-lg">{item.designation}</div>
//                                                     <div className="text-sm">{item.company_name}</div>
//                                                     <div className="text-sm text-gray-500">{item.duration}</div>
//                                                     <div className="text-sm text-gray-500">{item.location} </div>
//                                                 </div>
//                                                 {
//                                                     userData?._id === ownData?._id && <div onClick={() => { updateExpEdit(item._id, item) }} className='cursor-pointer'><EditIcon /></div>
//                                                 }
//                                             </div>
//                                         );
//                                     })
//                                 }
//                             </div>
//                         </Card>
//                     </div>
//                 </div>

//                 {/* Right Side Add */}
//                 <div className='hidden md:flex md:w-[28%]'>
//                     <div className='sticky top-19'>
//                         <Advertisement />
//                     </div>
//                 </div>

//             </div>

//             {
//                 imageSetModal && <Modal title='Upload Image' closeModal={handleImageModalOpenClose}>
//                     <ImageModal handleEditFunc={handleEditFunc} selfData={ownData} isCircular={circularImage} />
//                 </Modal>
//             }

//             {
//                 infoModal && <Modal title="Edit Info" closeModal={handleInfoModal}>
//                     <EditinfoModal handleEditFunc={handleEditFunc} selfData={ownData} />
//                 </Modal>
//             }

//             {
//                 aboutModal && <Modal title="Edit About" closeModal={handleAboutModal}>
//                     <AboutModal handleEditFunc={handleEditFunc} selfData={ownData} />
//                 </Modal>
//             }

//             {
//                 expModal && <Modal title="Experience" closeModal={handleExpModal}>
//                     <ExpModal handleEditFunc={handleEditFunc} selfData={ownData} updateExp={updateExp} setUpdateExp={updateExpEdit} />
//                 </Modal>
//             }

//             {
//                 messageModal && <Modal title="Send Message" closeModal={handleMessageModal}>
//                     <MessageModal selfData={ownData} userData={userData} />
//                 </Modal>
//             }

//             <ToastContainer />
//         </div>
//     )
// }

// export default Profile
