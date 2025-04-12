"use client"
import React, { useState, useRef } from 'react';
import { 
  Input, Button, Card, Collapse, Form, 
  Typography, InputNumber, Space, 
  Table, Row, Col, notification, Tooltip
} from 'antd';
import { 
  PlusOutlined, MinusCircleOutlined, 
  DollarOutlined, FileTextOutlined,
  CarryOutOutlined, CreditCardOutlined, 
  CalculatorOutlined, SaveOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const BillManagementMobile = () => {
  // Refs for focus management
  const voucherInputRef = useRef(null);
  const onlineBillRefs = useRef([]);
  const receivedBillRefs = useRef([]);
  const pendingBillRefs = useRef([]);
  const collapseRef = useRef(null);
  
  // State for active panel
  const [activeKey, setActiveKey] = useState('1');
  
  // State for demand and voucher
  const [demand, setDemand] = useState(0);
  const [voucher, setVoucher] = useState(0);
  
  // State for bill lists
  const [onlineBills, setOnlineBills] = useState([{ amount: 0, description: '' }]);
  const [receivedBills, setReceivedBills] = useState([{ amount: 0, description: '' }]);
  const [pendingBills, setPendingBills] = useState([{ amount: 0, description: '' }]);

  // Calculate totals
  const onlineTotal = onlineBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const receivedTotal = receivedBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const pendingTotal = pendingBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  
  // Calculate result based on formula: demand - pendingTotal + receivedTotal - onlineTotal - voucher
  const result = Number(demand || 0) - pendingTotal + receivedTotal - onlineTotal - Number(voucher || 0);

  // Add a new bill to specified category
  const addBill = (category) => {
    const newBill = { amount: 0, description: '' };
    
    if (category === 'online') {
      const newBills = [...onlineBills, newBill];
      setOnlineBills(newBills);
      // Focus on the new bill after render
      setTimeout(() => {
        if (onlineBillRefs.current[newBills.length - 1]) {
          onlineBillRefs.current[newBills.length - 1].focus();
        }
      }, 0);
    } else if (category === 'received') {
      const newBills = [...receivedBills, newBill];
      setReceivedBills(newBills);
      setTimeout(() => {
        if (receivedBillRefs.current[newBills.length - 1]) {
          receivedBillRefs.current[newBills.length - 1].focus();
        }
      }, 0);
    } else if (category === 'pending') {
      const newBills = [...pendingBills, newBill];
      setPendingBills(newBills);
      setTimeout(() => {
        if (pendingBillRefs.current[newBills.length - 1]) {
          pendingBillRefs.current[newBills.length - 1].focus();
        }
      }, 0);
    }
  };

  // Remove a bill from specified category
  const removeBill = (category, index) => {
    if (category === 'online') {
      setOnlineBills(onlineBills.filter((_, i) => i !== index));
      notification.success({
        message: 'Online bill removed',
        description: 'The bill has been removed successfully.',
        placement: 'top',
        duration: 2
      });
    } else if (category === 'received') {
      setReceivedBills(receivedBills.filter((_, i) => i !== index));
      notification.success({
        message: 'Received bill removed',
        description: 'The bill has been removed successfully.',
        placement: 'top',
        duration: 2
      });
    } else if (category === 'pending') {
      setPendingBills(pendingBills.filter((_, i) => i !== index));
      notification.success({
        message: 'Pending bill removed',
        description: 'The bill has been removed successfully.',
        placement: 'top',
        duration: 2
      });
    }
  };

  // Update bill data
  const updateBill = (category, index, field, value) => {
    if (category === 'online') {
      const updatedBills = [...onlineBills];
      updatedBills[index][field] = value;
      setOnlineBills(updatedBills);
    } else if (category === 'received') {
      const updatedBills = [...receivedBills];
      updatedBills[index][field] = value;
      setReceivedBills(updatedBills);
    } else if (category === 'pending') {
      const updatedBills = [...pendingBills];
      updatedBills[index][field] = value;
      setPendingBills(updatedBills);
    }
  };

  // Handle Enter key in demand input
  const handleDemandKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (voucherInputRef.current) {
        voucherInputRef.current.focus();
      }
    }
  };

  // Handle Enter key in voucher input
  const handleVoucherKeyPress = (e) => {
    if (e.key === 'Enter') {
      setActiveKey('1');
      // Give some time for the panel to open
      setTimeout(() => {
        if (onlineBillRefs.current[0]) {
          onlineBillRefs.current[0].focus();
        }
      }, 100);
    }
  };

  // Handle Enter key in bill description
  const handleDescriptionKeyPress = (e, category, index, isLast) => {
    if (e.key === 'Enter') {
      const amountInput = getAmountInputRef(category, index);
      if (amountInput) {
        amountInput.focus();
      }
    }
  };

  // Handle Enter key in bill amount
  const handleAmountKeyPress = (e, category, index, isLast) => {
    if (e.key === 'Enter') {
      if (isLast) {
        // Add a new bill if it's the last one
        addBill(category);
      } else {
        // Move to the next bill description
        const nextDescriptionInput = getDescriptionInputRef(category, index + 1);
        if (nextDescriptionInput) {
          nextDescriptionInput.focus();
        }
      }
    }
  };

  // Helper function to get references to amount inputs
  const getAmountInputRef = (category, index) => {
    if (category === 'online' && onlineBillRefs.current[index]) {
      return onlineBillRefs.current[index].querySelector('input[type="number"]') || 
             onlineBillRefs.current[index].querySelector('.ant-input-number-input');
    }
    if (category === 'received' && receivedBillRefs.current[index]) {
      return receivedBillRefs.current[index].querySelector('input[type="number"]') || 
             receivedBillRefs.current[index].querySelector('.ant-input-number-input');
    }
    if (category === 'pending' && pendingBillRefs.current[index]) {
      return pendingBillRefs.current[index].querySelector('input[type="number"]') || 
             pendingBillRefs.current[index].querySelector('.ant-input-number-input');
    }
    return null;
  };

  // Helper function to get references to description inputs
  const getDescriptionInputRef = (category, index) => {
    if (category === 'online' && onlineBillRefs.current[index]) {
      return onlineBillRefs.current[index].querySelector('input[type="text"]');
    }
    if (category === 'received' && receivedBillRefs.current[index]) {
      return receivedBillRefs.current[index].querySelector('input[type="text"]');
    }
    if (category === 'pending' && pendingBillRefs.current[index]) {
      return pendingBillRefs.current[index].querySelector('input[type="text"]');
    }
    return null;
  };

  // Move to next section
  const moveToNextSection = () => {
    if (activeKey === '1') {
      setActiveKey('2');
      setTimeout(() => {
        if (receivedBillRefs.current[0]) {
          receivedBillRefs.current[0].focus();
        }
      }, 100);
    } else if (activeKey === '2') {
      setActiveKey('3');
      setTimeout(() => {
        if (pendingBillRefs.current[0]) {
          pendingBillRefs.current[0].focus();
        }
      }, 100);
    } else if (activeKey === '3') {
      // Scroll to summary
      const summaryElement = document.getElementById('summary-section');
      if (summaryElement) {
        summaryElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Save all data (mock function)
  const saveData = () => {
    notification.success({
      message: 'Data Saved',
      description: 'Your bill management data has been saved successfully.',
      placement: 'top'
    });
  };

  // Table columns for summary
  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text) => text
    },
  ];

  // Table data for summary
  const data = [
    {
      key: '1',
      category: 'Demand',
      amount: demand,
    },
    {
      key: '2',
      category: 'Pending Bills (-)',
      amount: `-${pendingTotal}`,
    },
    {
      key: '3',
      category: 'Received Bills (+)',
      amount: `+${receivedTotal}`,
    },
    {
      key: '4',
      category: 'Online Bills (-)',
      amount: `-${onlineTotal}`,
    },
    {
      key: '5',
      category: 'Voucher (-)',
      amount: `-${voucher}`,
    },
  ];

  // Initialize refs arrays when bill lists change
  React.useEffect(() => {
    onlineBillRefs.current = onlineBillRefs.current.slice(0, onlineBills.length);
  }, [onlineBills]);

  React.useEffect(() => {
    receivedBillRefs.current = receivedBillRefs.current.slice(0, receivedBills.length);
  }, [receivedBills]);

  React.useEffect(() => {
    pendingBillRefs.current = pendingBillRefs.current.slice(0, pendingBills.length);
  }, [pendingBills]);

  // Render bill items for a category
  const renderBillItems = (category, billList) => {
    const refArray = 
      category === 'online' ? onlineBillRefs : 
      category === 'received' ? receivedBillRefs : 
      pendingBillRefs;

    return billList.map((bill, index) => {
      const isLast = index === billList.length - 1;
      
      return (
        <div 
          key={index} 
          style={{ marginBottom: 12 }}
          ref={el => refArray.current[index] = el}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Bill Description"
              value={bill.description}
              onChange={(e) => updateBill(category, index, 'description', e.target.value)}
              prefix={<FileTextOutlined />}
              onKeyPress={(e) => handleDescriptionKeyPress(e, category, index, isLast)}
              autoComplete="off"
            />
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <InputNumber
                style={{ width: '70%' }}
                placeholder="Amount"
                value={bill.amount}
                onChange={(value) => updateBill(category, index, 'amount', value)}
                prefix={<DollarOutlined />}
                onKeyPress={(e) => handleAmountKeyPress(e, category, index, isLast)}
                autoComplete="off"
              />
              <Button 
                type="text" 
                danger 
                icon={<MinusCircleOutlined />}
                onClick={() => removeBill(category, index)}
              >
                Remove
              </Button>
            </Space>
          </Space>
        </div>
      );
    });
  };

  return (
    <div style={{ padding: '10px', maxWidth: '100%', margin: '0 auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>
          <CalculatorOutlined /> Bill Management
        </Title>

        {/* Demand and Voucher Inputs */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Demand">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter Demand"
                value={demand}
                onChange={setDemand}
                prefix={<DollarOutlined />}
                onKeyPress={handleDemandKeyPress}
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Voucher">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter Voucher"
                value={voucher}
                onChange={setVoucher}
                prefix={<DollarOutlined />}
                ref={voucherInputRef}
                onKeyPress={handleVoucherKeyPress}
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginBottom: 10, textAlign: 'center' }}>
          <Text type="secondary">
            <ArrowDownOutlined /> Press Enter to navigate between fields <ArrowDownOutlined />
          </Text>
        </div>

        {/* Bill Management Sections */}
        <Collapse 
          accordion 
          activeKey={[activeKey]} 
          onChange={(key) => setActiveKey(key)} 
          style={{ marginBottom: 20 }}
          ref={collapseRef}
        >
          {/* Online Bills */}
          <Panel 
            header={
              <Space>
                <CreditCardOutlined style={{ color: '#1890ff' }} />
                <Text strong>Online Bills</Text>
                <Text type="secondary">(Total: {onlineTotal})</Text>
              </Space>
            } 
            key="1"
            style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}
            extra={
              <Tooltip title="Move to next section">
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToNextSection();
                  }}
                >
                  Next
                </Button>
              </Tooltip>
            }
          >
            {renderBillItems('online', onlineBills)}
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                addBill('online');
              }}
              style={{ marginTop: 8 }}
            >
              Add Online Bill
            </Button>
          </Panel>
          
          {/* Received Bills */}
          <Panel 
            header={
              <Space>
                <CarryOutOutlined style={{ color: '#52c41a' }} />
                <Text strong>Received Bills</Text>
                <Text type="secondary">(Total: {receivedTotal})</Text>
              </Space>
            } 
            key="2"
            style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
            extra={
              <Tooltip title="Move to next section">
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToNextSection();
                  }}
                >
                  Next
                </Button>
              </Tooltip>
            }
          >
            {renderBillItems('received', receivedBills)}
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                addBill('received');
              }}
              style={{ marginTop: 8 }}
            >
              Add Received Bill
            </Button>
          </Panel>
          
          {/* Pending Bills */}
          <Panel 
            header={
              <Space>
                <FileTextOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Pending Bills</Text>
                <Text type="secondary">(Total: {pendingTotal})</Text>
              </Space>
            } 
            key="3"
            style={{ backgroundColor: '#fff7e6', borderColor: '#ffd591' }}
            extra={
              <Tooltip title="Move to summary">
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToNextSection();
                  }}
                >
                  Summary
                </Button>
              </Tooltip>
            }
          >
            {renderBillItems('pending', pendingBills)}
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                addBill('pending');
              }}
              style={{ marginTop: 8 }}
            >
              Add Pending Bill
            </Button>
          </Panel>
        </Collapse>

        {/* Summary Table */}
        <div style={{ marginBottom: 20 }} id="summary-section">
          <Title level={4}>Summary</Title>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <Text strong>Final Result</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong style={{ float: 'right' }}>{result}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* Result Display */}
        <Card 
          style={{ 
            backgroundColor: '#f0f5ff', 
            borderColor: '#adc6ff',
            textAlign: 'center',
            marginBottom: 10
          }}
        >
          <Title level={4}>Final Calculation</Title>
          <Title level={2} style={{ color: '#1890ff', margin: '10px 0' }}>
            {result}
          </Title>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Demand - Pending + Received - Online - Voucher
          </Text>
        </Card>

        {/* Save Button */}
        <Button
          type="primary"
          block
          icon={<SaveOutlined />}
          onClick={saveData}
          style={{ marginTop: 20 }}
          size="large"
        >
          Save All Data
        </Button>
      </Card>
    </div>
  );
};

export default BillManagementMobile;