import React from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center  dark:from-gray-800 dark:to-gray-900 pb-60">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105 dark:bg-gray-700 dark:shadow-none dark:border dark:border-gray-600">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 dark:text-white">
          Welcome!
        </h2>
        
        <div className="mb-6 flex justify-center">
          <img src="./img/luffy.png" alt="Welcome" className="rounded-md" />
        </div>
       
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-700 dark:text-gray-400">Sign in with</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4"> 
          {/* Google */}
          <div>
            <button 
            className="w-full min-w-[150px] flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-900 dark:focus:ring-indigo-500"
            onClick={handleGoogleLogin}
            >
              <FaGoogle className="h-5 w-5 mr-2 text-red-600" />
              Google
            </button>
          </div>
          {/* GitHub */}
          <div>
            <button 
            className="w-full min-w-[150px] flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-900 dark:focus:ring-indigo-500"
            onClick={handleGitHubLogin}
            >            
              <FaGithub className="h-5 w-5 mr-2 text-gray-800 dark:text-white" />
              GitHub
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          New here?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Use above Platform
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;