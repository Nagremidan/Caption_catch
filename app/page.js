'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}