"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";

type NotificationType = {
    id: number;
    message: string;
    status: 'NEW' | 'READ';
    createdAt: string;
  };

const ReadNotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchReadNotifications = async () => {
      const response = await fetch('/api/user/notifications/read');
      const data = await response.json();
      setNotifications(data);
    };

    fetchReadNotifications();
  }, []);

  return (
  <div>
    <Navbar/>
    <div className='my-10 mx-12 pt-12'>
      <h1 className='text-[#4A4BC5] font-bold text-xl'>Notifications</h1>
      <div className='flex items-center'>
        <div className='text-[#a1a1a1] px-3 py-2 hover:bg-[#252525] rounded-t-lg w-16 transition'><Link href='/notifications/new'>New</Link></div>
        <div className='font-semibold text-[#4A4BC5] px-3 py-2'>Read</div>
      </div>
      <div className='relative border-b-2 border-[#a1a1a1] rounded-full h-0  mb-2'>
        <div className='absolute top-0 left-0 border-t-2 border-[#4A4BC5] rounded-full h-0 w-16 ml-16'></div>
      </div>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id} className='bg-[#292929] px-6 py-2 border-[#4A4BC5] border rounded-2xl text-[#a1a1a1] font-medium my-2 break-words'>
              {notification.message}
            </li>
          ))
        ) : (
          <div className='bg-[#292929] px-6 py-2 border-[#4A4BC5] border rounded-2xl text-[#a1a1a1] font-medium my-4'>No read notifications :)</div>
        )}
      </ul>
    </div>
  </div>
  );
};

export default ReadNotificationsPage;
