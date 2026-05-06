import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
];

export default function Sidebar() {
  const [leadCount, setLeadCount] = useState(null);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setLeadCount(res.data.total))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-60 bg-gray-950 min-h-screen flex flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <h1 className="text-lg font-bold text-white tracking-tight">CRM Portal</h1>
        <p className="text-xs text-gray-500 mt-0.5">Lead Management</p>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {label === 'Leads' && leadCount !== null && (
              <span className="bg-gray-800 text-gray-400 text-xs px-1.5 py-0.5 rounded-full">
                {leadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">v1.0.0</p>
      </div>
    </aside>
  );
}