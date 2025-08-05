import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function AuthLayout() {
  const { user, loading } = useAuthStore();
  
  // If the user is already logged in, redirect to the home page
  if (user && !loading) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="https://i.ibb.co/35dJPQYC/69b30072-b992-4df8-93fe-f1590f420033.png" alt="CareerNest" className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            CareerNest
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect, Learn, and Grow Your Career
          </p>
        </div>
        
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}