"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <h1>New Notifications</h1>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message}
            </li>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </ul>
      <button onClick={() => router.push('/notifications/read')}>
        Go to Read Notifications
      </button>
    </div>
  );
};

export default NewNotificationsPage;
