"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import TutorNav from "@/components/TutorNav";
import { useToast } from '@/components/ui/use-toast';

const page = () => {
  const {toast} = useToast()
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    fullName: session?.user.fullName || '',
    description: session?.user.description || '',
    jurusan: session?.user.jurusan || '',
    phoneNumber: session?.user.phoneNumber || '',
    calendar: session?.user.calendar || '',
    userId: session?.user.id,
  });

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: session.user.fullName || '',
        description: session.user.description || '',
        jurusan: session.user.jurusan || '',
        phoneNumber: session.user.phoneNumber || '',
        calendar: session?.user.calendar || '',
        userId: session.user.id,
      }));
    }
  }, [session]);

  const handleUpdate = async () => {
    console.log('Form Data Before Sending:', formData);

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user information!!');
      } else {
        toast({
          title:"Success!",
          description: "Your information has been updated!",
          variant:"default",
        })
      }
    } catch (error) {
      console.error('Error:', error);
      // Optionally handle the error by displaying a message to the user
    }
  };

  return (
    <section>
      <div className="w-full min-h-screen h-full bg-[#1C1C1C] overflow-x-hidden">
        <div className="ml-10">
          <TutorNav user={session?.user.fullName}/>
        </div>
        <div className="flex flex-col relative left-[20%] w-[80%] sm:w-[80%] sm:left-[20%] md:w-[65%] md:left-[35%] lg:left-[30%] lg:w-[70%] xl:left-[20%] xl:w-[80%] h-full p-11">
          <h1 className="font-bold text-3xl md:text-5xl"> <span className="text-[#E6BB30]"> Your </span> <span className="text-[#7879ED]"> Profile </span></h1>
          <p className="text-white text-sm md:text-base"> Fill out your profile!</p>
          <h3 className='text-white font-bold text-xl mt-5'> Full Name</h3>
          <input
            className='mt-2 rounded-xl py-3 px-5 focus:outline-[#7879ED] bg-[#292929] text-white'
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Enter your name"
          />
          <h3 className='text-white font-bold text-xl mt-5'> Description</h3>
          <textarea
            className='mt-2 rounded-xl py-3 px-5 focus:outline-[#7879ED] bg-[#292929] text-white'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter your description"
          />
          <h3 className='text-white font-bold text-xl mt-5'> Jurusan</h3>
          <input
            className='mt-2 rounded-xl py-3 px-5 focus:outline-[#7879ED] bg-[#292929] text-white'
            type="text"
            value={formData.jurusan}
            onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
            placeholder="Enter your jurusan"
          />
          <h3 className='text-white font-bold text-xl mt-5'> Phone Number <span className='text-[#7879ED]'> {`(628**********)`}</span></h3>
          <input
            className='mt-2 rounded-xl py-3 px-5 focus:outline-[#7879ED] bg-[#292929] text-white'
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="628**********"
          />
          <h3 className='text-white font-bold text-xl mt-5'> Google Calendar Link <span className='text-[#7879ED] text-xs'> {`(https://calendar.google.com/xxxx)`}</span></h3>
          <input
            className='mt-2 rounded-xl py-3 px-5 focus:outline-[#7879ED] bg-[#292929] text-white'
            type="text"
            value={formData.calendar}
            onChange={(e) => setFormData({ ...formData, calendar: e.target.value })}
            placeholder="Enter your google calendar link"
          />
          <button className="bg-[#7879ED] mt-5 rounded-full font-bold py-4 px-5" onClick={handleUpdate}>Update Information</button>
        </div>
      </div>
    </section>
  );
}

export default page;