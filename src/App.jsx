import { useState } from 'react'
import {Routes , Route} from 'react-router';
import Homepage from './pages/Homepage'
import Navbar2 from './components/Navbar2'
import Loginpage from'./pages/Loginpage'
import First from './pages/First'
import Messaging from './pages/Messaging'
import Sidebar from './components/Sidebar'
import Notfound from './pages/Notfound';
import Profile from './pages/profile';

function App() {
 

  return (
    <>

   
      <Routes>
        <Route path="/" element ={<First/>}></Route>
        <Route path = '/home/' element = {<Homepage/>}></Route>
        <Route path = '/login/' element = {<Loginpage/>}></Route>
        <Route path = '/messaging/' element = {<Messaging/>}></Route>
        <Route path='/profile' element={<Profile />} ></Route>
        <Route path ="*" element={<Notfound/>}></Route>

      </Routes>
    </>
  )
}

export default App
