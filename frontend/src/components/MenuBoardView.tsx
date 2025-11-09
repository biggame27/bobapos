import { Link } from 'react-router-dom';

function MenuBoardView() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'normal', marginBottom: '20px' }}>Menu Board View</h1>
      <Link to="/" style={{ color: '#000', textDecoration: 'none' }}>Back to Home</Link>
    </div>
  );
}

export default MenuBoardView;

