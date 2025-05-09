'use client'
import React, { useState, useEffect } from 'react';
import { Card, Select, Collapse, Table, Typography, Statistic, Row, Col, Divider, Empty, Spin, DatePicker, Space, Button, Radio } from 'antd';
import { CarOutlined, CalendarOutlined, DollarOutlined, DashboardOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Import dayjs for date handling
import Loader from '@/components/ui/Loader';

const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const Page = () => {
  const [transportData, setTransportData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateSingle, setSelectedDateSingle] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fetch users first
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchUsers();
  }, []);

  // Fetch transportation data
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
        
        // Set default to today's date using dayjs
        setSelectedDateSingle(dayjs());
        
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
    
    if (isDateRangeMode) {
      if (isMobile && startDate && endDate) {
        // Convert individual dates from dayjs to Date objects for comparison
        const start = startDate.startOf('day').toDate();
        const end = endDate.endOf('day').toDate();
        
        filtered = filtered.filter(item => 
          item.date >= start && item.date <= end
        );
      } else if (!isMobile && dateRange && dateRange[0] && dateRange[1]) {
        // Convert dateRange from dayjs to Date objects for comparison
        const start = dateRange[0].startOf('day').toDate();
        const end = dateRange[1].endOf('day').toDate();
        
        filtered = filtered.filter(item => 
          item.date >= start && item.date <= end
        );
      }
    } else if (!isDateRangeMode && selectedDateSingle) {
      // For single date selection using dayjs
      const startOfDay = selectedDateSingle.startOf('day').toDate();
      const endOfDay = selectedDateSingle.endOf('day').toDate();
      
      filtered = filtered.filter(item => 
        item.date >= startOfDay && item.date <= endOfDay
      );
    }
    
    if (selectedUser) {
      // Filter by TSR, driver, or dispatcher matching the selected user
      filtered = filtered.filter(item => 
        item.tsr === selectedUser || 
        item.driver === selectedUser || 
        item.dispatcher === selectedUser
      );
    }
    
    // Sort filtered data by date (latest to oldest)
    filtered.sort((a, b) => b.date - a.date);
    
    setFilteredData(filtered);
  }, [selectedDateSingle, selectedUser, transportData, dateRange, isDateRangeMode, startDate, endDate, isMobile]);

  const handleSingleDateChange = (date) => {
    setSelectedDateSingle(date); // This will be a dayjs object or null
  };

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  const toggleDateMode = (e) => {
    const newMode = e.target.value === 'range';
    setIsDateRangeMode(newMode);
    // Reset the other date selection mode when switching
    if (newMode) {
      setSelectedDateSingle(null);
    } else {
      setDateRange(null);
      setStartDate(null);
      setEndDate(null);
      // Set default to today when switching to single date
      setSelectedDateSingle(dayjs());
    }
  };

  // Helper function to determine user's role in a trip
  const getUserRoles = (item, username) => {
    const roles = [];
    if (item.tsr === username) roles.push("TSR");
    if (item.driver === username) roles.push("Driver");
    if (item.dispatcher === username) roles.push("Dispatcher");
    return roles.join(", ");
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date.toLocaleDateString(),
      sorter: (a, b) => b.date - a.date,
      defaultSortOrder: 'descend'
    },
    {
      title: 'Route',
      dataIndex: 'routenumber',
      key: 'routenumber',
      render: (text) => text.toString().toLowerCase().includes('route') ? text : `Route ${text}`
    },
    {
      title: 'Roles',
      key: 'roles',
      render: (_, record) => getUserRoles(record, selectedUser)
    },
    {
      title: 'Number Plate',
      dataIndex: 'number_plate',
      key: 'number_plate',
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
    }
  ];

  // More detailed columns for larger screens
  const expandedColumns = [
    ...columns,
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
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => `$${text}`
    }
  ];

  const formatDate = (date) => {
    if (!date) return '';
    
    // If it's a dayjs object, convert to JS Date
    const jsDate = dayjs.isDayjs(date) ? date.toDate() : new Date(date);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return jsDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-2 sm:p-4 mb-5">
      <Card 
        title={<Title level={4}><CarOutlined /> Transportation Data</Title>} 
        bordered={false}
        className="shadow-md"
        bodyStyle={{ padding: '12px' }}
      >
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24}>
            <Text strong><UserOutlined /> Select User:</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Select a user"
              onChange={handleUserChange}
              value={selectedUser}
              allowClear
              className="mt-2"
              showSearch
              optionFilterProp="children"
            >
              {users.map(user => (
                <Option key={user._id} value={user.name}>{user.name}</Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24}>
            <Text strong><CalendarOutlined /> Select Date Type:</Text>
            <div className="mt-2">
              <Radio.Group 
                onChange={toggleDateMode} 
                value={isDateRangeMode ? 'range' : 'single'}
                buttonStyle="solid"
                className="w-full"
              >
                <Radio.Button value="single" style={{ width: '50%', textAlign: 'center' }}>
                  Single Date
                </Radio.Button>
                <Radio.Button value="range" style={{ width: '50%', textAlign: 'center' }}>
                  Date Range
                </Radio.Button>
              </Radio.Group>
            </div>
          </Col>
          
          <Col xs={24}>
            {isDateRangeMode ? (
              isMobile ? (
                // Mobile-friendly date range selector - separate date pickers
                <>
                  <Text strong>Select Start Date:</Text>
                  <DatePicker 
                    style={{ width: '100%', marginTop: '8px', marginBottom: '12px' }} 
                    onChange={handleStartDateChange}
                    value={startDate}
                    format="YYYY-MM-DD"
                    placeholder="Start Date"
                  />
                  
                  <Text strong>Select End Date:</Text>
                  <DatePicker 
                    style={{ width: '100%', marginTop: '8px' }} 
                    onChange={handleEndDateChange}
                    value={endDate}
                    format="YYYY-MM-DD"
                    placeholder="End Date"
                    disabledDate={(current) => {
                      return startDate ? current < startDate : false;
                    }}
                  />
                </>
              ) : (
                // Desktop date range picker
                <>
                  <Text strong>Select Date Range:</Text>
                  <RangePicker 
                    style={{ width: '100%', marginTop: '8px' }} 
                    onChange={handleDateRangeChange}
                    value={dateRange}
                    format="YYYY-MM-DD"
                  />
                </>
              )
            ) : (
              // Single date selector using DatePicker
              <>
                <Text strong>Select Date:</Text>
                <DatePicker
                  style={{ width: '100%', marginTop: '8px' }}
                  onChange={handleSingleDateChange}
                  value={selectedDateSingle}
                  format="YYYY-MM-DD"
                  placeholder="Select a date"
                />
              </>
            )}
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }}/>

        {loading ? (
          <Loader/>
        ) : filteredData.length > 0 ? (
          <>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic 
                    title="Total Trips" 
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
                    value={filteredData.reduce((sum, item) => sum + item.petrolbill, 0).toFixed(2)} 
                    prefix={<DollarOutlined />}
                    precision={2}
                  />
                </Col>
              </Row>
            </div>

            <Collapse 
              accordion 
              className="mt-4 mb-4"
              expandIconPosition="end"
            >
              {filteredData.map(item => {
                const userRoles = getUserRoles(item, selectedUser);
                return (
                  <Panel 
                    key={item._id} 
                    header={
                      <div>
                        <Text strong>{item.routenumber.toString().toLowerCase().includes('route') ? 
                          item.routenumber : `Route ${item.routenumber}`}</Text>
                        <div className="text-xs text-gray-500">
                          {userRoles} • {item.number_plate} • {item.date.toLocaleDateString()}
                        </div>
                      </div>
                    }
                  >
                    <Row gutter={[8, 8]}>
                      <Col xs={24} md={12}>
                        <Card size="small" title="Journey Details" bordered>
                          <p><strong>TSR:</strong> {item.tsr}</p>
                          <p><strong>Driver:</strong> {item.driver}</p>
                          <p><strong>Dispatcher:</strong> {item.dispatcher}</p>
                          <p><strong>User Roles:</strong> {userRoles}</p>
                          <p><strong>Number Plate:</strong> {item.number_plate}</p>
                          <p><strong>Date:</strong> {item.date.toLocaleDateString()}</p>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card size="small" title="Trip Metrics" bordered>
                          <p><strong>Start Reading:</strong> {item.sreading} km</p>
                          <p><strong>End Reading:</strong> {item.dreading} km</p>
                          <p><strong>Distance Covered:</strong> {item.distance_covered} km</p>
                          <p><strong>Petrol Bill:</strong> ${item.petrolbill}</p>
                          <p><strong>Total:</strong> ${item.total}</p>
                        </Card>
                      </Col>
                    </Row>
                  </Panel>
                );
              })}
            </Collapse>
            
            <Table 
              dataSource={filteredData} 
              columns={isMobile ? columns : expandedColumns}
              scroll={{ x: true }}
              pagination={{ 
                pageSize: 5,
                size: "small",
                showSizeChanger: false,
                responsive: true
              }}
              size="small"
              className="mt-2"
              defaultSortField="date"
              defaultSortOrder="descend"
            />
          </>
        ) : (
          <Empty 
            description={
              selectedUser ? 
                (isDateRangeMode ? 
                  `No data for ${selectedUser} in selected date range` : 
                  `No data for ${selectedUser} on ${selectedDateSingle ? formatDate(selectedDateSingle) : 'selected date'}`) : 
                "No data for selected filters"
            }
            className="my-8" 
          />
        )}
      </Card>
    </div>
  );
};

export default Page;