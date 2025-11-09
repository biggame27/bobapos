import { useState, useEffect } from 'react';
import { getAllMenuItems } from '../api/menuApi';
import type { MenuItem } from '../api/menuApi';
import { createOrder } from '../api/orderApi';
import Button from './ui/Button';

interface OrderItem {
  menuitemid: number;
  quantity: number;
  name: string;
  price: number;
}

function CashierView() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await getAllMenuItems();
      setMenuItems(items);
      setStatus('Connected to database');
    } catch (err) {
      setStatus('Error: Could not connect to server');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToOrder = () => {
    if (!selectedMenuItem) {
      alert('Please select a menu item');
      return;
    }

    const orderItem: OrderItem = {
      menuitemid: selectedMenuItem.menuitemid,
      quantity: quantity,
      name: selectedMenuItem.menuitemname,
      price: selectedMenuItem.price
    };

    setCurrentOrder([...currentOrder, orderItem]);
    setSelectedMenuItem(null);
  };

  const clearOrder = () => {
    setCurrentOrder([]);
    setCustomerName('');
  };

  const getTotal = () => {
    return currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const submitOrder = async () => {
    if (currentOrder.length === 0) {
      alert('Order is empty');
      return;
    }

    try {
      const orderData = {
        timeoforder: new Date().toISOString(),
        customerid: null,
        employeeid: 1,
        totalcost: getTotal(),
        orderweek: getCurrentWeek(),
        orderItems: currentOrder.map(item => ({
          menuitemid: item.menuitemid,
          quantity: item.quantity
        }))
      };

      const result = await createOrder(orderData);
      alert(`Order #${result.orderid} submitted successfully!\nTotal: $${getTotal().toFixed(2)}`);
      clearOrder();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Insufficient inventory')) {
        alert('Cannot fulfill this order due to insufficient inventory.\nPlease check stock levels and try again.');
      } else {
        alert(`Failed to submit order: ${errorMessage}`);
      }
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button to="/">← Back to Menu</Button>
          <h1 style={{ fontSize: '24px', fontWeight: 'normal', margin: 0 }}>Cashier Order System</h1>
          <div style={{ width: '120px' }}></div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Left Panel - Menu Items */}
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'normal', marginTop: 0, marginBottom: '10px' }}>Menu Items</h2>
          {loading ? (
            <p>Loading menu items...</p>
          ) : (
            <>
              <div style={{ border: '1px solid #ddd', height: '300px', overflowY: 'auto', marginBottom: '10px', padding: '5px' }}>
                {menuItems.map((item) => (
                  <div
                    key={item.menuitemid}
                    onClick={() => setSelectedMenuItem(item)}
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedMenuItem?.menuitemid === item.menuitemid ? '#f0f0f0' : '#ffffff',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    {item.menuitemname} - ${item.price.toFixed(2)}
                  </div>
                ))}
              </div>
              <Button onClick={addToOrder} style={{ width: '100%' }}>
                Add to Order
              </Button>
            </>
          )}
        </div>

        {/* Center Panel - Current Order */}
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'normal', marginTop: 0, marginBottom: '10px' }}>Current Order</h2>
          <div style={{ border: '1px solid #ddd', height: '250px', overflowY: 'auto', marginBottom: '10px', padding: '5px' }}>
            {currentOrder.length === 0 ? (
              <div style={{ color: '#888', padding: '10px' }}>No items in order</div>
            ) : (
              currentOrder.map((item, index) => (
                <div key={index} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                </div>
              ))
            )}
          </div>
          <div style={{ marginBottom: '10px', textAlign: 'right', fontSize: '16px', fontWeight: 'bold' }}>
            Total: ${getTotal().toFixed(2)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Button onClick={clearOrder}>
              Clear Order
            </Button>
            <Button onClick={submitOrder} style={{ fontWeight: 'bold' }}>
              Submit Order
            </Button>
          </div>
        </div>

        {/* Right Panel - Order Details */}
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'normal', marginTop: 0, marginBottom: '20px' }}>Order Details</h2>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Customer Name (Optional):</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              placeholder="Enter customer name"
            />
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '12px', color: '#666' }}>
        Status: {status}
      </div>
    </div>
  );
}

export default CashierView;

