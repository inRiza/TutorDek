"use client"
import Link from 'next/link';
import Image from "next/image"
import Logo from "@/public/logo.svg"
import { FaRegUserCircle, FaCalendarAlt, FaChalkboardTeacher, FaBell, FaBook, FaBars, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { TbLogout } from "react-icons/tb";
import { signOut } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const UserAccountButton = () => {
    return (
      <div>
          <Button onClick={() => signOut({
                  redirect: true,
                  callbackUrl: `${window.location.origin}/sign-in`
              })} variant="destructive">
                  Sign Out
              </Button>
      </div>
    )
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <nav>
        {/* Regular Navbar */}
        <div className="fixed top-0 left-0 flex justify-between items-center h-12 bg-[#292929] drop-shadow-[0_0_5px_rgba(0,0,0,0.40)] min-w-full mx-auto pr-4 sm:pr-6 md:px-6 lg:px-8 text-white">
            <Link href='/'>
            <div className="flex items-center space-x-2">
            <button className='md:hidden px-4 py-4 hover:bg-[#252525]' 
            onClick={(e) => {
              e.preventDefault(); toggleSidebar();}}><FaBars className='active:rotate-12 active:scale-150 transition ease-out '/></button>
            <Image 
            src={Logo}
            alt="Logo"
            className="w-6"/>
            <h2 className="font-bold"> <span className="text-[#4A4BC5]">Tutor</span> <span className="text-[#F7C738]">Dek</span> </h2>
            </div>
            </Link>
            <div className='hidden md:flex justify-between w-2/3 items-center'>
            <Link href="/tutors" className={`${pathname === '/tutors' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} h-12 hover:bg-[#4A4BC5] px-4 flex items-center transition-color duration-100 ease-in-out`}>
            <div  className='hover:scale-110 transition-transform flex items-center space-x-2 ease-in-out'><FaChalkboardTeacher className='h-5'/> <span>Tutors</span></div>
            </Link>
            <Link href="/schedule" className={`${pathname === '/schedule' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] h-12 px-4 flex items-center transition-color ease-in-out duration-100`}>
            <div  className='hover:scale-110 transition-transform flex items-center space-x-2 ease-in-out'><FaCalendarAlt className='h-4'/> <span>Schedule</span></div>
            </Link>
            <Link href="/notifications/new" className={`${pathname === '/notifications/new' || pathname === '/notifications/read' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] px-4 h-12 flex item-center transition-color ease-in-out duration-100`}>
            <div  className='hover:scale-110 transition-transform flex items-center space-x-2 ease-in-out'><FaBell className='h-4'/> <span>Notifications</span></div>
            </Link>
            <Link href="/material" className={`${pathname === '/material' ? 'text-[#4A4BC5] hover:text-white' : 'text-white'} hover:bg-[#4A4BC5] h-12 px-4 flex item-center transition-color ease-in-out duration-100`}>
            <div  className='hover:scale-110 transition-transform flex items-center space-x-2 ease-in-out'><FaBook className='h-4'/> <span>Material</span></div>
            </Link>
            </div>

            <div className="relative">
            <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
               className="hover:bg-[#4A4BC5] h-12 px-4 hover:text-white transform ease-in-out">
               <div className='hover:scale-110 transition-transform ease-in-out flex items-center space-x-2 duration-100'><span>John Doe</span>
               <FaRegUserCircle /></div>
            </button>
            {isDropdownOpen && (
               <div className="absolute right-0 mt-2 w-42">
               <UserAccountButton/>
               </div>
            )}
      </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Hamburger */}
      <div
        className={`fixed top-0 left-0 w-48 h-full bg-[#292929] text-white ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 pb-2">
          <button onClick={toggleSidebar} className="hover:text-[#4A4BC5] text-xl flex items-center space-x-2 <div className='flex hover:translate-x-2 transition ease-in-out'>"><div>Close</div><FaTimes/></button>
        </div>
        <div>
        <Link href='/'>
            <div className={`${pathname === "/" ? 'bg-[#252525]' : '' } pl-3 py-2 flex items-center space-x-1`}>
            <Image 
            src={Logo}
            alt="Logo"
            className="w-6"/>
            <h2 className="font-bold"><span className="text-[#4A4BC5]">Ho</span><span className="text-[#F7C738]">me</span></h2>
            </div>
            </Link>
          <Link href="/tutors"
            className={`pl-4 py-2 block ${pathname === '/tutors' ? 'text-[#4A4BC5] hover:text-white bg-[#252525]' : 'text-white'} hover:bg-[#4A4BC5]`}><div className='flex items-center space-x-2 hover:translate-x-2 transition ease-in-out'><FaChalkboardTeacher/><div>Tutors</div></div>
          </Link>
          <Link href="/schedule"
            className={`pl-4 py-2 block ${pathname === '/shedule' ? 'text-[#4A4BC5] hover:text-white bg-[#252525]' : 'text-white'} hover:bg-[#4A4BC5] flex items-center space-x-2`}><div className='flex items-center space-x-2 hover:translate-x-2 transition ease-in-out'><FaCalendarAlt/><div>Schedule</div></div>
          </Link>
          <Link href="/notifications/new"
            className={`pl-4 py-2 block ${pathname === '/notifications/new' || pathname === '/notifications/read' ? 'text-[#4A4BC5] hover:text-white bg-[#252525]' : 'text-white'} hover:bg-[#4A4BC5] flex items-center space-x-2`}><div className='flex items-center space-x-2 hover:translate-x-2 transition ease-in-out'><FaBell/><div>Notifications</div></div>
          </Link>
          <Link href="/material"
            className={`pl-4 py-2 block ${pathname === '/material' ? 'text-[#4A4BC5] hover:text-white bg-[#252525]' : 'text-white'} hover:bg-[#4A4BC5] flex items-center space-x-2`}><div className='flex items-center space-x-2 hover:translate-x-2 transition ease-in-out'><FaBook/><div>Material</div></div>
          </Link>
          <button 
          onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
          })}
          className='absolute bottom-0 py-4 pl-4 flex items-center text-red-600 hover:text-red-800 space-x-2'><TbLogout/><div>Sign Out</div></button>
        </div>
      </div>
    </nav>
  );
}