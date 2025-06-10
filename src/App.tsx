import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import { Feed } from './pages/Feed';
import { Jobs } from './pages/Jobs';
import { Courses } from './pages/Courses';
import { Mentorship } from './pages/Mentorship';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { OnboardingSteps } from './pages/auth/Onboarding';
import { QATestRunner } from './components/qa/QATestRunner';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, loading, checkAuth, isConfigured } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      if (isConfigured) {
        await checkAuth();
      }
      setAppReady(true);
    };
    
    initApp();
  }, [checkAuth, isConfigured]);

  if (!appReady || (loading && isConfigured)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <img src="/logo.svg" alt="CareerNest" className="h-12 w-auto" />
          <p className="mt-4 text-gray-500">Loading CareerNest...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* QA Testing Route */}
      <Route path="/qa-testing" element={<QATestRunner />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<OnboardingSteps />} />
      </Route>
      
      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/login" />} />
        <Route path="/courses" element={user ? <Courses /> : <Navigate to="/login" />} />
        <Route path="/mentorship" element={user ? <Mentorship /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/profile/:id?" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;