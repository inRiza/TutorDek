"use client";

import { useEffect, useState } from 'react';

type TutorType = {
    id: number
    email: string
    fullName: string
}
const AdminTutorsPage = () => {
  const [tutors, setTutors] = useState<TutorType[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      const response = await fetch('/api/admin/tutors');
      const data = await response.json();
      setTutors(data);
    };

    fetchTutors();
  }, []);

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setTutors(tutors.filter(tutor => tutor.id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>All Tutors</h1>
      <ul>
        {tutors.map(tutor => (
          <li key={tutor.id}>
            {tutor.fullName} - {tutor.email}
            <button onClick={() => deleteUser(tutor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTutorsPage;
