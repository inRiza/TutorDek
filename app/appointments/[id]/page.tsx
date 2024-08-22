"use client"
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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

const AppointmentDetailPage = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract the ID from the pathname
  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<number>(1);

  useEffect(() => {
    if (id) {
      const fetchAppointment = async () => {
        const response = await fetch(`/api/appointments/${id}`);
        const data = await response.json();
        setAppointment(data);
      };

      fetchAppointment();
    }
  }, [id]);

  const handleAddAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }

    const appointmentAssignment = {
      appointmentId: appointment?.id,
      selectedDate: new Date(selectedDate),
      selectedTime: new Date(`${selectedDate}T${selectedTime}:00`),
      peopleCount,
    };

    const response = await fetch('/api/appointment-assignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentAssignment),
    });

    if (response.ok) {
      alert('Appointment added successfully!');
      setIsModalOpen(false);
    } else {
      alert('Failed to add appointment.');
    }
  };

  if (!appointment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{appointment.title}</h1>
      <p className="mb-4">{appointment.description}</p>
      <h4 className="font-semibold mb-2">Creator Information:</h4>
      {appointment.creator ? (
        <>
          <p>Name: {appointment.creator.fullName}</p>
          <p>Jurusan: {appointment.creator.jurusan}</p>
          <p>Description: {appointment.creator.description}</p>
        </>
      ) : (
        <p>Creator information not available</p>
      )}
      <h4 className="font-semibold mt-4 mb-2">Available Days and Times:</h4>
      <ul className="mb-4">
        {appointment.availableDays?.length > 0 ? (
          appointment.availableDays.map((dayTimeRange, index) => (
            <li key={index} className="mb-2">
              {dayTimeRange.day}: {dayTimeRange.timeRange.start} - {dayTimeRange.timeRange.end}
            </li>
          ))
        ) : (
          <p>No available days</p>
        )}
      </ul>
      <p className="mb-4">Media: {appointment.media}</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Appointment
      </button>

      {/* Modal for adding an appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <span
              className="absolute top-2 right-2 text-gray-500 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Select Time:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">People Count:</label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="border p-2 rounded w-full"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddAppointment}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailPage;
