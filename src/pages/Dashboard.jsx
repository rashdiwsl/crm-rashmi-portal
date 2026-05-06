import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Star, Trophy, XCircle, PlusCircle, ArrowRight, Phone } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  );

  const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

  const cards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'bg-blue-600' },
    { label: 'New Leads', value: stats.newLeads, icon: PlusCircle, color: 'bg-indigo-600' },
    { label: 'Qualified', value: stats.qualified, icon: Star, color: 'bg-amber-500' },
    { label: 'Won', value: stats.won, icon: Trophy, color: 'bg-emerald-600' },
    { label: 'Lost', value: stats.lost, icon: XCircle, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Sales pipeline overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5 text-white`}>
            <Icon size={20} className="mb-3 opacity-80" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs opacity-75 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-gray-400" />
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Total Pipeline Value</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">LKR {stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Across all leads</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Won Deal Value</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">LKR {stats.wonValue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Successfully closed</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-blue-500" />
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Win Rate</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{winRate}%</p>
          <p className="text-xs text-gray-400 mt-2">{stats.won} won out of {stats.total} total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/leads/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            <PlusCircle size={15} />
            New Lead
          </button>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
          >
            View All Leads
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}