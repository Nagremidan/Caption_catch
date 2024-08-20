'use client'

import React from 'react';
import Header from '@/components/Header';
import Analyze from '@/components/Analyze';

const AnalyzePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-28">
      
      <main className="container mx-auto px-4 py-8">
        <Analyze />
      </main>
    </div>
  );
};

export default AnalyzePage;