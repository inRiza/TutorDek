"use client"
import { useEffect, useState } from 'react';
import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

enum AssignmentStatus {
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
      return "N/A"; // Fallback if needed
  }
};

type AppointmentType = {
  id: number;
  appointment: {
    id: number;
    title: string;
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
  media: string;
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
    <section>
      <Navbar/>
      <div className='bg-[#1C1C1C] text-white min-h-screen h-full w-full flex flex-col'>
        <div className='p-20'>
          <h1 className="text-5xl font-bold my-10">Your <span className=' text-[#7879ED]'>Schedule</span></h1>
          {appointments.length > 0 ? (
            <ul>
            {appointments.slice().reverse().map((appointment) => (
              
              
              <li key={appointment.id} className="mb-5 border p-6 rounded-3xl border-[#7879ED] shadow-lg bg-[#292929] transition-all grid lg:grid-cols-[70%_30%] duration-500 z-10">
                <Link href={`appointments/${appointment.appointment.id}`}>
                  <h2 className="text-2xl font-bold text-[#7879ED] mb-2">{appointment.appointment.title}</h2>
                  <p className='text-lg font-semibold leading-none'>{appointment.appointment.creator.fullName}</p>
                  <p className='text-lg text-[#A1A1A1]'>{appointment.appointment.creator.jurusan}</p>
                  <div className='flex flex-wrap text-[#A1A1A1]'>
                    <p className='mr-8'>Day <span className='text-[#7879ED] text-lg font-bold mx-2 '>{days[new Date(appointment.selectedDate).getDay()]}</span></p>
                    <p className='mr-8'>Time <span className='text-[#7879ED] text-lg font-bold mx-2'>{new Date(appointment.selectedTime).toLocaleTimeString(["ban", "id"]).slice(0,-3)} WIB</span></p>
                    <p className='mr-8'>Duration <span className='text-[#7879ED] text-lg font-bold mx-2'>{formatDuration(appointment.duration)}</span></p>
                    <p className='mr-8'>Place <span className='text-[#7879ED] text-lg font-bold mx-2'>{appointment.media}</span></p>
                    <p className='mr-8'>Members <span className='text-[#7879ED] text-lg font-bold mx-2'>{appointment.peopleCount}</span></p>
                  </div>
                </Link>
                <div className='font-semibold flex flex-col lg:items-center items-start justify-start lg:justify-center'>
                  <p className={`text-xl md:text-center ${appointment.status == AssignmentStatus.Accepted ? 'text-[#519359]' : appointment.status == AssignmentStatus.Declined ? 'text-[#FF4646]' : 'text-[#A1A1A1]' }`}><span className='text-[#A1A1A1] text-base font-normal mr-2 md:hidden'>Status</span>{appointment.status}</p>
                  {appointment.status === AssignmentStatus.Accepted && (
                  <a
                    href={`https://wa.me/${appointment.appointment.creator.phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#7879ED] text-[#292929] px-4 py-2 rounded-full hover:bg-[#4444bb] my-4 md:mt-4 font-bold"
                  >
                    Send a message
                  </a>
                )}
                </div>
              </li>
            ))}
          </ul>
          ): (
            <div className='text-[#A1A1A1]'> There is no appointments </div>
          )}
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default UserDashboard;