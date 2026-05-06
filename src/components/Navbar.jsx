import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-600">CRM Portal</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">👤 {user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition"
        >Logout</button>
      </div>
    </nav>
  );
}