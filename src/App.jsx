import { useState } from 'react'
import {Routes , Route} from 'react-router';
import Homepage from './pages/Homepage'
import Navbar2 from './components/Navbar2'
import Loginpage from'./pages/Loginpage'
import Register from './pages/Register'
import Messaging from './pages/Messaging'
import Sidebar from './components/Sidebar'


function App() {
 

  return (
    <>

   
      <Routes>
        <Route path = '/' element = {<Homepage/>}></Route>
        <Route path = '/login/' element = {<Loginpage/>}></Route>
        <Route path = '/register/' element = {<Register/>}></Route>
        <Route path = '/massaging/' element = {<Messaging/>}></Route>

      </Routes>
    </>
  )
}

export default App
