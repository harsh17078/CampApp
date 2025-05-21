import { useState } from 'react'
import {Routes , Route} from 'react-router';
import Homepage from './pages/Homepage'
function App() {
 

  return (
    <>
    <Navbar/>
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
