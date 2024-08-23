'use client'
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import ProfileAvatar from './ProfileAvatar';

const Header = () => {
  const [greeting, setGreeting] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [driverName, setDriverName] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchDriverName = async () => {
      try {
        const driverSheetRef = collection(db, 'driversheets');
        const driverSnapshot = await getDocs(driverSheetRef);
        const driverDoc = driverSnapshot.docs[0]?.data();
        if (driverDoc) {
          setDriverName(driverDoc.driverName || 'Unknown Driver');
        } else {
          setDriverName('Unknown Driver');
        }
      } catch (error) {
        console.error('Error fetching driver name:', error);
        setDriverName('Unknown Driver');
      }
    };

    fetchDriverName();
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
              {greeting}, <span className="font-normal">{driverName}</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white focus:outline-none hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              >
                <Menu size={20} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/dashboard" passHref>
                    <div onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Home
                    </div>
                  </Link>
                  <Link href="/notebook" passHref>
                    <div onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Notebook
                    </div>
                  </Link>
                  <Link href="/calendarView" passHref>
                    <div onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Calendar View
                    </div>
                  </Link>
                  <Link href="/analyze" passHref>
                    <div onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Analyze
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;