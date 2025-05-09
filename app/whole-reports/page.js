'use client'
import React, { useState, useEffect } from 'react';
import { Card, Select, Collapse, Table, Typography, Statistic, Row, Col, Divider, Empty, Spin, DatePicker } from 'antd';
import { CarOutlined, CalendarOutlined, DollarOutlined, DashboardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Loader from '@/components/ui/Loader';

const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const Page = () => {
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [uniqueRoutes, setUniqueRoutes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transports`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawData = await response.json();

        // Process the data
        const data = rawData.map(item => ({
          ...item,
          date: new Date(item.date),
          key: item._id
        }));

        setTransportData(data);
        
        // Extract unique dates and format them
        const dates = [...new Set(data.map(item => 
          item.date.toISOString().split('T')[0]
        ))].sort((a, b) => new Date(b) - new Date(a));
        
        setUniqueDates(dates);
        
        // Extract unique route numbers
        const routes = [...new Set(data.map(item => item.routenumber))];
        setUniqueRoutes(routes);
        
        // Set default selections
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transportation data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on selections
    let filtered = [...transportData];
    
    if (selectedDate) {
      const dateStr = typeof selectedDate === 'string' ? selectedDate : selectedDate.format('YYYY-MM-DD');
      filtered = filtered.filter(item => 
        item.date.toISOString().split('T')[0] === dateStr
      );
    }
    
    if (selectedRoute) {
      filtered = filtered.filter(item => item.routenumber === selectedRoute);
    }
    
    setFilteredData(filtered);
  }, [selectedDate, selectedRoute, transportData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value);
  };

  const columns = [
    {
      title: 'TSR',
      dataIndex: 'tsr',
      key: 'tsr',
    },
    {
      title: 'Driver',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: 'Dispatcher',
      dataIndex: 'dispatcher',
      key: 'dispatcher',
    },
    {
      title: 'Number Plate',
      dataIndex: 'number_plate',
      key: 'number_plate',
    },
    {
      title: 'Start Reading',
      dataIndex: 'sreading',
      key: 'sreading',
    },
    {
      title: 'End Reading',
      dataIndex: 'dreading',
      key: 'dreading',
    },
    {
      title: 'Distance',
      dataIndex: 'distance_covered',
      key: 'distance_covered',
      render: (text) => `${text} km`
    },
    {
      title: 'Petrol Bill',
      dataIndex: 'petrolbill',
      key: 'petrolbill',
      render: (text) => `$${text}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => `$${text}`
    }
  ];

  // Function to handle DatePicker's disabledDate prop
  const disabledDate = (current) => {
    // Only enable dates that exist in our dataset
    const dateString = current.format('YYYY-MM-DD');
    return !uniqueDates.includes(dateString);
  };

  return (
    <div className="p-4 mb-5">
      <Card 
        title={<Title level={4}><CarOutlined /> Transportation Data</Title>} 
        bordered={false}
        className="shadow-md"
      >
        <Row gutter={16} className="mb-4">
          <Col xs={24} sm={12}>
            <Text strong><CalendarOutlined /> Select Date:</Text>
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select a date"
              onChange={handleDateChange}
              value={selectedDate ? dayjs(selectedDate) : null}
              disabledDate={disabledDate}
              className="mt-2"
              format="MMMM D, YYYY"
            />
          </Col>
          <Col xs={24} sm={12}>
            <Text strong><DashboardOutlined /> Select Route:</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Select a route"
              onChange={handleRouteChange}
              value={selectedRoute}
              allowClear
              className="mt-2"
            >
              {uniqueRoutes.map(route => (
                <Option key={route} value={route}>Route {route}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Divider />

        {loading ? (
          <Loader/>
        ) : filteredData.length > 0 ? (
          <>
            <Row gutter={16} className="mb-4">
              <Col xs={24} sm={8}>
                <Statistic 
                  title="Total Journeys" 
                  value={filteredData.length} 
                  prefix={<CarOutlined />} 
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic 
                  title="Total Distance" 
                  value={filteredData.reduce((sum, item) => sum + item.distance_covered, 0)} 
                  suffix="km"
                  prefix={<DashboardOutlined />}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic 
                  title="Total Petrol Cost" 
                  value={filteredData.reduce((sum, item) => sum + item.petrolbill, 0)} 
                  prefix={<DollarOutlined />}
                />
              </Col>
            </Row>

            <Collapse accordion className="mt-4">
              {filteredData.map(item => (
                <Panel 
                  key={item._id} 
                  header={
                    <div>
                      <Text strong>Route {item.routenumber}</Text> - 
                      <Text type="secondary"> {item.driver} ({item.number_plate})</Text>
                    </div>
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Card size="small" title="Journey Details" className="mb-2">
                        <p><strong>TSR:</strong> {item.tsr}</p>
                        <p><strong>Driver:</strong> {item.driver}</p>
                        <p><strong>Dispatcher:</strong> {item.dispatcher}</p>
                        <p><strong>Number Plate:</strong> {item.number_plate}</p>
                        <p><strong>Date:</strong> {dayjs(item.date).format('MMMM D, YYYY')}</p>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small" title="Trip Metrics" className="mb-2">
                        <p><strong>Start Reading:</strong> {item.sreading} km</p>
                        <p><strong>End Reading:</strong> {item.dreading} km</p>
                        <p><strong>Distance Covered:</strong> {item.distance_covered} km</p>
                        <p><strong>Petrol Bill:</strong> ${item.petrolbill}</p>
                        <p><strong>Total:</strong> ${item.total}</p>
                      </Card>
                    </Col>
                  </Row>
                </Panel>
              ))}
            </Collapse>

            <Divider />
            
            <Table 
              dataSource={filteredData} 
              columns={columns} 
              scroll={{ x: true }}
              pagination={{ pageSize: 5 }}
              className="mt-4" 
            />
          </>
        ) : (
          <Empty description="No transportation data found for the selected filters" />
        )}
      </Card>
    </div>
  );
};

export default Page;