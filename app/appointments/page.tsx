"use client"
import { useEffect, useState } from 'react';

export enum AssignmentStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

enum Duration {
  ONE_HOUR = "1",
  ONE_AND_HALF = "1.5",
  TWO_HOURS = "2",
  TWO_AND_HALF = "2.5",
  THREE_HOURS = "3",
} 

const formatDuration = (duration: string): string => {
  console.log("Raw duration value:", duration);
  switch (duration) {
    case "ONE_HOUR":
      return "1 Hour";
    case "ONE_AND_HALF":
      return "1.5 Hours";
    case "TWO_HOURS":
      return "2 Hours";
    case "TWO_AND_HALF":
      return "2.5 Hours";
    case "THREE_HOURS":
      return "3 Hours";
    default:
      return `${duration} Hours`; // Fallback if needed
  }
};

type AppointmentType = {
  id: number;
  appointment: {
    title: string;
    media: string;
    creator: {
      fullName: string;
      phoneNumber: string;
      jurusan: string;
    };
  };
  selectedDate: string;
  selectedTime: string;
  peopleCount: number;
  status: AssignmentStatus;
  duration: Duration;
};

const UserDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/user/appointments');
      const data = await response.json();
      console.log("Appointments data:", data);
      setAppointments(data);
    }; 

    fetchAppointments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold my-10">Your <span className=' text-[#4A4BC5]'>Schedule</span></h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} className="mb-4 border p-6 rounded-3xl border-[#4A4BC5] shadow-lg relative">
            <h2 className="text-2xl font-bold text-[#4A4BC5] mb-2">{appointment.appointment.title}</h2>
            <p className='text-lg font-semibold leading-none'>{appointment.appointment.creator.fullName}</p>
            <p className='text-lg text-[#737373]'>{appointment.appointment.creator.jurusan}</p>
            <div className='flex flex-wrap text-[#737373]'>
              <p className='mr-8'>Day <span className='text-[#4A4BC5] text-lg font-bold mx-2 '>{days[new Date(appointment.selectedDate).getDay()]}</span></p>
              <p className='mr-8'>Time <span className='text-[#4A4BC5] text-lg font-bold mx-2'>{new Date(appointment.selectedTime).toLocaleTimeString(["ban", "id"]).slice(0,-3)} WIB</span></p>
              <p className='mr-8'>Duration <span className='text-[#4A4BC5] text-lg font-bold mx-2'>{appointment.duration}</span></p>
              <p className='mr-8'>Place <span className='text-[#4A4BC5] text-lg font-bold mx-2'>{appointment.appointment.media}</span></p>
            </div>
            <div className='md:absolute md:top-[50%] md:right-[10%] md:translate-x-[50%] md:translate-y-[-50%] font-semibold'>
              <p className={`text-xl md:text-right ${appointment.status == AssignmentStatus.Accepted ? 'text-[#519359]' : appointment.status == AssignmentStatus.Declined ? 'text-[#FF4646]' : 'text-[#737373]' }`}><span className='text-[#737373] text-base font-normal mr-2 md:hidden'>Status</span>{appointment.status}</p>
              {appointment.status === AssignmentStatus.Accepted && (
              <a
                href={`https://wa.me/${appointment.appointment.creator.phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#4A4BC5] text-white px-4 py-2 rounded-full hover:bg-[#4444bb] my-4 md:my-0 "
              >
                Send a message
              </a>
            )}
            </div>
            

            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
