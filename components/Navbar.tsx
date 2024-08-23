"use client"
import Link from 'next/link';
import Image from "next/image"
import Logo from "@/public/logo.svg"
import { FaRegUserCircle, FaCalendarAlt, FaChalkboardTeacher, FaBell, FaBook } from "react-icons/fa";
import { useState } from 'react';
import UserAccountButton from './UserAccountButton';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <nav>
        {/* Regular Navbar */}
        <div className="hidden md:flex justify-between items-center h-12 bg-[#292929] drop-shadow-[0_0_5px_rgba(0,0,0,0.40)] w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <Link href='/'>
            <div className="flex items-center space-x-2">
            <Image 
            src={Logo}
            alt="Logo"
            className="w-6"/>
            <h2 className="font-bold"> <span className="text-[#4A4BC5]">Tutor</span> <span className="text-[#F7C738]">Dek</span> </h2>
            </div>
            </Link>
            <Link href="/tutors" className={`${pathname === '/tutors' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} h-12 hover:bg-[#4A4BC5] px-4 flex items-center`}>
            <div  className='flex items-center space-x-2'><FaChalkboardTeacher className='h-5'/> <span>Tutors</span></div>
            </Link>
            <Link href="/schedule" className={`${pathname === '/schedule' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] h-12 px-4 flex items-center`}>
            <div  className='flex items-center space-x-2'><FaCalendarAlt className='h-4'/> <span>Schedule</span></div>
            </Link>
            <Link href="/notifications/new" className={`${pathname === '/notifications/new' || pathname === '/notifications/read' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] px-4 h-12 flex item-center`}>
            <div  className='flex items-center space-x-2'><FaBell className='h-4'/> <span>Notifications</span></div>
            </Link>
            <Link href="/material" className={`${pathname === '/material' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] h-12 px-4 flex item-center`}>
            <div  className='flex items-center space-x-2'><FaBook className='h-4'/> <span>Material</span></div>
            </Link>

            <div className="relative">
            <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
               className="flex items-center space-x-2 hover:bg-[#4A4BC5] h-12 px-4 hover:text-white">
               <span>John Doe</span>
               <FaRegUserCircle />
            </button>
            {isDropdownOpen && (
               <div className="absolute right-0 mt-2 w-42">
               <UserAccountButton/>
               </div>
            )}
      </div>
      </div>

      {/* Hamburger */}
      <div>

      </div>
    </nav>
  );
}