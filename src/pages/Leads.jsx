import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    if (assignedTo)  { params.assigned_to = assignedTo; }
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <button
          onClick={() => navigate('/leads/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Lead
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name, company, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select
  value={assignedTo}
  onChange={e => setAssignedTo(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {SALESPEOPLE.map(s => <option key={s} value={s}>{s || 'All Salespeople'}</option>)}
</select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No leads found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Deal Value</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{lead.lead_name}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.company_name}</td>
                  <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-gray-600">{lead.lead_source}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.assigned_to}</td>
                  <td className="px-4 py-3 text-gray-600">LKR {lead.deal_value?.toLocaleString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="text-blue-600 hover:underline"
                    >View</button>
                    <button
                      onClick={() => navigate(`/leads/${lead.id}/edit`)}
                      className="text-yellow-600 hover:underline"
                    >Edit</button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-red-600 hover:underline"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}