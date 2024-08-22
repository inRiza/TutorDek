"use client"
import { useEffect, useState } from 'react';
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
      <h1>Read Notifications</h1>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message}
            </li>
          ))
        ) : (
          <p>No read notifications</p>
        )}
      </ul>
    </div>
  );
};

export default ReadNotificationsPage;
