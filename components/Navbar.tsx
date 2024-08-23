"use client"
import Link from 'next/link';
import Image from "next/image"
import Logo from "@/public/logo.svg"
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from 'react';
import UserAccountButton from './UserAccountButton';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <nav className='bg-[#292929] drop-shadow-lg'>
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex justify-between items-center h-16">
        <Link href='/'>
          <div className="flex items-center space-x-2">
          <Image 
          src={Logo}
          alt="Logo"
          className="w-6"/>
          <h2 className="font-bold"> <span className="text-[#4A4BC5]">Tutor</span> <span className="text-[#F7C738]">Dek</span> </h2>
          </div>
          </Link>
            <Link href="/tutors" className={`${pathname === '/tutors' ? 'text-[#4A4BC5]' : 'text-white'} hover:text-[#4A4BC5]`}>
            Tutors
            </Link>
            <Link href="/schedule" className={`${pathname === '/schedule' ? 'text-[#4A4BC5]' : 'text-white'} hover:text-[#4A4BC5]`}>
            Schedule
            </Link>
            <Link href="/notifications/new" className={`${pathname === '/notifications/new' || pathname === '/notifications/read' ? 'text-[#4A4BC5]' : 'text-white'} hover:text-[#4A4BC5]`}>
            Notifications
            </Link>
            <Link href="/material" className={`${pathname === '/material' ? 'text-[#4A4BC5]' : 'text-white'} hover:text-[#4A4BC5]`}>
            Material
            </Link>

            <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center space-x-2 hover:text-[#4A4BC5]">
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
      </div>
    </nav>
  );
}