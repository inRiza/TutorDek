"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IoMdArrowDropleft } from "react-icons/io";
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

enum Media {
  Online = "Online",
  Offline = "Offline",
  Hybrid = "Hybrid",
}

enum Duration {
  ONE_HOUR = "1",
  ONE_AND_HALF = "1.5",
  TWO_HOURS = "2",
  TWO_AND_HALF = "2.5",
  THREE_HOURS = "3",
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
    calendar: string;
  };
  availableDays: { day: Weekday; timeRange: { start: string; end: string } }[];
  media: Media;
};  

const AppointmentDetailPage = () => {
  const { toast } = useToast();
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract the ID from the pathname
  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(Duration.ONE_HOUR);
  const [selectedMediaOption, setSelectedMediaOption] = useState<Media | null>(null);

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
    if (!selectedDate || !selectedTime ) {
      alert('Please select a date, time, and media option.');
      return;
    }

    const appointmentAssignment = {
      appointmentId: appointment?.id,
      selectedDate: new Date(selectedDate),
      selectedTime: new Date(`${selectedDate}T${selectedTime}:00`),
      peopleCount,
      duration: selectedDuration,
      media: selectedMediaOption || appointment?.media,
    };

    const response = await fetch('/api/appointment-assignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentAssignment),
    });

    if (response.ok) {
      toast({
        title:"Appointment added succesfully!",
        description: "Check notification for further information",
        variant:"default",
      })
      setIsModalOpen(false);
    } else {
      toast({
        title:"Failed to add appointment!",
        description: "Spmething went wrong",
        variant:"destructive",
      })
    }
  };

  if (!appointment) {
    return <div className='w-full min-h-screen h-full bg-[#1C1C1C] flex flex-col items-center justify-center text-white font-bold'>
        Loading...
      </div>;
  }

  return (
    <section className='overflow-x-hidden'>
      <div className='w-full min-h-screen h-full bg-[#1C1C1C] flex flex-col p-10 md:p-20'>
        <Link href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} className='flex gap-3 items-center'>
          <IoMdArrowDropleft className='text-[#A1A1A1] text-xl'/>
          <p className='text-[#A1A1A1] font-semibold'> Back </p>
        </Link>
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-[#7879ED] mt-5">{appointment.title}</h1>
        <p className='text-white font-semibold mt-3 text-base md:text-lg'> Description </p>
        <p className='text-[#A1A1A1] text-sm md:text-base'> {appointment.description} </p>
        {appointment.creator ? (
          <>
            <h1 className='mt-10 text-white font-bold text-xl md:text-2xl lg:text-4xl '> {appointment.creator.fullName}</h1>
            <h2 className='text-[#A1A1A1] font-semibold text-lg md:text-xl lg:text-2xl'>{appointment.creator.jurusan}</h2>
            <p className='text-[#7879ED] font-bold text-base md:text-lg xl:text-xl mt-3'> About the tutor </p>
            <p className='text-white text-xs md:text-base'>{appointment.creator.description}</p>
          </>
        ) : (
          <p>Creator information not available</p>
        )}
        <div className='bg-[#E6BB30] p-6 rounded-xl mt-5 font-bold text-lg md:text-xl lg:text-2xl'>
          <ul>
            {appointment.availableDays?.length > 0 ? (
              appointment.availableDays.map((dayTimeRange, index) => (
                <li key={index} className="mb-2">
                  {dayTimeRange.day} {dayTimeRange.timeRange.start} - {dayTimeRange.timeRange.end}
                </li>
              ))
            ) : (
              <p>No available days</p>
            )}
          </ul>
          <p className='font-semibold text-base md:text-lg lg:text-xl'>{appointment.media}</p>
          <div className='flex justify-end gap-3'>
            <button className="bg-black text-white px-5 py-3 rounded-full font-semibold mt-5 text-base md:text-lg lg:text-xl hover:bg-slate-800">
              <Link href={appointment.creator.calendar ? appointment.creator.calendar : '' } target='_blank'>
                Availability  
              </Link>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#7879ED] text-white px-5 py-3 rounded-full hover:bg-[#5658aa] font-semibold mt-5 text-base md:text-lg lg:text-xl "
            >
              Add Appointment
            </button>
            {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#292929] p-6 rounded-xl border-[1px] border-[#7879ED] shadow-lg w-80 relative">
            <span
              className="absolute top-2 right-4 text-gray-500 cursor-pointer text-4xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-4 text-[#7879ED]">Add Appointment</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-base text-white">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-[1px] p-2 rounded-lg font-semibold text-base text-white bg-[#292929] border-[#A1A1A1] focus:outline-[#7879ED] w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-base text-white">Select Time:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border-[1px] p-2 rounded-lg font-semibold text-base text-white bg-[#292929] border-[#A1A1A1] focus:outline-[#7879ED] w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-base text-white">Duration:</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value as Duration)}
                className="border-[1px] p-2 rounded-lg font-semibold text-base text-white bg-[#292929] border-[#A1A1A1] focus:outline-[#7879ED] w-full"
              >
                {Object.values(Duration).map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} hours
                  </option>
                ))}
              </select>
            </div>
            {appointment.media === Media.Hybrid && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-base text-white">Media Option:</label>
                <select
                  value={selectedMediaOption || appointment.media}
                  onChange={(e) => setSelectedMediaOption(e.target.value as Media)}
                  className="border-[1px] p-2 rounded-lg font-semibold text-base text-white bg-[#292929] border-[#A1A1A1] focus:outline-[#7879ED] w-full"
                >
                  <option value={Media.Online}>Online</option>
                  <option value={Media.Offline}>Offline</option>
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-base text-white ">People Count:</label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="border-[1px] p-2 rounded-lg font-semibold text-base text-white bg-[#292929] border-[#A1A1A1] focus:outline-[#7879ED] w-full"
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
              className="bg-[#7879ED] text-white px-5 py-3 rounded-full hover:bg-[#5657ac] w-full text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentDetailPage;
