"use client"
import { useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/components/Navbar";

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
    document.documentElement.classList.add('dark');
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
  <div>
      <Navbar/>
    <div className='my-10 mx-12 pt-12'>
      <h1 className='text-[#4A4BC5] font-bold text-xl'>Notifications</h1>
      <div className='flex items-center'>
        <div className='font-semibold text-[#4A4BC5] px-3 py-2 w-16'>New</div>
        <div className='text-[#a1a1a1] px-3 py-2 hover:bg-[#252525] rounded-t-lg transition'><Link href='/notifications/read'>Read</Link></div>
      </div>
      <div className='relative border-b-2 border-[#a1a1a1] rounded-full h-0  mb-2'>
        <div className='absolute top-0 left-0 border-t-2 border-[#4A4BC5] rounded-full h-0 w-16'></div>
      </div>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id} className='bg-[#292929] px-6 py-2 border-[#4A4BC5] border rounded-2xl text-[#a1a1a1] font-medium my-2 break-words'>
              {notification.message}
            </li>
          ))
        ) : (
          <div className='bg-[#292929] px-6 py-2 border-[#4A4BC5] border rounded-2xl text-[#a1a1a1] font-medium my-4 break-words'>No new notifications ^_^</div>
        )}
      </ul>
    </div>
  </div>
  );
};

export default NewNotificationsPage;
