import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Leads', value: stats.total, color: 'bg-blue-50 text-blue-700' },
    { label: 'New Leads', value: stats.newLeads, color: 'bg-purple-50 text-purple-700' },
    { label: 'Qualified', value: stats.qualified, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Won', value: stats.won, color: 'bg-green-50 text-green-700' },
    { label: 'Lost', value: stats.lost, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {cards.map(card => (
          <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
            <p className="text-sm font-medium opacity-75">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-gray-800">
            LKR {stats.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Won Deal Value</p>
          <p className="text-3xl font-bold text-green-600">
            LKR {stats.wonValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}