'use client';

import { useState } from 'react';
import LedgerForm from '@/components/LedgerForm';
import LedgerTable from '@/components/LedgerTable';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSave = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-500 mb-8 text-center">মেসার্স মিষ্টি এন্টারপ্রাইজ এর শুভ হালখাতা</h1>
        <LedgerForm onSave={handleSave} />
        <LedgerTable refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}


