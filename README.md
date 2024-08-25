# TutorDek

## Description

**TutorDek** is a comprehensive platform designed to streamline the process of connecting students with tutors. Whether you’re a student seeking help in a specific subject or a tutor looking to manage your appointments efficiently, TutorDek has got you covered. This platform offers a seamless experience for scheduling, managing, and tracking tutoring sessions.

### Key Features

- **User Dashboard**: Students can view and manage their scheduled appointments, see the details of their tutors, and track the status of their requests.
  
- **Tutor Dashboard**: Tutors have access to a personalized dashboard where they can create new appointments, manage requests from students, and update their personal information.

- **Appointment Management**: Easily schedule, update, and cancel appointments. Students can select available times and specify the duration, media (online or offline), and other preferences.

- **Notification System**: Stay updated with real-time notifications. Students receive alerts when their appointments are accepted or declined, and tutors are notified of new requests.

- **Material Sharing**: Tutors can upload and manage study materials, providing students with easy access to resources through a streamlined interface.

- **Role-Based Access**: The platform ensures that users only access features relevant to their role (Student, Tutor, Admin), enhancing security and user experience.

- **Search Functionality**: Quickly find tutors or study materials with a robust search feature that filters by name, subject, or title.

## Technologies and Frameworks

This project leverages the following technologies, languages, and frameworks:

- **Programming Language(s):** TypeScript, JavaScript
- **Framework(s):** Next.js, React
- **Database:** Prisma with NeonDB
- **Styling:** Tailwind CSS
- **Other Technologies:** NextAuth for authentication, Vercel for deployment

## Program Structure

The application's structure is organized as follows:
```sh
/project-root
├── /components       # Reusable UI components
├── /app              # Application pages (e.g., /home, /about, etc.)
│   ├── /api          # API routes for server-side logic
├── /types            # Costumizing user object
├── /lib              # Utility functions and configurations
├── /public           # Static assets like images, fonts, etc.
├── /prisma           # Prisma schema and migrations (if applicable)
└── README.md         # Project documentation
```

### Key Directories:
- **/components:** Contains all reusable React components used across the application.
- **/app:** The main routing directory for Next.js, with API routes located under `/api`.
- **/styles:** Houses global styles and any custom CSS used in the project.
- **/lib:** Contains helper functions, authentication logic, and database configurations.
- **/public:** Stores static assets that can be accessed publicly.

## Getting Started

Follow these steps to get the application up and running on your local machine:

### Prerequisites

Ensure you have the following installed:

- **Node.js**: [Link to install](https://nodejs.org/)
- **npm** or **yarn**: [Link to npm](https://www.npmjs.com/get-npm) | [Link to yarn](https://classic.yarnpkg.com/en/docs/install/)
- **Database:** PostgreSQL (optional) [Link to PostgreSQL installation guide](https://www.postgresql.org/download/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tutordek.git
   cd tutordek
   ```
   
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
   
3. **Set up environment variables:**
- Create a .env.local file in the root of your project.
- Add the necessary environment variables (e.g., database URLs, API keys, etc.)

4. **Run database migrations:**
  ```bash
   npx prisma migrate dev
   ```

### Running the Website

To start the development server, run:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
<p>The application will be available at <b>http://localhost:3000.</b></p>

### Building for Production

To build the application for production, run:

   ```bash
   npm run build
   # or
   yarn build
   ```

## Team Members

| Name                              | NIM        | Role              |
|-----------------------------------|------------|-------------------|
| Stefany Josefina Santono          | 19623155   | Product Manager   |
| Fajar Kurniawan                   | 19623181   | Software Developer|
| Muhammad Jibril Ibrahim           | 19623277   | Software Developer|
| Muhammad Rizain Firdaus           | 19623262   | Software Developer|
| Farrel Athalla Putra              | 19623056   | Software Developer|
| Adinda Putri                      | 19623137   | Data Scientist    |
| Andi Syaichul Mubaraq             | 19623084   | Data Scientist    |
| Haegen Quinston                   | 19623009   | Data Scientist    |
| Katry Kezia                       | 19623184   | Software Developer|
| Rafael Marchel Darma Wijaya       | 19623198   | Software Developer|
| Rasyid Rizky Susilo N.            | 19623081   | UI/UX Designer    |
