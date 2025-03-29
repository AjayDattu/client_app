"use client"
import React, { useState } from 'react';
import AddWorkForm from '@/components/organisms/workers/AddWorker';
import ViewWorkers from '@/components/organisms/workers/Viewworker';

function Page() {
  const [activeTab, setActiveTab] = useState('addWork');

  return (
    <div className="flex flex-col justify-center items-center flex-grow mb-9 space-y-8">
      {/* Tab Buttons */}
      <div className="mb-4 flex border-b border-gray-300 w-full max-w-3xl justify-center space-x-6">
        <button
          className={`p-3 text-lg font-semibold transition-colors ${activeTab === 'addWork' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('addWork')}
        >
          Add Work
        </button>
        <button
          className={`p-3 text-lg font-semibold transition-colors ${activeTab === 'viewWorkers' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('viewWorkers')}
        >
          View Workers
        </button>
      </div>
      
      {/* Render Active Tab */}
      <div className="w-full max-w-3xl px-4">
        {activeTab === 'addWork' && <AddWorkForm />}
        {activeTab === 'viewWorkers' && <ViewWorkers />}
      </div>
    </div>
  );
}

export default Page;
