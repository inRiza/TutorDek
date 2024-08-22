"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserAccountButton from '@/components/UserAccountButton';

const page = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    description: session?.user.description || '',
    jurusan: session?.user.jurusan || '',
    userId: session?.user.id,
  });

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        description: session.user.description || '',
        jurusan: session.user.jurusan || '',
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
      }

      // Optionally update the UI or notify the user of the success
    } catch (error) {
      console.error('Error:', error);
      // Optionally handle the error by displaying a message to the user
    }
  };

  return (
    <div>
      <h1>Personal Information</h1>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter your description"
      />
      <input
        type="text"
        value={formData.jurusan}
        onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
        placeholder="Enter your jurusan"
      />
      <button onClick={handleUpdate}>Update Information</button>
      <UserAccountButton/>
    </div>
  );
}

export default page;