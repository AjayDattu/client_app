"use client"
import React, { useState, useRef } from 'react';
import { 
  PlusCircleIcon, MinusCircleIcon, 
  CurrencyDollarIcon, DocumentTextIcon,
  ClipboardCheckIcon, CreditCardIcon, 
  CalculatorIcon, SaveIcon,
  ChevronDownIcon, ChevronRightIcon
} from '@heroicons/react/outline';

const BillManagementMobile = () => {
  // Refs for focus management
  const voucherInputRef = useRef(null);
  const onlineBillRefs = useRef([]);
  const receivedBillRefs = useRef([]);
  const pendingBillRefs = useRef([]);
  
  // State for active panel
  const [activeKey, setActiveKey] = useState('1');
  
  // State for demand and voucher
  const [demand, setDemand] = useState(0);
  const [voucher, setVoucher] = useState(0);
  
  // State for bill lists
  const [onlineBills, setOnlineBills] = useState([{ amount: 0, description: '' }]);
  const [receivedBills, setReceivedBills] = useState([{ amount: 0, description: '' }]);
  const [pendingBills, setPendingBills] = useState([{ amount: 0, description: '' }]);

  // State for notifications
  const [notification, setNotification] = useState({ show: false, message: '', description: '' });

  // Calculate totals
  const onlineTotal = onlineBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const receivedTotal = receivedBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const pendingTotal = pendingBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  
  // Calculate result based on formula: demand - pendingTotal + receivedTotal - onlineTotal - voucher
  const result = Number(demand || 0) - pendingTotal + receivedTotal - onlineTotal - Number(voucher || 0);

  // Show notification
  const showNotification = (message, description) => {
    setNotification({ show: true, message, description });
    
    // Auto hide after 2 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', description: '' });
    }, 2000);
  };

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
      showNotification('Online bill removed', 'The bill has been removed successfully.');
    } else if (category === 'received') {
      setReceivedBills(receivedBills.filter((_, i) => i !== index));
      showNotification('Received bill removed', 'The bill has been removed successfully.');
    } else if (category === 'pending') {
      setPendingBills(pendingBills.filter((_, i) => i !== index));
      showNotification('Pending bill removed', 'The bill has been removed successfully.');
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
      return onlineBillRefs.current[index].querySelector('input[type="number"]');
    }
    if (category === 'received' && receivedBillRefs.current[index]) {
      return receivedBillRefs.current[index].querySelector('input[type="number"]');
    }
    if (category === 'pending' && pendingBillRefs.current[index]) {
      return pendingBillRefs.current[index].querySelector('input[type="number"]');
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
    showNotification('Data Saved', 'Your bill management data has been saved successfully.');
  };

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
          className="mb-3"
          ref={el => refArray.current[index] = el}
        >
          <div className="flex flex-col space-y-2 w-full">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Bill Description"
                value={bill.description}
                onChange={(e) => updateBill(category, index, 'description', e.target.value)}
                onKeyPress={(e) => handleDescriptionKeyPress(e, category, index, isLast)}
                autoComplete="off"
              />
              <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="relative w-3/4">
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Amount"
                  value={bill.amount}
                  onChange={(e) => updateBill(category, index, 'amount', e.target.value === '' ? 0 : Number(e.target.value))}
                  onKeyPress={(e) => handleAmountKeyPress(e, category, index, isLast)}
                  autoComplete="off"
                />
                <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <button 
                className="flex items-center justify-center p-2 rounded-full text-red-500 hover:bg-red-100 transition-all"
                onClick={() => removeBill(category, index)}
              >
                <MinusCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  // Render the panel for each bill category
  const renderPanel = (key, title, icon, bgColor, borderColor, textColor, bills, category) => {
    const isActive = activeKey === key;
    const totalAmount = category === 'online' ? onlineTotal : 
                        category === 'received' ? receivedTotal : 
                        pendingTotal;
    
    return (
      <div className={`mb-4 rounded-lg overflow-hidden border ${borderColor}`}>
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer ${bgColor}`}
          onClick={() => setActiveKey(isActive ? null : key)}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{title}</span>
            <span className="text-gray-500 text-sm">({totalAmount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all"
              onClick={(e) => {
                e.stopPropagation();
                moveToNextSection();
              }}
            >
              <span className="text-sm font-medium">Next</span>
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </button>
            {isActive ? 
              <ChevronDownIcon className={`h-5 w-5 ${textColor}`} /> : 
              <ChevronRightIcon className={`h-5 w-5 ${textColor}`} />
            }
          </div>
        </div>
        
        {isActive && (
          <div className="p-4 bg-white">
            {renderBillItems(category, bills)}
            <button 
              className="flex items-center justify-center w-full p-3 mt-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-500 transition-all"
              onClick={() => addBill(category)}
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <span>Add {title}</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <h4 className="font-bold">{notification.message}</h4>
            <p className="text-sm">{notification.description}</p>
          </div>
        </div>
      )}
      
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
            <div className="flex justify-center mb-2">
              <CalculatorIcon className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold">Bill Management</h1>
          </div>
          
          {/* Main Content */}
          <div className="p-4">
            {/* Demand and Voucher Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demand</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter Demand"
                    value={demand}
                    onChange={(e) => setDemand(e.target.value === '' ? 0 : Number(e.target.value))}
                    onKeyPress={handleDemandKeyPress}
                    autoComplete="off"
                  />
                  <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voucher</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter Voucher"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value === '' ? 0 : Number(e.target.value))}
                    ref={voucherInputRef}
                    onKeyPress={handleVoucherKeyPress}
                    autoComplete="off"
                  />
                  <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4 text-gray-500 text-sm">
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              <span>Press Enter to navigate between fields</span>
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </div>

            {/* Bill Management Sections */}
            {renderPanel(
              '1',
              'Online Bills',
              <CreditCardIcon className="h-5 w-5 text-blue-500" />,
              'bg-blue-50',
              'border-blue-200',
              'text-blue-500',
              onlineBills,
              'online'
            )}
            
            {renderPanel(
              '2',
              'Received Bills',
              <ClipboardCheckIcon className="h-5 w-5 text-green-500" />,
              'bg-green-50',
              'border-green-200',
              'text-green-500',
              receivedBills,
              'received'
            )}
            
            {renderPanel(
              '3',
              'Pending Bills',
              <DocumentTextIcon className="h-5 w-5 text-orange-500" />,
              'bg-orange-50',
              'border-orange-200',
              'text-orange-500',
              pendingBills,
              'pending'
            )}

            {/* Summary Section */}
            <div id="summary-section" className="mt-8">
              <h2 className="text-lg font-bold mb-3">Summary</h2>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <div className="flex justify-between p-3">
                    <span>Demand</span>
                    <span className="font-medium">{demand}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Pending Bills (-)</span>
                    <span className="font-medium text-red-500">-{pendingTotal}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Received Bills (+)</span>
                    <span className="font-medium text-green-500">+{receivedTotal}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Online Bills (-)</span>
                    <span className="font-medium text-red-500">-{onlineTotal}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Voucher (-)</span>
                    <span className="font-medium text-red-500">-{voucher}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50">
                    <span className="font-bold">Final Result</span>
                    <span className="font-bold">{result}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-center text-white">
              <h3 className="text-lg font-bold mb-2">Final Calculation</h3>
              <div className="text-3xl font-bold mb-2">{result}</div>
              <div className="text-xs opacity-75">
                Demand - Pending + Received - Online - Voucher
              </div>
            </div>

            {/* Save Button */}
            <button
              className="flex items-center justify-center w-full p-4 mt-6 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all"
              onClick={saveData}
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Save All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillManagementMobile;