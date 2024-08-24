import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { FaUser, FaUserTie } from "react-icons/fa";
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
            <p className="text-[#7879ED]">Admin's Dashboard</p>
            <h2 className="text-[#7879ED] font-bold text-3xl">Welcome,</h2>
            <h2 className="text-[#7879ED] font-bold text-3xl">{user}</h2>
          </div>
        )}
        
        <div className={`mt-10 ${!isExpanded && 'space-y-4'}`}>
          <Link href="/admin/users" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/admin/users') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <FaUser className="text-2xl" />
            {isExpanded && <p className="font-semibold">All users</p>}
          </Link>
          <Link href="/admin/tutors" className={`flex items-center gap-3 ${isExpanded ? `py-3` : `py-2`} ${isExpanded && `px-5`} rounded-lg mb-3 ${isActive('/admin/tutors') ? `bg-[#7879ED] text-white` : `hover:bg-[#242424] text-[#848484] hover:text-white`} ${!isExpanded && `justify-center`}`}>
            <FaUserTie className="text-2xl" />
            {isExpanded && <p className="font-semibold">All tutors</p>}
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
