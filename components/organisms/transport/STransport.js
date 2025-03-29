"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Card, Alert } from "antd";
const STransport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/transports`
        );
        const data = await response.json();
        const filteredData = data.filter(
          (record) => record.date.split("T")[0] === currentDate
        );
        setRecords(filteredData);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Group records by route number
  const groupedRecords = records.reduce((acc, record) => {
    acc[record.routenumber] = acc[record.routenumber] || [];
    acc[record.routenumber].push(record);
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-lg shadow-lg">
            <iframe
                className="w-50 h-50"
                src="https://lottie.host/embed/88af5a74-0301-41f2-9bce-34b34a0a0800/ioelthaY7g.lottie"
            ></iframe>
        </div>

      )}

      <Card className="p-4">
        <h2 className="text-lg text-center mb-4">
          Submitted Transport Records
        </h2>

        {records.length > 0 ? (
          <Collapse
            accordion
            className="w-full"
            items={Object.entries(groupedRecords).map(([route, records]) => ({
              key: route,
              label: `Route ${route}`,
              children: (
                <div className="space-y-4">
                  {records.map((record) => (
                    <Card key={record._id} className="p-3 shadow-md rounded-md">
                      <p>
                        <strong>TSR:</strong> {record.tsr}
                      </p>
                      <p>
                        <strong>Driver:</strong> {record.driver}
                      </p>
                      <p>
                        <strong>Dispatcher:</strong> {record.dispatcher}
                      </p>
                      <p>
                        <strong>Start Reading:</strong> {record.sreading}
                      </p>
                      <p>
                        <strong>End Reading:</strong> {record.dreading}
                      </p>
                      <p>
                        <strong>Distance Covered:</strong>{" "}
                        {record.distance_covered}
                      </p>
                      <p>
                        <strong>Petrol Bill:</strong> ₹{record.petrolbill}
                      </p>
                    </Card>
                  ))}
                </div>
              ),
            }))}
          />
        ) : (
          <Alert message="No records found for today." type="warning" showIcon />
        )}
      </Card>
    </div>
  );
};

export default STransport;
