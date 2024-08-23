"use client"
import { useEffect, useState } from 'react';

export enum AssignmentStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

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
};

const TutorDashboard = () => {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tutor Dashboard: Assignments</h1>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id} className="mb-4 border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{assignment.appointment.title}</h2>
            <p>User: {assignment.user.fullName} ({assignment.user.email})</p>
            <p>Date: {new Date(assignment.selectedDate).toLocaleDateString()}</p>
            <p>Time: {new Date(assignment.selectedTime).toLocaleTimeString()}</p>
            <p>People Count: {assignment.peopleCount}</p>
            <p>Status: {assignment.status}</p>

            {assignment.status === AssignmentStatus.Pending && (
              <div className="mt-4">
                <button
                  onClick={() => updateAssignmentStatus(assignment.id, AssignmentStatus.Accepted)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateAssignmentStatus(assignment.id, AssignmentStatus.Declined)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            )}

            {assignment.status !== AssignmentStatus.Pending && (
              <div className="mt-4">
                <span className="px-4 py-2 rounded bg-gray-200">{assignment.status}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorDashboard;
