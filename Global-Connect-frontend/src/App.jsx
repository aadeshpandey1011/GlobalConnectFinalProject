import { useState,useEffect } from 'react'

import './App.css'
import Navbar1 from './components/NavbarV1/navbar1'
import LandingPage from './pages/LandingPage/landingPage'
import Footer from './components/Footer/footer'
import {Routes,Route,Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp/signUp'
import Login from './pages/Login/login'
import Navbar2 from './components/Navbar2/navbar2'
import Feeds from './pages/Feeds/feeds'
import MyNetwork from './pages/MyNetwork/myNetwork'
import Resume from './pages/Resume/resume'
import Messages from './pages/Messages/messages'
import Profile from './pages/Profile/profile'
import AllActivities from './pages/AllActivities/allActivities'
import SingleActivity from './pages/SingleActivity/singleActivity'
import Notification from './pages/Notification/notification'




function App() {
  const [isLogin,setIsLogin] = useState(localStorage.getItem('isLogin'))

  
  const changeLoginValue = (val)=>{
    setIsLogin(val)
  }

  


  return (
    <div className='bg-gray-100 w-[100%] h-[100%] box-border'>
      {isLogin?<Navbar2/> : <Navbar1 />}
      <Routes>
        <Route path='/' element={isLogin?<Navigate to={'/feeds'}/>:<LandingPage changeLoginValue={changeLoginValue}/>} />

        <Route path='/signUp' element={isLogin?<Navigate to={'/feeds'}/>:<SignUp changeLoginValue={changeLoginValue} />}/>

        <Route path='/login' element={isLogin?<Navigate to={'/feeds'}/>:<Login changeLoginValue={changeLoginValue} />}/>

        <Route path='/feeds' element={isLogin?<Feeds /> : <Navigate to={'/login'}/>} />

        <Route path='/myNetwork' element={isLogin?<MyNetwork /> : <Navigate to={'/login'}/> } />

        <Route path='/resume' element={isLogin?<Resume /> : <Navigate to={'/login'}/> } />

        <Route path='/messages' element={isLogin?<Messages />: <Navigate to={'/login'}/>} />

        <Route path='/notification' element={isLogin?<Notification /> : <Navigate to={'/login'}/>} />


        <Route path='/profile/:id' element={isLogin?<Profile /> : <Navigate to={'/login'}/>} />

        <Route path='/profile/:id/activities' element={isLogin?<AllActivities /> : <Navigate to={'/login'}/>} />

        <Route path='/profile/:id/activities/:postId' element={isLogin?<SingleActivity /> : <Navigate to={'/login'}/>} />

      </Routes>
      <Footer/>
    </div>
      
  )
}

export default App
