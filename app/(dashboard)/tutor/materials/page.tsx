"use client";
import { useState, useEffect } from "react";

type MaterialType = {
  id: number;
  title: string;
  link: string;
};

export default function MaterialPage() {
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
    <div>
      <h1>Manage Materials</h1>
      <div>
        <input
          type="text"
          placeholder="Enter material title"
          value={currentMaterial.title}
          onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter material link"
          value={currentMaterial.link}
          onChange={(e) => setCurrentMaterial({ ...currentMaterial, link: e.target.value })}
        />
        <button onClick={handleCreateOrUpdateMaterial}>
          {isEditing ? "Update Material" : "Add Material"}
        </button>
      </div>
      <ul>
        {materials.map((material) => (
          <li key={material.id}>
            <h2>{material.title}</h2>
            <a href={material.link} target="_blank" rel="noopener noreferrer">
              {material.link}
            </a>
            <button onClick={() => handleEditMaterial(material)}>Edit</button>
            <button onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
