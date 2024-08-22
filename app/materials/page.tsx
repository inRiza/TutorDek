"use client"
import { useEffect, useState } from 'react';

type MaterialType = {
  id: number;
  title: string;
  link: string;
};

const UserDashboard = () => {
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch('/api/user/materials');
      const data = await response.json();
      setMaterials(data);
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard: Materials</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <ul>
        {filteredMaterials.map((material) => (
          <li key={material.id} className="mb-4 border p-4 rounded-lg">
            <a
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {material.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
