"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type TimeRange = {
  start: string;
  end: string;
};

type AppointmentType = {
  id: number;
  title: string;
  description: string;
  availableDays: { day: string; timeRange: TimeRange }[];
  media: "Online" | "Offline" | "Hybrid";
};

const AppointmentPage = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<AppointmentType>>({
    title: "",
    description: "",
    availableDays: [{ day: "", timeRange: { start: "", end: "" } }],
    media: "Online",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch("/api/appointments", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    };

    fetchAppointments();
  }, []);

  const handleAddAvailableDay = () => {
    setCurrentAppointment({
      ...currentAppointment,
      availableDays: [
        ...(currentAppointment.availableDays || []),
        { day: "", timeRange: { start: "", end: "" } },
      ],
    });
  };

  const handleRemoveAvailableDay = (index: number) => {
    const updatedAvailableDays = currentAppointment.availableDays?.filter((_, i) => i !== index);
    setCurrentAppointment({
      ...currentAppointment,
      availableDays: updatedAvailableDays,
    });
  };

  const handleCreateOrUpdate = async () => {
    const method = isEditing ? "PATCH" : "POST";
    const response = await fetch("/api/appointments", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentAppointment),
    });

    if (response.ok) {
      const data = await response.json();
      if (isEditing) {
        setAppointments((prev) =>
          prev.map((appt) => (appt.id === data.id ? data : appt))
        );
        setIsEditing(false);
      } else {
        setAppointments((prev) => [...prev, data]);
      }
      setCurrentAppointment({
        title: "",
        description: "",
        availableDays: [{ day: "", timeRange: { start: "", end: "" } }],
        media: "Online",
      });
      location.reload()
    }
  };

  const handleEdit = (appointment: AppointmentType) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete appointment:", errorData.error);
      }
    } catch (error) {
      console.error("Error occurred during deletion:", error);
    }
  };
  

  return (
    <div>
      <h1>Manage Appointments</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={currentAppointment.title}
          onChange={(e) =>
            setCurrentAppointment({ ...currentAppointment, title: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={currentAppointment.description}
          onChange={(e) =>
            setCurrentAppointment({
              ...currentAppointment,
              description: e.target.value,
            })
          }
        />
        <select
          value={currentAppointment.media}
          onChange={(e) =>
            setCurrentAppointment({
              ...currentAppointment,
              media: e.target.value as "Online" | "Offline" | "Hybrid",
            })
          }
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <div>
          {currentAppointment.availableDays?.map((dayTimeRange, index) => (
            <div key={index}>
              <select
                value={dayTimeRange.day}
                onChange={(e) => {
                  const updatedAvailableDays = [...(currentAppointment.availableDays || [])];
                  updatedAvailableDays[index].day = e.target.value;
                  setCurrentAppointment({
                    ...currentAppointment,
                    availableDays: updatedAvailableDays,
                  });
                }}
              >
                <option value="">Select Day</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
              <input
                type="time"
                value={dayTimeRange.timeRange?.start || ""}
                onChange={(e) => {
                  const updatedAvailableDays = [...(currentAppointment.availableDays || [])];
                  if (!updatedAvailableDays[index].timeRange) {
                    updatedAvailableDays[index].timeRange = { start: "", end: "" };
                  }
                  updatedAvailableDays[index].timeRange.start = e.target.value;
                  setCurrentAppointment({
                    ...currentAppointment,
                    availableDays: updatedAvailableDays,
                  });
                }}
              />
              <input
                type="time"
                value={dayTimeRange.timeRange?.end || ""}
                onChange={(e) => {
                  const updatedAvailableDays = [...(currentAppointment.availableDays || [])];
                  if (!updatedAvailableDays[index].timeRange) {
                    updatedAvailableDays[index].timeRange = { start: "", end: "" };
                  }
                  updatedAvailableDays[index].timeRange.end = e.target.value;
                  setCurrentAppointment({
                    ...currentAppointment,
                    availableDays: updatedAvailableDays,
                  });
                }}
              />
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveAvailableDay(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddAvailableDay}>
            Add Another Day
          </button>

        </div>
        <button onClick={handleCreateOrUpdate}>
          {isEditing ? "Update Appointment" : "Create Appointment"}
        </button>
      </div>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <h2>{appointment.title}</h2>
            <p>{appointment.description}</p>
            <p>Media: {appointment.media}</p>
            <p>Available Days:</p>
            <ul>
            {appointment.availableDays.map((dayTimeRange, index) => (
              <li key={index}>
                {dayTimeRange.day}: {dayTimeRange.timeRange?.start } - {dayTimeRange.timeRange?.end }
              </li>
            ))}
            </ul>
            <button onClick={() => handleEdit(appointment)}>Edit</button>
            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentPage;
