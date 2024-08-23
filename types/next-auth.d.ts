import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        fullName: string;
        phoneNumber: string;
        role: string;
        description?: string;
        jurusan?: string;
            appointments?: Appointment[]; // New
            assignments?: AppointmentAssignment[]; // New
        materials?: Material[]; // New
        notifications?: Notification[];
        calendar?: string; // New
    }

    interface Session extends DefaultSession {
        user: User;
    }

    interface JWT {
        id: string;
        fullName: string;
        phoneNumber: string;
        role: string;
        description?: string;
        jurusan?: string;
        appointments?: Appointment[]; // New
        assignments?: AppointmentAssignment[]; // New
        materials?: Material[]; // New
        notifications?: Notification[];
        calendar?: string // New
    }

    interface Appointment {
        id: number;
        title: string;
        description: string;
        availableDays: string[];
        timeRange: any; // Assuming JSON format
        media: string;
    }

    interface AppointmentAssignment {
        id: number;
        selectedDate: Date;
        selectedTime: Date;
        peopleCount: number;
        status: string;
        duration: Duration;
        appointment: Appointment; // Nested Appointment
        notifications?: Notification[]; // New
    }

    interface Material {
        id: number;
        title: string;
        link: string;
    }

    interface Notification {
        id: number;
        message: string;
        status: "NEW" | "READ";
        createdAt: Date;
        appointmentAssignmentId?: number;
    }
}
