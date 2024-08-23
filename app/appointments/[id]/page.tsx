"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import arrowIcon from '@/public/arrow-left.svg';


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
  const router = useRouter();
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
    <div className="p-8 bg-[#1C1C1C] text-white">
      <button onClick={()=>{router.back()}} className="mb-6"> <Image src={arrowIcon} alt='arrow-icon' color='#A1A1A1' width={12} height={12} className='inline-block translate-y-[-10%]'/> Back</button>
      <h1 className="text-5xl font-bold mb-4 text-[#7879ED]">{appointment.title}</h1>
      {appointment.creator ? (
        <>
          <p className='text-2xl font-bold leading-none'>{appointment.creator.fullName}</p>
          <p className='text-xl font-semibold text-[#A1A1A1] mb-6'>{appointment.creator.jurusan}</p>
        </>
      ) : (
        <p>Creator information not available</p>
      )}
      <p className="mb-4">{appointment.description}</p>
      <div className='rounded-xl bg-[#E6BB30] p-4 relative text-[#1C1C1C]'>
        <h4 className="font-bold text-2xl">Available Days</h4>
        <ul className="font-bold text-xl mb-2">
          {appointment.availableDays?.length > 0 ? (
            appointment.availableDays.map((dayTimeRange, index) => (
              <li key={index} className="mb-2">
                {dayTimeRange.day} : {dayTimeRange.timeRange.start} - {dayTimeRange.timeRange.end} WIB
              </li>
            ))
          ) : (
            <p>No available days</p>
          )}
        </ul>
        <p className="font-semibold text-lg mb-4">{appointment.media}</p>

        <button
          onClick={() => setIsModalOpen(true)}
          className=
          "bg-[#7879ED] text-white px-4 py-2 rounded-xl hover:bg-[#4141b5] md:absolute bottom-4 right-4 font-semibold"
        >
          Make appointment
        </button>
      </div>
      

      {/* Modal for adding an appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1C1C1C] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <span
              className="absolute top-2 right-2 text-gray-500 text-3xl cursor-pointer"
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
              className="bg-[#7879ED] text-white px-4 py-2 rounded hover:bg-[#4141b5] w-full"
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
