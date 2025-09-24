'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [dashboardUrl, setDashboardUrl] = useState('/dashboard');
  
  useEffect(() => {
    // Get the current origin (protocol + hostname + port)
    const origin = window.location.origin;
    setDashboardUrl(`${origin}/dashboard`);
  }, []);

  return (
    <nav className="ml-6 flex space-x-4">
      <Link href={dashboardUrl} className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
      <Link href="/properties" className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Properties</Link>
      <Link href="/reviews" className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Reviews</Link>
    </nav>
  );
}
