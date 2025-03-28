'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const transportSchema = z.object({
  tsr: z.string().min(1, 'TSR ID is required'),
  driver: z.string().min(1, 'Driver name is required'),
  dispatcher: z.string().min(1, 'Dispatcher name is required'),
  number_plate: z.string().min(1, 'Number plate is required'),
  sreading: z.coerce.number().positive('Start reading must be positive'),
  dreading: z.coerce.number().positive('Destination reading must be positive'),
  fuel_info: z.string().min(1, 'Fuel information is required'),
  routenumber: z.string().min(1, 'Route number is required'),
  date: z.date(),
  distance_covered: z.coerce.number().positive().optional(),
  petrolbill: z.coerce.number().positive('Petrol bill must be positive'),
  total: z.coerce.number().positive('Total must be positive').optional(),
});

export default function TransportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(transportSchema),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue('date', new Date());
  }, [setValue]);

  const sreading = watch('sreading');
  const dreading = watch('dreading');

  useEffect(() => {
    if (sreading && dreading && dreading > sreading) {
      setValue('distance_covered', dreading - sreading);
    }
  }, [sreading, dreading, setValue]);

  const onSubmit = async (formData) => {
    setLoading(true);
    const data = {
      ...formData,
      number_plate: formData.number_plate.toUpperCase(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit');
      }

      toast.success('Transport record added!');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Submission failed');
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
          <div>
            <Label>Date <span className="text-red-500">*</span></Label>
            <Input type="text" value={new Date().toLocaleDateString()} disabled className="bg-gray-200" />
          </div>
          <div>
            <Label htmlFor="tsr">TSR Name<span className="text-red-500">*</span></Label>
            <Input id="tsr" {...register('tsr')} className={errors.tsr ? 'border-red-500' : ''} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="driver">Driver <span className="text-red-500">*</span></Label>
              <Input id="driver" {...register('driver')} className={errors.driver ? 'border-red-500' : ''} />
            </div>
            <div className="flex-1">
              <Label htmlFor="dispatcher">Dispatcher <span className="text-red-500">*</span></Label>
              <Input id="dispatcher" {...register('dispatcher')} className={errors.dispatcher ? 'border-red-500' : ''} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="number_plate">Plate No. <span className="text-red-500">*</span></Label>
              <Input id="number_plate" {...register('number_plate')} className={errors.number_plate ? 'border-red-500' : ''} />
            </div>
            <div className="flex-1">
              <Label htmlFor="routenumber">Route No. <span className="text-red-500">*</span></Label>
              <Input id="routenumber" {...register('routenumber')} className={errors.routenumber ? 'border-red-500' : ''} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="sreading">Start Reading <span className="text-red-500">*</span></Label>
              <Input id="sreading" type="number" {...register('sreading')} className={errors.sreading ? 'border-red-500' : ''} />
            </div>
            <div className="flex-1">
              <Label htmlFor="dreading">Destination Reading <span className="text-red-500">*</span></Label>
              <Input id="dreading" type="number" {...register('dreading')} className={errors.dreading ? 'border-red-500' : ''} />
            </div>
          </div>
          <div>
            <Label htmlFor="distance_covered">Distance Covered</Label>
            <Input id="distance_covered" type="number" {...register('distance_covered')} />
          </div>
          <div>
            <Label htmlFor="petrolbill">Petrol Bill</Label>
            <Input id="petrolbill" type="number" {...register('petrolbill')} />
          </div>
          <div>
            <Label htmlFor="total">Total</Label>
            <Input id="total" type="number" {...register('total')} />
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-6 bg-black hover:bg-gray-700 text-white py-3 rounded-lg">
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
