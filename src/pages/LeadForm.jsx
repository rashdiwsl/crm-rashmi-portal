import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    lead_name: '', company_name: '', email: '', phone: '',
    lead_source: 'Website', assigned_to: '', status: 'New', deal_value: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/leads/${id}`).then(res => {
        const l = res.data;
        setForm({
          lead_name: l.lead_name, company_name: l.company_name,
          email: l.email, phone: l.phone || '',
          lead_source: l.lead_source, assigned_to: l.assigned_to,
          status: l.status, deal_value: l.deal_value,
        });
      });
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/leads/${id}`, form);
      } else {
        await api.post('/leads', form);
      }
      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
      >
        <ArrowLeft size={15} />
        Back to Leads
      </button>

      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Lead' : 'New Lead'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {isEdit ? 'Update lead information' : 'Add a new lead to your pipeline'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-5">

        {/* 2 cols on sm+, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Lead Name *</label>
            <input type="text" name="lead_name" value={form.lead_name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Company Name *</label>
            <input type="text" name="company_name" value={form.company_name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Lead Source</label>
            <select name="lead_source" value={form.lead_source} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Assigned Salesperson</label>
            <input type="text" name="assigned_to" value={form.assigned_to} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value (LKR)</label>
            <input type="number" name="deal_value" value={form.deal_value} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            <Save size={14} />
            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
          <button type="button" onClick={() => navigate('/leads')}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}