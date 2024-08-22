"use client "
import { useEffect, useState } from 'react';

export enum AssignmentStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

type AppointmentType = {
  id: number;
  appointment: {
    title: string;
    media: string;
    creator: {
      fullName: string;
      phoneNumber: string;
    };
  };
  selectedDate: string;
  selectedTime: string;
  peopleCount: number;
  status: AssignmentStatus;
};

const UserDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/user/appointments');
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard: Appointments</h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} className="mb-4 border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{appointment.appointment.title}</h2>
            <p>Tutor: {appointment.appointment.creator.fullName}</p>
            <p>Date: {new Date(appointment.selectedDate).toLocaleDateString()}</p>
            <p>Time: {new Date(appointment.selectedTime).toLocaleTimeString()}</p>
            <p>Media: {appointment.appointment.media}</p>
            <p>People Count: {appointment.peopleCount}</p>
            <p>Status: {appointment.status}</p>

            {appointment.status === AssignmentStatus.Accepted && (
              <a
                href={`https://wa.me/${appointment.appointment.creator.phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Contact Tutor
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
