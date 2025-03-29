import React, { useState, useEffect } from 'react';

const ViewWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch workers data from the API
    const fetchWorkers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch workers');
        }
        const data = await response.json();
        setWorkers(data); // Assuming the response contains the workers array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg shadow-lg bg-black bg-opacity-50">
        <iframe
          className="w-24 h-24 animate-spin"
          src="https://lottie.host/embed/88af5a74-0301-41f2-9bce-34b34a0a0800/ioelthaY7g.lottie"
          title="Loading Animation"
        ></iframe>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  // Group workers by name and accumulate roles
  const groupedWorkers = workers.reduce((acc, worker) => {
    if (acc[worker.name]) {
      acc[worker.name].push(worker.role);
    } else {
      acc[worker.name] = [worker.role];
    }
    return acc;
  }, {});

  return (
    <div className="p-2 space-y-4 bg-white shadow-md rounded-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600">List of Workers</h2>
      <div className="space-y-3">
        {Object.entries(groupedWorkers).map(([name, roles]) => {
          // If a worker appears more than once, display each role separated by commas
          const uniqueRoles = [...new Set(roles)];
          return (
            <div key={name} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100">
              <span className="font-medium text-lg text-blue-500">{name}</span>
              <span className="ml-2 text-gray-700">
                - {uniqueRoles.length > 1 ? uniqueRoles.join(', ') : uniqueRoles[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewWorkers;
