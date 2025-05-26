import React, { useState, useEffect } from 'react'

function DarkModeIcon() {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        
    
        // theme from localStorage
        const storedTheme = localStorage.getItem('theme');
        const dark = storedTheme === 'dark';
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
      }, []);
      const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };
  return (
    <button
        onClick={toggleTheme}
        className="fixed bottom-5 right-5 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm5.657 3.343a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414L16.243 5.343a1 1 0 011.414 0zM21 11a1 1 0 100 2h-2a1 1 0 100-2h2zM6.343 5.343a1 1 0 011.414 0L9.172 6.757a1 1 0 11-1.414 1.414L6.343 6.757a1 1 0 010-1.414zM12 18a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm7.657-1.657a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 000-1.414zM3 13a1 1 0 100-2h2a1 1 0 100 2H3zm3.343 4.657a1 1 0 000 1.414l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9 9 0 1112.998 3.248 7 7 0 0021.752 15z" />
          </svg>
        )}
      </button>
  )
}

export default DarkModeIcon