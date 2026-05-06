import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const fields = [
    { name: 'lead_name', label: 'Lead Name', type: 'text', required: true },
    { name: 'company_name', label: 'Company Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'text' },
    { name: 'assigned_to', label: 'Assigned Salesperson', type: 'text' },
    { name: 'deal_value', label: 'Estimated Deal Value (LKR)', type: 'number' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Lead' : 'Create New Lead'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required={f.required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
          <select name="lead_source" value={form.lead_source} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
          <button type="button" onClick={() => navigate('/leads')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}