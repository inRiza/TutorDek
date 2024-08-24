"use client";

import { useEffect, useState } from 'react';
import AdminNav from "@/components/AdminNav";
import { useSession } from "next-auth/react";

type UserType = {
    id: number
    fullName: string
    email: string
}

const AdminUsersPage = () => {
  const {data: session} = useSession();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section>
      <div className="w-full min-h-screen h-full bg-[#1C1C1C] overflow-x-hidden">
        <div className="ml-10">
          <AdminNav user={session?.user.fullName}/>
        </div>
            <div className="flex flex-col relative left-[20%] w-[80%] sm:w-[80%] sm:left-[20%] md:w-[65%] md:left-[35%] lg:left-[30%] lg:w-[70%] xl:left-[20%] xl:w-[80%] p-11">
                <h1 className="font-bold text-3xl md:text-5xl"> <span className="text-[#E6BB30]"> All </span> <span className="text-[#7879ED]"> Mahasiswa </span></h1>
                <p className="text-white text-sm md:text-base"> Manage the users of this website! </p>
                <ul className='mt-5'>
                    {users.map(user => (
                    <li className="bg-[#292929] border-[1px] border-[#7879ED] rounded-lg p-5 flex justify-between text-white font-semibold mt-3 text-sm md:text-base" key={user.id}>
                        {user.fullName} - {user.email}
                        <button className="text-red-400"onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
  );
};

export default AdminUsersPage;
