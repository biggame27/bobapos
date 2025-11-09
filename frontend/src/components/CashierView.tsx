import { Link } from 'react-router-dom';

function CashierView() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'normal', marginBottom: '20px' }}>Cashier View</h1>
      <Link to="/" style={{ color: '#000', textDecoration: 'none' }}>Back to Home</Link>
    </div>
  );
}

export default CashierView;

