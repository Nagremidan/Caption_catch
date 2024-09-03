'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BusOrderManager component with SSR disabled
const BusOrderManager = dynamic(
  () => import('../../components/BusOrderManager'),
  { ssr: false }
);

const BusOrderManagerPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bus Order Management</h1>
      <BusOrderManager />
    </div>
  );
};

export default BusOrderManagerPage;