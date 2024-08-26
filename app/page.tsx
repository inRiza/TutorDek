"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import Circle from "@/public/circle.svg";
import Circle2 from "@/public/circle2.svg";
import Person from "@/public/person.svg"
import Logo from "@/public/logo.svg"
import {IoMdSearch} from "react-icons/io"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
      console.log(appointments)
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
    <main className="overflow-x-hidden">
      <div className="w-full h-full bg-[#1C1C1C] flex flex-col">
      <Navbar/>
        <div className="bg-[#F4F1E9] min-h-screen h-full relative flex w-full py-14">
            <Image 
                src={Circle}
                alt="bg"
                className="absolute right-44 top-0"
              />
              <Image 
                src={Circle2}
                alt="bg"
                className="absolute left-0 -top-10"
              />
              <div className="z-20">
                <div className="grid lg:grid-cols-2 py-12 px-20">
                  <Image 
                      src={Person}
                      alt="person"
                      className="w-[1000px] lg:order-2 order-1"
                    />
                  <div className="flex flex-col lg:items-start items-center mt-5 lg:mt-0 justify-center lg:order-1 order-2">
                    <div className="flex gap-5 items-center">
                      <Image 
                        src={Logo}
                        alt="logo"
                        className="w-12"
                      />
                      <h1 className="font-bold text-4xl text-[#7879ED]"> Tutor <span className="text-[#E6BB30]"> Dek </span></h1>
                    </div>
                    <h1 className="text-6xl text-center lg:pb-0 lg:text-left lg:text-7xl xl:text-8xl font-bold mt-3"> Empower your academic journey. </h1>
                    <p className="mt-10 text-center lg:text-left"> Connect with expert tutors, schedule sessions, and access study materials </p>
                  </div>
                </div>
              </div>
        </div>
        <div className="flex flex-col p-10 md:py-11 md:px-20">
          <div className="relative w-[80%] md:w-[70%] lg:w-[50%] mt-10 mb-4 mx-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 md:py-4 pl-6 pr-12 bg-[#292929] border-[1px] border-[#A1A1A1] rounded-full w-full font-semibold text-[#A1A1A1] focus:outline-[#7879ED]"
            />
            <IoMdSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#A1A1A1]" />
          </div>
          <h3 className="text-white font-bold text-lg md:text-2xl items-start mt-5 mb-5"> Available Tutor </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAppointments.map((appointment) => (
            <div className="border-[1px] border-[#7879ED] p-5 rounded-xl bg-[#292929] text-white flex flex-col justify-between hover:scale-[1.05] duration-500 transition-all" key={appointment.id}>
              <Link href={`/appointments/${appointment.id}`}>
                <h3 className="text-2xl font-bold text-[#7879ED]">{appointment.title}</h3>
                {/* <p className="text-[#A1A1A1] multiline-truncate">{appointment.description}</p> */}
                {appointment.creator ? (
                  <>
                    <p className="mt-5 text-white font-bold text-xl">{appointment.creator.fullName}</p>
                    <p className="text-[#A1A1A1]">{appointment.creator.jurusan}</p>
                    {/* <p>Description: {appointment.creator.description}</p> */}
                  </>
                ) : (
                  <p>Creator information not available</p>
                )}
                <div className="mt-5 bg-[#E6BB30] rounded-lg p-5 text-black">
                  {appointment.availableDays.map((dayTimeRange, index) => (
                    <div className="font-bold text-lg" key={index}>
                      {dayTimeRange.day}: {dayTimeRange.timeRange.start} - {dayTimeRange.timeRange.end}
                    </div>
                  ))}
                <p className="font-semibold">{appointment.media}</p>
              </div>
              </Link>
              <p className="text-right mt-3 text-white text-sm"> See more</p>
            </div>
          ))}
        </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
};

export default Page;
