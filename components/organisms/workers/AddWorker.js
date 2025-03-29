"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddWorkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        setUsers(data); // Set users data in state
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load user data.");
      }
    }
    fetchUsers();
  }, []);

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log("Form Data Submitted:", formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, // Change endpoint to users
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            current_month_earnings: 0, // Set default earnings
            total_earnings: 0, // Set default earnings
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit");
      }

      toast.success("New worker added successfully!");
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-screen h-[80vh] items-center">
    <Card className="p-4 shadow-lg rounded-lg h-[40vh]">
      <CardHeader>
        <CardTitle className="text-lg text-center">Add New Worker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500">Form has errors! Please check inputs.</div>
          )}

          {/* Worker Name */}
          <div>
            <Label htmlFor="name">
              Worker Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Worker name is required" })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Worker Role */}
          <div>
            <Label htmlFor="role">
              Role<span className="text-red-500">*</span>
            </Label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="w-full border rounded p-2"
            >
              <option value="">Select Role</option>
              <option value="driver">Driver</option>
              <option value="dispatcher">Dispatcher</option>
              <option value="tsr">TSR</option>
            </select>
            {errors.role && <p className="text-red-500">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black hover:bg-gray-700 text-white py-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Add Worker"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
