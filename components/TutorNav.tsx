import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { RiCalendarScheduleFill, RiProfileFill } from 'react-icons/ri';
import { AiFillSchedule } from 'react-icons/ai';
import { FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';  

const Sidebar = ({ user } : {user: any  }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const isActive = (path:any) => pathname === path;

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    // Set initial state based on screen size
    handleResize();
    // Add event listener to update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed h-[90%] bg-[#292929] rounded-lg border-[1px] border-[#7879ED] py-5 md:px-5 px-3 top-[50%] -translate-y-[50%] flex flex-col justify-between transition-all duration-300 ${isExpanded ? 'w-auto' : 'w-[5rem]'} md:w-auto z-20`}>
      
      <div>
        <div className={`flex ${isExpanded ? `justify-between` : 'justify-center'} items-center mb-10 md:hidden`}>
          <button onClick={toggleSidebar} className="text-white">
            {isExpanded ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {isExpanded && (
          <div className="hidden md:block">
            <p className="text-[#7879ED]">Tutor's Dashboard</p>
            <h2 className="text-[#7879ED] font-bold text-3xl">Welcome,</h2>
            <h2 className="text-[#7879ED] font-bold text-3xl">{user}</h2>
          </div>
        )}
        
        <div className={`mt-10 ${!isExpanded && 'space-y-4'}`}>
          <Link href="/tutor/appointments" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/tutor/appointments') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <RiCalendarScheduleFill className="text-2xl" />
            {isExpanded && <p className="font-semibold">Appointments</p>}
          </Link>
          <Link href="/tutor/assignments" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/tutor/assignments') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <AiFillSchedule className="text-2xl" />
            {isExpanded && <p className="font-semibold">Assignments</p>}
          </Link>
          <Link href="/tutor/information" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/tutor/information') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <RiProfileFill className="text-2xl" />
            {isExpanded && <p className="font-semibold">Account</p>}
          </Link>
          <Link href="/tutor/materials" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/tutor/materials') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <FaBookOpen className="text-2xl" />
            {isExpanded && <p className="font-semibold">Materials</p>}
          </Link> 
        </div>
      </div>

      <div className={`px-2 flex ${!isExpanded && `justify-center`}`}>
        <button className={`flex items-center gap-3 text-[#848484] hover:text-white`}
          onClick={() => signOut({ redirect: true, callbackUrl: `${window.location.origin}/sign-in` })}>
          <FaSignOutAlt className="text-2xl" />
          {isExpanded && <span className="font-semibold">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
