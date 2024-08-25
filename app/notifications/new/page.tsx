"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

type NotificationType = {
    id: number;
    message: string;
    status: 'NEW' | 'READ';
    createdAt: string;
  };

const NewNotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNewNotifications = async () => {
      const response = await fetch('/api/user/notifications/new');
      const data = await response.json();
      setNotifications(data);

      // Mark notifications as read
      await fetch('/api/user/notifications/mark-read', {
        method: 'PATCH',
      });
    };

    fetchNewNotifications();
  }, []);

  return (
    <section className='overflow-x-hidden'>
      <Navbar/>
      <div className='w-full min-h-screen h-full bg-[#1C1C1C]'>
        <div className=''>
          <h1 className='text-[#7879ED] font-bold text-5xl md:text-6xl px-10 pt-20 pb-5 md:px-20'>Notifications</h1>
          <div className='flex items-center ml-[30px] md:ml-[70px]'>
            <div className='font-semibold text-[#7879ED] px-3 py-2 w-16 underline underline-offset-8 decoration-[#7879ED] decoration-3 cursor-pointer'>New</div>
            <div className='text-[#a1a1a1] px-3 py-2 hover:text-[#7879ED] underline underline-offset-8 decoration-[#A1A1A1] decoration-3 rounded-t-lg transition hover:font-semibold'><Link href='/notifications/read'>Read</Link></div>
          </div>
          <ul className='px-10 md:px-20 py-5'>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className='bg-[#292929] text-sm md:text-base mb-5 px-7 py-5 border-[#7879ED] border rounded-full text-[#a1a1a1] font-semibold my-2 break-words hover:scale-[1.05] transition-all duration-500'>
                  {notification.message}
                </li>
              ))
            ) : (
              <div className='py-10 text-[#a1a1a1] font-medium my-4 break-words'>No new notifications</div>
            )}
          </ul>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default NewNotificationsPage;
