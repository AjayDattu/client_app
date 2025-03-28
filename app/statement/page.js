'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, message } from 'antd';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField from '@mui/material/TextField';
const transportSchema = z.object({
  tsr: z.string().min(1, 'TSR ID is required'),
  driver: z.string().min(1, 'Driver name is required'),
  dispatcher: z.string().min(1, 'Dispatcher name is required'),
  number_plate: z.string().min(1, 'Number plate is required'),
  sreading: z.number().positive('Start reading must be positive'),
  dreading: z.number().positive('Destination reading must be positive'),
  routenumber: z.string().min(1, 'Route number is required'),
  date: z.string().min(1, 'Date is required'),
  distance_covered: z.number().positive('Distance must be positive'),
  petrolbill: z.number().positive('Petrol bill must be positive'),
  total: z.number().positive('Total earnings must be positive'),
});

export default function TransportForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(transportSchema),
  });

  const [loading, setLoading] = useState(false);

  // Watch readings and calculate distance
  const sreading = watch('sreading');
  const dreading = watch('dreading');
  
  useEffect(() => {
    if (sreading && dreading) {
      const distance = dreading - sreading;
      if (distance > 0) {
        setValue('distance_covered', distance);
      }
    }
  }, [sreading, dreading, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit');
      message.success('Transport record added!');
      reset();
    } catch (error) {
      message.error(error.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: "Today's Records",
      children: (
        <Card className="p-4 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg text-center">Records Entered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">No records entered today</p>
          </CardContent>
        </Card>
      ),
    },
    {
      key: '2',
      label: 'New Entry',
      children: (
        <Card className="p-4 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg text-center">Submit Transport Route</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: TSR ID (Full width) */}
              <div className="flex gap-4">
                <div className="flex-1 w-[50%]">
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      value={dayjs(value)}
                      onChange={(newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '40px',
                              borderRadius: '6px',
                            }
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div>
                <Label htmlFor="tsr">TSR Name<span className="text-red-500">*</span></Label>
                <Input 
                  id="tsr" 
                  {...register('tsr')} 
                  className={errors.tsr ? 'border-red-500' : ''}
                />
              </div>

              {/* Row 2: Driver & Dispatcher (50/50 split) */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="driver">Driver <span className="text-red-500">*</span></Label>
                  <Input 
                    id="driver" 
                    {...register('driver')} 
                    className={errors.driver ? 'border-red-500' : ''}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="dispatcher">Dispatcher <span className="text-red-500">*</span></Label>
                  <Input 
                    id="dispatcher" 
                    {...register('dispatcher')} 
                    className={errors.dispatcher ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Row 3: Number Plate & Route (50/50 split) */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="number_plate">Plate No. <span className="text-red-500">*</span></Label>
                  <Input 
                    id="number_plate" 
                    {...register('number_plate')} 
                    className={errors.number_plate ? 'border-red-500' : ''}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="routenumber">Route No. <span className="text-red-500">*</span></Label>
                  <Input 
                    id="routenumber" 
                    {...register('routenumber')} 
                    className={errors.routenumber ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Row 4: Start & End Readings (50/50 split) */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="sreading">Start KM <span className="text-red-500">*</span></Label>
                  <Input 
                    id="sreading" 
                    type="number" 
                    {...register('sreading', { valueAsNumber: true })} 
                    className={errors.sreading ? 'border-red-500' : ''}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="dreading">End KM <span className="text-red-500">*</span></Label>
                  <Input 
                    id="dreading" 
                    type="number" 
                    {...register('dreading', { valueAsNumber: true })} 
                    className={errors.dreading ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Row 5: Distance & Petrol (50/50 split) */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="distance_covered">Distance (KM) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="distance_covered" 
                    type="number" 
                    {...register('distance_covered', { valueAsNumber: true })} 
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="petrolbill">Petrol (KSH) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="petrolbill" 
                    type="number" 
                    {...register('petrolbill', { valueAsNumber: true })} 
                    className={errors.petrolbill ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Row 6: Total & Date (50/50 split) */}
              

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      className="max-w-md mx-auto mt-4 px-2"
      items={tabItems}
    />
  );
}