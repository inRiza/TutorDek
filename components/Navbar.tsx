import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/logo.svg"
import '../app/globals.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <Link href="/" className="flex items-center">
        <Image 
          src={Logo}
          alt="Logo"
          width={22}/>
          <span className="font-bold text-l ml-1"><span className="text-[#4A4BC5]">Tutor</span> <span className="text-[#F7C738]">Dek</span></span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link href="/tutors">Tutors</Link>
        </li>
        <li>
          <Link href="/schedule">Schedule</Link>
        </li>
        <li>
          <Link href="/notifications">Notifications</Link>
        </li>
        <li>
          <Link href="/materials">Materials</Link>
        </li>
        <li>
          <Link href="/profile">User Name</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
