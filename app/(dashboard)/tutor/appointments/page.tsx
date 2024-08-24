"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TutorNav from "@/components/TutorNav";

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
    <section>
      <div className="w-full min-h-screen h-full bg-[#1C1C1C] overflow-x-hidden">
        <div className="ml-10">
          <TutorNav user={session?.user.fullName}/>
        </div>
         <div className="flex flex-col relative left-[20%] w-[80%] sm:w-[80%] sm:left-[20%] md:w-[65%] md:left-[35%] lg:left-[30%] lg:w-[70%] xl:left-[20%] xl:w-[80%] p-11">
            <h1 className="font-bold text-3xl md:text-5xl"> <span className="text-[#E6BB30]"> Manage </span> <span className="text-[#7879ED]"> Appointments</span></h1>
            <p className="text-white text-sm md:text-base"> Create, edit, and delete your appointments </p>
            <h3 className="mt-10 text-white font-bold text-2xl"> {isEditing ? "Edit Appointment": "Create Appointment"}</h3>
            <div className="flex gap-5 mt-3 flex-col">
              <input
                className="p-3 rounded-lg focus:outline-[#7879ED] bg-[#292929] text-white"
                type="text"
                placeholder="Title"
                value={currentAppointment.title}
                onChange={(e) =>
                  setCurrentAppointment({ ...currentAppointment, title: e.target.value })
                }
              />
              <textarea
                className="p-3 rounded-lg focus:outline-[#7879ED] bg-[#292929] text-white"
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
                className="w-[50%] rounded-lg focus:outline-[#7879ED] bg-[#292929] text-white p-3"
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
                  <div key={index} className="flex gap-3 text-sm md:text-base">
                    <select
                      className="focus:outline-[#7879ED] bg-[#292929] text-white p-3 rounded-lg mt-2"
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
                      className="p-3 focus:outline-[#7879ED] bg-[#292929] text-white rounded-lg mt-2"
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
                      className="p-3 focus:outline-[#7879ED] bg-[#292929] text-white rounded-lg mt-2 "
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
                      <button className="text-white bg-red-700 rounded-full font-semibold px-5 text-sm mt-3 " type="button" onClick={() => handleRemoveAvailableDay(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button className="mt-3 bg-[#E6BB30] py-2 px-5 rounded-full font-bold" type="button" onClick={handleAddAvailableDay}>
                  Add Another Day
                </button>

              </div>
              <button onClick={handleCreateOrUpdate} className="py-4 px-5 rounded-full bg-[#7879ED] w-auto font-bold">
                {isEditing ? "Update Appointment" : "Create Appointment"}
              </button>
            </div>
              <h3 className="mt-14 text-white font-bold text-2xl"> Appointment List</h3>
                <div className="mt-3 grid lg:grid-cols-4 md:grid-cols-2 gap-3">
                  {appointments.slice().reverse().map((appointment) => (
                    <div key={appointment.id} className="bg-[#292929] border-[1px] border-[#7879ED] p-5 rounded-2xl w-auto flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-[#7879ED] text-lg md:*:text-2xl">{appointment.title}</h2>
                        <p className="text-ellipsis overflow-hidden text-[#8f8f8f] multiline-truncate">{appointment.description}</p>
                        <div className="bg-[#E6BB30] font-semibold p-2 rounded-lg mt-3">
                        <p className="text-sm">Available Days</p>
                        <ul>
                        {appointment.availableDays.map((dayTimeRange, index) => (
                          <li key={index} className="text-sm font-bold">
                            {dayTimeRange.day} : {dayTimeRange.timeRange?.start } - {dayTimeRange.timeRange?.end }
                          </li>
                        ))}
                        </ul>
                        <p className="mt-2 font-bold text-sm">{appointment.media}</p>
                      </div>
                      </div>
                      <div className="flex gap-3 text-white font-semibold mt-5">
                        <button onClick={() => handleEdit(appointment)}>Edit</button>
                        <button onClick={() => handleDelete(appointment.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    </section>
  );
};

export default AppointmentPage;
