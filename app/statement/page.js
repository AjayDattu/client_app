'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, message, Row, Col } from 'antd';

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
              <Row gutter={[16, 16]}>
                <Col span={24} className="flex justify-end">
                  <div className="w-full md:w-1/4">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      {...register('date')} 
                      className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>
                </Col>
                
                <Col span={24}>
                  <Label htmlFor="tsr">TSR ID</Label>
                  <Input 
                    id="tsr" 
                    {...register('tsr')} 
                    className={errors.tsr ? 'border-red-500' : ''}
                  />
                  {errors.tsr && <p className="text-red-500 text-xs mt-1">{errors.tsr.message}</p>}
                </Col>

                <Col xs={24} md={8}>
                  <Label htmlFor="driver">Driver Name</Label>
                  <Input 
                    id="driver" 
                    {...register('driver')} 
                    className={errors.driver ? 'border-red-500' : ''}
                  />
                  {errors.driver && <p className="text-red-500 text-xs mt-1">{errors.driver.message}</p>}
                </Col>
                
                <Col xs={24} md={8}>
                  <Label htmlFor="dispatcher">Dispatcher Name</Label>
                  <Input 
                    id="dispatcher" 
                    {...register('dispatcher')} 
                    className={errors.dispatcher ? 'border-red-500' : ''}
                  />
                  {errors.dispatcher && <p className="text-red-500 text-xs mt-1">{errors.dispatcher.message}</p>}
                </Col>
                
                <Col xs={24} md={8}>
                  <Label htmlFor="number_plate">Number Plate</Label>
                  <Input 
                    id="number_plate" 
                    {...register('number_plate')} 
                    className={errors.number_plate ? 'border-red-500' : ''}
                  />
                  {errors.number_plate && <p className="text-red-500 text-xs mt-1">{errors.number_plate.message}</p>}
                </Col>

                <Col span={24}>
                  <Label htmlFor="routenumber">Route Number</Label>
                  <Input 
                    id="routenumber" 
                    {...register('routenumber')} 
                    className={errors.routenumber ? 'border-red-500' : ''}
                  />
                  {errors.routenumber && <p className="text-red-500 text-xs mt-1">{errors.routenumber.message}</p>}
                </Col>

                <Col xs={24} md={12}>
                  <Label htmlFor="sreading">Start Reading</Label>
                  <Input 
                    id="sreading" 
                    type="number" 
                    {...register('sreading', { valueAsNumber: true })} 
                    className={errors.sreading ? 'border-red-500' : ''}
                  />
                  {errors.sreading && <p className="text-red-500 text-xs mt-1">{errors.sreading.message}</p>}
                </Col>
                
                <Col xs={24} md={12}>
                  <Label htmlFor="dreading">Destination Reading</Label>
                  <Input 
                    id="dreading" 
                    type="number" 
                    {...register('dreading', { valueAsNumber: true })} 
                    className={errors.dreading ? 'border-red-500' : ''}
                  />
                  {errors.dreading && <p className="text-red-500 text-xs mt-1">{errors.dreading.message}</p>}
                </Col>

                <Col xs={24} md={12}>
                  <Label htmlFor="distance_covered">Distance Covered (km)</Label>
                  <Input 
                    id="distance_covered" 
                    type="number" 
                    {...register('distance_covered', { valueAsNumber: true })} 
                    readOnly
                    className="bg-gray-100"
                  />
                  {errors.distance_covered && <p className="text-red-500 text-xs mt-1">{errors.distance_covered.message}</p>}
                </Col>

                <Col xs={24} md={12}>
                  <Label htmlFor="petrolbill">Petrol Bill (KSH)</Label>
                  <Input 
                    id="petrolbill" 
                    type="number" 
                    {...register('petrolbill', { valueAsNumber: true })} 
                    className={errors.petrolbill ? 'border-red-500' : ''}
                  />
                  {errors.petrolbill && <p className="text-red-500 text-xs mt-1">{errors.petrolbill.message}</p>}
                </Col>

                <Col xs={24} md={12}>
                  <Label htmlFor="total">Total Earnings (KSH)</Label>
                  <Input 
                    id="total" 
                    type="number" 
                    {...register('total', { valueAsNumber: true })} 
                    className={errors.total ? 'border-red-500' : ''}
                  />
                  {errors.total && <p className="text-red-500 text-xs mt-1">{errors.total.message}</p>}
                </Col>
              </Row>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
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
      className="max-w-4xl mx-auto mt-6"
      items={tabItems}
    />
  );
}