"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRedirect = () => {
    if (session?.user.role === 'Mahasiswa') {
      router.push('/');
    } else if (session?.user.role === 'Tutor') {
      router.push('/tutor/appointments');
    } else if (session?.user.role === 'Admin') {
      router.push('/admin/users');
    }
  };

  return (
    <section>
      <div className="min-h-screen h-full w-full bg-[#1C1C1C] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-8">The page you are looking for does not exist.</p>
        <button
          onClick={handleRedirect}
          className="bg-[#7879ED] px-6 py-3 rounded-full text-white font-semibold hover:bg-[#5657ac]">
          Go to Dashboard
        </button>
      </div>
    </section>
  );
}
