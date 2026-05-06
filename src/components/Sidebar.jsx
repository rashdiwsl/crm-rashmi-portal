import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '📊 Dashboard' },
  { to: '/leads', label: '👥 Leads' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-900 min-h-screen p-4">
      <nav className="space-y-1 mt-4">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}