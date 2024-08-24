"use client";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import TutorNav from "@/components/TutorNav";

type MaterialType = {
  id: number;
  title: string;
  link: string;
};

export default function MaterialPage() {
  const {data: session} = useSession();
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState<MaterialType>({ id: 0, title: "", link: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch("/api/materials");
      const data = await response.json();
      setMaterials(data);
    };

    fetchMaterials();
  }, []);

  const handleCreateOrUpdateMaterial = async () => {
    const method = isEditing ? "PATCH" : "POST";
    const response = await fetch("/api/materials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentMaterial),
    });

    const data = await response.json();

    if (isEditing) {
      setMaterials(materials.map((material) => (material.id === data.id ? data : material)));
    } else {
      setMaterials([...materials, data]);
    }

    setCurrentMaterial({ id: 0, title: "", link: "" });
    setIsEditing(false);
  };

  const handleEditMaterial = (material: MaterialType) => {
    setCurrentMaterial(material);
    setIsEditing(true);
  };

  const handleDeleteMaterial = async (id: number) => {
    await fetch("/api/materials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setMaterials(materials.filter((material) => material.id !== id));
  };

  return (
    <section>
      <div className="w-full min-h-screen h-full bg-[#1C1C1C] overflow-x-hidden">
        <div className="ml-10">
          <TutorNav user={session?.user.fullName}/>
        </div>
        <div className="flex flex-col relative left-[20%] w-[80%] sm:w-[80%] sm:left-[20%] md:w-[65%] md:left-[35%] lg:left-[30%] lg:w-[70%] xl:left-[20%] xl:w-[80%] h-full p-11">
          <h1 className="font-bold text-3xl md:text-5xl text-[#E6BB30]">Materials</h1>
          <p className="text-white text-sm md:text-base"> Create, edit, and delete materials!</p>
          <div className="mt-5 grid-cols-3 gap-10">
            <input
              className="px-5 py-3 rounded-full focus:outline-[#7879ED] bg-[#292929] mr-3 mb-3 text-white"
              type="text"
              placeholder="Enter material title"
              value={currentMaterial.title}
              onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })}
            />
            <input
              className="px-5 py-3 rounded-full focus:outline-[#7879ED] bg-[#292929] mr-3 mb-3 text-white"
              type="text"
              placeholder="Enter material link"
              value={currentMaterial.link}
              onChange={(e) => setCurrentMaterial({ ...currentMaterial, link: e.target.value })}
            />
            <button className="px-5 py-3 rounded-full bg-[#7879ED] font-bold" onClick={handleCreateOrUpdateMaterial}>
              {isEditing ? "Update Material" : "Add Material"}
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
              {materials.slice().reverse().map((material) => (
                <div className="rounded-2xl bg-[#292929] border-[1px] border-[#7879ED] p-5 flex flex-col justify-between" key={material.id}>
                  <div> 
                    <h2 className="font-bold text-[#7879ED] text-lg md:text-2xl">{material.title}</h2>
                    <a href={material.link} target="_blank" rel="noopener noreferrer" className="text-[#616161] multiline-truncate underline">
                      {material.link}
                    </a>
                  </div>
                  <div className="flex mt-2 gap-5">
                    <button className="text-white font-bold" onClick={() => handleEditMaterial(material)}>Edit</button>
                    <button className="text-white font-bold" onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
