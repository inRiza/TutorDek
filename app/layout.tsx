import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/Provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TutorDek",
  description: "TutorDek is an advanced platform designed to connect students with tutors for personalized learning sessions. With features like appointment scheduling, assignment management, and material sharing, TutorDek streamlines the educational experience for both students and tutors, ensuring seamless communication and efficient learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Provider>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
