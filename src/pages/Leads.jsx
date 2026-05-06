import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import LeadStatusBadge from '../components/LeadStatusBadge';

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['', 'Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];
const SALESPEOPLE = ['', 'Admin User', 'Rashmi Silva'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const navigate = useNavigate();

  const fetchLeads = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (source) params.source = source;
    if (assignedTo) params.assigned_to = assignedTo;
    api.get('/leads', { params }).then(res => {
      setLeads(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchLeads(); }, [search, status, source, assignedTo]);

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-400 mt-1">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => navigate('/leads/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Lead</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, company, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s || 'All Sources'}</option>)}
            </select>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              {SALESPEOPLE.map(s => <option key={s} value={s}>{s || 'All Salespeople'}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Deal Value</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{lead.lead_name}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{lead.company_name}</td>
                    <td className="px-5 py-4"><LeadStatusBadge status={lead.status} /></td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{lead.lead_source}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{lead.assigned_to}</td>
                    <td className="px-5 py-4 text-gray-700 font-medium whitespace-nowrap">LKR {lead.deal_value?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/leads/${lead.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}