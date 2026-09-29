import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import Loginpage from './pages/Loginpage';
import First from './pages/First';
import Messaging from './pages/Messaging';
import Notfound from './pages/Notfound';
import Profile from './pages/profile';
import ProtectedRoute from './utils/ProtectedRoute';
import Splash from './components/Splash';

const Homepage = lazy(() => import('./pages/Homepage.jsx'));

function App() {
  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route path="/" element={<First />} />
        
        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messaging" element={<Messaging />} />
        </Route>

        <Route path="/login" element={<Loginpage />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
