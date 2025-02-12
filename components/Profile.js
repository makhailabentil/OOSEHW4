import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user?.photoURL);

  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    }
    console.log('User photo URL:', user?.photoURL); // Debug log
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#27f7f7] hover:border-[#3acaec] transition-colors duration-200"
      >
        <img 
          src={profileImage || '/default-avatar.png'} 
          alt={user?.displayName || 'Profile'} 
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 console-box p-4 z-50">
          <div className="mb-4">
            <p className="mb-1">{'>'} PROFILE_</p>
            <p>{user.displayName}</p>
            <p className="text-sm opacity-70">{user.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between console-button px-4 py-2">
              <span>{'>'} {theme === 'dark' ? 'DARK_MODE' : 'LIGHT_MODE'}</span>
              <button 
                onClick={toggleTheme}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out"
                style={{
                  backgroundColor: theme === 'dark' ? '#27f7f7' : '#666',
                  boxShadow: theme === 'dark' ? '0 0 10px #27f7f7' : 'none'
                }}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform duration-200 ease-in-out rounded-full bg-white ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <button 
              onClick={logout}
              className="console-button w-full text-left"
            >
              {'>'} LOGOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}