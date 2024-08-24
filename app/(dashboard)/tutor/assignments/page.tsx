"use client"
import { useEffect, useState } from 'react';
import TutorNav from "@/components/TutorNav";
import { useSession } from "next-auth/react";

export enum AssignmentStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

export enum Duration {
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

type AssignmentType = {
  id: number;
  user: {
    fullName: string;
    email: string;
  };
  appointment: {
    title: string;
  };
  selectedDate: string;
  selectedTime: string;
  peopleCount: number;
  status: AssignmentStatus;
  duration: Duration;
};

const TutorDashboard = () => {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const response = await fetch('/api/tutor/assignments');
      const data = await response.json();
      setAssignments(data);
    };

    fetchAssignments();
  }, []);

  const updateAssignmentStatus = async (id: number, status: AssignmentStatus) => {
    const response = await fetch(`/api/tutor/assignments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === id ? { ...assignment, status } : assignment
        )
      );
    } else {
      alert('Failed to update assignment status.');
    }
  };

  return (
    <section>
      <div className="w-full min-h-screen h-full bg-[#1C1C1C] overflow-x-hidden">
        <div className="ml-10">
          <TutorNav user={session?.user.fullName}/>
        </div>
        <div className="flex flex-col relative left-[20%] w-[80%] sm:w-[80%] sm:left-[20%] md:w-[65%] md:left-[35%] lg:left-[30%] lg:w-[70%] xl:left-[20%] xl:w-[80%] h-full p-11">
          <h1 className="font-bold text-3xl md:text-5xl"> <span className="text-[#E6BB30]"> Schedule </span> <span className="text-[#7879ED]"> Assignments </span></h1>
          <p className="text-white text-sm md:text-base"> Here are appointment requests from users. Accept or Decline the appointments!  </p>
          <ul className='mt-5'>
            {assignments.slice().reverse().map((assignment) => (
              <li key={assignment.id} className="bg-[#292929] border-[1px] border-[#7879ED] p-5 mb-4 rounded-xl">
                <h2 className="font-bold text-[#7879ED] text-lg md:text-2xl">{assignment.appointment.title}</h2>
                <p className='text-white font-semibold text-xs md:text-base'>User : {assignment.user.fullName} ({assignment.user.email})</p>
                <div className='font-bold rounded-lg mt-3 flex gap-5 w-auto text-white text-xs md:text-base'>
                  <p>Date: {new Date(assignment.selectedDate).toLocaleDateString()}</p>
                  <p>Time: {new Date(assignment.selectedTime).toLocaleTimeString()}</p>
                  <p>People Count: {assignment.peopleCount}</p>
                  <p>Status: {assignment.status}</p>
                </div>
                <p className='font-bold text-white text-xs md:text-base mt-3'>
                  Duration: {formatDuration(assignment.duration)}
                </p>

                {assignment.status === AssignmentStatus.Pending && (
                  <div className="mt-4">
                    <button
                      onClick={() => updateAssignmentStatus(assignment.id, AssignmentStatus.Accepted)}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 mr-2 text-sm md:text-base font-bold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateAssignmentStatus(assignment.id, AssignmentStatus.Declined)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 text-sm md:text-base font-bold"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {assignment.status !== AssignmentStatus.Pending && (
                  <div className="mt-4">
                    <span className="px-4 py-2 rounded-full bg-[#1C1C1C] text-[#848484] text-sm md:text-base font-bold">{assignment.status}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TutorDashboard;
