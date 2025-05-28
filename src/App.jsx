import { createContext, Suspense, useContext, useState } from 'react'
import { Routes, Route, data } from 'react-router';
import Navbar2 from './components/Navbar2'
import Loginpage from './pages/Loginpage'
import First from './pages/First'
import Messaging from './pages/Messaging'
import Sidebar from './components/Sidebar'
import Notfound from './pages/Notfound';
import Profile from './pages/profile';
import ProtectedRoute from './utils/ProtectedRoute';
import Splash from './components/splash';
import { lazy } from 'react';

const Homepage = lazy(() => import('./pages/Homepage.jsx'));

function App() {




  return (
    <Suspense fallback={<Splash />}>



      <Routes>
        <Route path="/" element={<First />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/home/' element={<Homepage />}></Route>
          <Route path='/profile' element={<Profile />} ></Route>
          <Route path='/messaging/' element={<Messaging />}></Route>
        </Route>

        <Route path='/login/' element={<Loginpage />}></Route>
        <Route path="*" element={<Notfound />}></Route>

      </Routes>

    </Suspense>
  )
}

export default App
