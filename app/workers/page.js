"use client"
import React, { useState } from 'react';
import AddWorkForm from '@/components/organisms/workers/AddWorker';
import ViewWorkers from '@/components/organisms/workers/Viewworker';
import { Tab } from "@headlessui/react";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto">
      <Tab.Group>
        {/* Tabs Navigation */}
        <Tab.List className="flex space-x-2 border-b-2 border-gray-200">
          {["Add Work", "viewWorkers"].map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `flex-1 py-2 text-center font-medium transition-all duration-200 ${
                  selected
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-purple-400"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        {/* Tabs Content */}
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <AddWorkForm />
          </Tab.Panel>
          <Tab.Panel>
            <ViewWorkers />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
