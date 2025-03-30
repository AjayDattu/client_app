import React, { useState, useEffect } from "react";
import { Modal, Button, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";
const ViewWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch workers");
        }
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const showDeleteModal = (worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedWorker) return;
    setDeleting(selectedWorker._id);
    setIsModalOpen(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${selectedWorker._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete worker");
      }

      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker._id !== selectedWorker._id)
      );
      toast.success(`Worker ${selectedWorker.name} deleted successfully!`);
    } catch (error) {
      toast.error("Error deleting worker!");
      console.error("Error deleting worker:", error);
    } finally {
      setDeleting(null);
      setSelectedWorker(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center text-purple-600">
        List of Workers
      </h2>
      <div className="space-y-3 mt-4">
        {workers.length === 0 ? (
          <p className="text-center text-gray-600">No workers found.</p>
        ) : (
          workers.map((worker) => (
            <div
              key={worker._id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
            >
              <div>
                <span className="font-medium text-lg text-black">
                  {worker.name}
                </span>
               <span className="ml-2 text-gray-700">
  {/* Display worker's roles, joined by commas; if no roles exist, show "No roles assigned" */}
  - {worker.role?.join(", ") || "No roles assigned"}
</span>

              </div>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteModal(worker)}
                disabled={deleting === worker._id}
              >
                {deleting === worker._id ? <Spin size="small" /> : "Delete"}
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete {selectedWorker?.name}?</p>
      </Modal>
    </div>
  );
};

export default ViewWorkers;
