"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import TransportForm from "@/components/organisms/transport/TransportForm";
import STransport from "@/components/organisms/transport/STransport";
import useAuthGuard from "@/hooks/Authogaurd";
import Loader from "@/components/ui/Loader";

export default function Page() {
  const { user, loading } = useAuthGuard();

  if (loading) return   <Loader/>;
  return (
    <div className="max-w-3xl mx-auto p-6">
  
      <Tab.Group>
        {/* Tabs Navigation */}
        <Tab.List className="flex space-x-2 border-b-2 border-gray-200">
          {["Submit Transport", "View Submissions"].map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `flex-1 py-2 text-center font-medium transition-all duration-200 ${
                  selected
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-purple-500"
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
            <TransportForm />
          </Tab.Panel>
          <Tab.Panel>
            <STransport />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
