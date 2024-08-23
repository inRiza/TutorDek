"use client";
import { useSession } from "next-auth/react";
import UserAccountButton from '@/components/UserAccountButton';
import User from '@/components/User';
import { useEffect, useState } from 'react';
import Link from "next/link";

export enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export enum Media {
  Online = "Online",
  Offline = "Offline",
  Hybrid = "Hybrid",
}

type TimeRange = {
  [key in Weekday]: {
    start: string;
    end: string;
  };
};

type AppointmentType = {
  id: number;
  title: string;
  description: string;
  creator: {
    id: number;
    fullName: string;
    jurusan: string;
    description: string;
  };
  availableDays: { day: Weekday; timeRange: { start: string; end: string } }[];
  media: Media;
};

type NotificationType = {
  id: number;
  message: string;
  status: 'NEW' | 'READ';
  createdAt: string;
};

const Page = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch("/api/appointments/user");
      const data = await response.json();
      setAppointments(data);
    };

    const fetchNotifications = async () => {
      if (session?.user) {
        const response = await fetch('/api/user/notifications');
        const notifications: NotificationType[] = await response.json();

        // Check if there are any new notifications
        const newNotifications = notifications.some(notification => notification.status === 'NEW');
        setHasNewNotifications(newNotifications);
      }
    };

    fetchAppointments();
    fetchNotifications();
  }, [session?.user]);

  const filteredAppointments = appointments.filter((appointment) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      appointment.title.toLowerCase().includes(lowercasedSearchTerm) ||
      appointment.creator.fullName.toLowerCase().includes(lowercasedSearchTerm)
    );
  });

  return (
    <main>
      <h2>
        {session?.user.fullName} {session?.user.phoneNumber} {session?.user.role}
      </h2>
      {session?.user && <UserAccountButton />}
      <User />

      <Link href="/appointments">appointments</Link>
      <Link href="/materials">materials</Link>

      {/* Notification Button */}
      <Link href="/notifications/new">
        <button
          className={`p-2 rounded ${hasNewNotifications ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
        >
          Notification
        </button>
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or creator name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul>
        {filteredAppointments.map((appointment) => (
          <li key={appointment.id}>
            <Link href={`/appointments/${appointment.id}`}>
              <h3>{appointment.title}</h3>
              <p>{appointment.description}</p>
              <h4>Creator Information:</h4>
              {appointment.creator ? (
                <>
                  <p>Name: {appointment.creator.fullName}</p>
                  <p>Jurusan: {appointment.creator.jurusan}</p>
                  <p>Description: {appointment.creator.description}</p>
                </>
              ) : (
                <p>Creator information not available</p>
              )}
              <h4>Available Days and Times:</h4>
              <ul>
                {appointment.availableDays.map((dayTimeRange, index) => (
                  <li key={index}>
                    {dayTimeRange.day}: {dayTimeRange.timeRange.start} - {dayTimeRange.timeRange.end}
                  </li>
                ))}
              </ul>
              <p>Media: {appointment.media}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
