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
  const [roles, setRoles] = useState([]);
  const [roleInput, setRoleInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const availableRoles = ["driver", "dispatcher", "tsr"];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load user data.");
      }
    }
    fetchUsers();
  }, []);

  const handleRoleSelect = (role) => {
    if (!roles.includes(role)) {
      setRoles([...roles, role]);
    }
    setRoleInput("");
    setShowDropdown(false);
  };

  const handleRoleInputChange = (e) => {
    setRoleInput(e.target.value);
    setShowDropdown(true);
  };

  const handleRoleKeyDown = (e) => {
    if (e.key === "Enter" && roleInput.trim() !== "") {
      e.preventDefault();
      handleRoleSelect(roleInput.trim());
    }
  };

  const removeRole = (roleToRemove) => {
    setRoles(roles.filter((role) => role !== roleToRemove));
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            roles: roles, // Send roles as an array
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit");
      }

      toast.success("New worker added successfully!");
      reset();
      setRoles([]);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-[80vh] align-middle items-center justify-center">
      <Card className="p-4 shadow-lg rounded-lg h-auto w-96">
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

            {/* Worker Role (Dropdown + Multi-select Tags) */}
            <div className="relative">
              <Label htmlFor="roles">
                Roles<span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 border p-2 rounded-lg">
                {roles.map((role, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {role}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => removeRole(role)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={roleInput}
                  onChange={handleRoleInputChange}
                  onKeyDown={handleRoleKeyDown}
                  className="border-none outline-none flex-grow"
                  placeholder="Type or select a role"
                />
              </div>

              {/* Dropdown for Role Selection */}
              {showDropdown && roleInput.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                  {availableRoles
                    .filter((role) => role.toLowerCase().includes(roleInput.toLowerCase()))
                    .map((role) => (
                      <li
                        key={role}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role}
                      </li>
                    ))}
                </ul>
              )}
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
