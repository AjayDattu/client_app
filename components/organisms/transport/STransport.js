"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Card, Alert, Button, Spin, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
const STransport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/transports`
        );
        const data = await response.json();

        const filteredData = data?.filter(
          (record) => record?.date?.split("T")[0] === currentDate
        );

        setRecords(filteredData || []);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [currentDate]); // ✅ Added `currentDate` as a dependency

  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    setDeleting(selectedRecord._id);
    setIsModalOpen(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transports/${selectedRecord._id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== selectedRecord._id)
        );
      } else {
        console.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setDeleting(null);
      setSelectedRecord(null);
    }
  };

  // Group records by route number
  const groupedRecords = records.reduce((acc, record) => {
    acc[record.routenumber] = acc[record.routenumber] || [];
    acc[record.routenumber].push(record);
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && <Loader />}

      <Card className="p-4">
        <h2 className="text-lg text-center mb-4">Submitted Transport Records</h2>

        {records.length > 0 ? (
          <Collapse
            accordion
            className="w-full"
            items={Object.entries(groupedRecords).map(([route, routeRecords]) => ({
              key: route,
              label: `Route ${route}`,
              children: (
                <div className="space-y-4">
                  {routeRecords.map((record) => (
                    <Card key={record._id} className="p-3 shadow-md rounded-md">
                      <p><strong>TSR:</strong> {record.tsr}</p>
                      <p><strong>Driver:</strong> {record.driver}</p>
                      <p><strong>Dispatcher:</strong> {record.dispatcher}</p>
                      <p><strong>Start Reading:</strong> {record.sreading}</p>
                      <p><strong>End Reading:</strong> {record.dreading}</p>
                      <p><strong>Distance Covered:</strong> {record.distance_covered}</p>
                      <p><strong>Petrol Bill:</strong> ₹{record.petrolbill}</p>
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteModal(record)}
                        disabled={deleting === record._id}
                      >
                        {deleting === record._id ? <Spin /> : "Delete"}
                      </Button>
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

      <Modal
        title="Confirm Deletion"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
    </div>
  );
};

export default STransport;
