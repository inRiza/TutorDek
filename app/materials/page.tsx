"use client"
import { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <section>
      <Navbar/>
      <div className='px-10 py-20 flex flex-col items-center min-h-screen h-full bg-[#1C1C1C]'>
        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-[#7879ED]">Materials</h1>
        <p className='text-[#7879ED] text-lg'> by <span className='text-[#E6BB30]'> Tutors </span></p>

        {/* Search Bar */}
        
        <div className="relative w-[80%] md:w-[70%] lg:w-[50%] mt-10 mb-4">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="py-3 md:py-4 pl-6 pr-12 bg-[#292929] border-[1px] border-[#A1A1A1] rounded-full w-full font-semibold text-[#A1A1A1] focus:outline-[#7879ED]"
      />
      <IoMdSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#A1A1A1]" />
    </div>

          <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-5 items-stretch'>
            {filteredMaterials.map((material) => (
              <div key={material.id} className="mb-4 border-[1px] border-[#7879ED] p-4 md:p-7 rounded-2xl font-bold text-white text-xl md:text-2xl flex flex-col justify-between hover:scale-[1.05] transition-all duration-500 bg-[#292929]">
                <a
                  href={material.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='flex justify-between flex-col flex-grow'
                >
                  <div className='multiline-truncate text-ellipsis overflow-hidden'>
                    {material.title}
                  </div>
                  <p className='mt-10 font-semibold text-center text-base md:text-xl self-center text-black bg-[#E6BB30] rounded-full py-2 px-5 w-full hover:bg-[#9d801f]'> Open drive </p>
                </a>
              </div>
            ))}
          </div>
      </div>
      <Footer/>
    </section>
  );
};

export default UserDashboard;
