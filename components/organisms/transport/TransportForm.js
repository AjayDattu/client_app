"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TransportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const sreading = watch("sreading");
  const dreading = watch("dreading");
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
  useEffect(() => {
    if (sreading && dreading && dreading > sreading) {
      setValue("distance_covered", dreading - sreading);
    }
  }, [sreading, dreading, setValue]);

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log("Form Data Submitted:", formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            date: new Date().toISOString(), // Automatically set the current date
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit");
      }

      toast.success("Transport record added!");
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg text-center">Submit Transport Route</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500">Form has errors! Please check inputs.</div>
          )}

          {/* TSR Selection */}
          <div>
            <Label htmlFor="tsr">
              TSR Name<span className="text-red-500">*</span>
            </Label>
            <select id="tsr" {...register("tsr", { required: "TSR ID is required" })} className="w-full border rounded p-2">
              <option value="">Select TSR</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.tsr && <p className="text-red-500">{errors.tsr.message}</p>}
          </div>

          {/* Driver & Dispatcher Selection */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="driver">
                Driver<span className="text-red-500">*</span>
              </Label>
              <select id="driver" {...register("driver", { required: "Driver name is required" })} className="w-full border rounded p-2">
                <option value="">Select Driver</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.driver && <p className="text-red-500">{errors.driver.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="dispatcher">
                Dispatcher<span className="text-red-500">*</span>
              </Label>
              <select id="dispatcher" {...register("dispatcher", { required: "Dispatcher name is required" })} className="w-full border rounded p-2">
                <option value="">Select Dispatcher</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.dispatcher && <p className="text-red-500">{errors.dispatcher.message}</p>}
            </div>
          </div>

          {/* Number Plate & Route Number */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="number_plate">Plate No.</Label>
              <Input id="number_plate" {...register("number_plate", { required: "Number plate is required" })} />
              {errors.number_plate && <p className="text-red-500">{errors.number_plate.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="routenumber">Route No.</Label>
              <Input id="routenumber" {...register("routenumber", { required: "Route number is required" })} />
              {errors.routenumber && <p className="text-red-500">{errors.routenumber.message}</p>}
            </div>
          </div>

          {/* Start & Destination Reading */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="sreading">Start Reading</Label>
              <Controller
                name="sreading"
                control={control}
                rules={{ required: "Start reading is required", min: { value: 1, message: "Must be positive" } }}
                render={({ field }) => <Input id="sreading" type="number" {...field} />}
              />
              {errors.sreading && <p className="text-red-500">{errors.sreading.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="dreading">Destination Reading</Label>
              <Controller
                name="dreading"
                control={control}
                rules={{ required: "Destination reading is required", min: { value: 1, message: "Must be positive" } }}
                render={({ field }) => <Input id="dreading" type="number" {...field} />}
              />
              {errors.dreading && <p className="text-red-500">{errors.dreading.message}</p>}
            </div>
          </div>

          {/* Distance Covered */}
          <div>
            <Label htmlFor="distance_covered">Distance Covered</Label>
            <Input id="distance_covered" type="number" {...register("distance_covered")} disabled />
          </div>

          {/* Petrol Bill & Total */}
          <div>
            <Label htmlFor="petrolbill">Petrol Bill</Label>
            <Input id="petrolbill" type="number" {...register("petrolbill", { required: "Petrol bill is required", min: { value: 1, message: "Must be positive" } })} />
            {errors.petrolbill && <p className="text-red-500">{errors.petrolbill.message}</p>}
          </div>
          <div>
            <Label htmlFor="total">Total</Label>
            <Input id="total" type="number" {...register("total", { min: { value: 1, message: "Must be positive" } })} />
            {errors.total && <p className="text-red-500">{errors.total.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full mt-6 bg-black hover:bg-gray-700 text-white py-3 rounded-lg">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
