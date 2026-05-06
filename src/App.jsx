import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import LeadForm from './pages/LeadForm';

const PrivateLayout = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          <Route path="/leads" element={<PrivateLayout><Leads /></PrivateLayout>} />
          <Route path="/leads/new" element={<PrivateLayout><LeadForm /></PrivateLayout>} />
          <Route path="/leads/:id" element={<PrivateLayout><LeadDetail /></PrivateLayout>} />
          <Route path="/leads/:id/edit" element={<PrivateLayout><LeadForm /></PrivateLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}