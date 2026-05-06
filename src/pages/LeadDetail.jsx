import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import LeadStatusBadge from '../components/LeadStatusBadge';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLead = () => {
    api.get(`/leads/${id}`).then(res => {
      setLead(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchLead(); }, [id]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    await api.post(`/leads/${id}/notes`, { content: note });
    setNote('');
    fetchLead();
    setSubmitting(false);
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Delete this note?')) return;
    await api.delete(`/notes/${noteId}`);
    fetchLead();
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!lead) return <div className="p-8 text-gray-500">Lead not found.</div>;

  const details = [
    { label: 'Email', value: lead.email },
    { label: 'Phone', value: lead.phone },
    { label: 'Lead Source', value: lead.lead_source },
    { label: 'Assigned To', value: lead.assigned_to },
    { label: 'Deal Value', value: `LKR ${lead.deal_value?.toLocaleString()}` },
    { label: 'Created', value: new Date(lead.created_at).toLocaleDateString() },
    { label: 'Last Updated', value: new Date(lead.updated_at).toLocaleDateString() },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lead.lead_name}</h1>
          <p className="text-gray-500">{lead.company_name}</p>
        </div>
        <div className="flex gap-2">
          <LeadStatusBadge status={lead.status} />
          <button
            onClick={() => navigate(`/leads/${id}/edit`)}
            className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-600 transition"
          >Edit</button>
          <button
            onClick={() => navigate('/leads')}
            className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
          >Back</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lead Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {details.map(d => (
            <div key={d.label}>
              <p className="text-xs text-gray-400 uppercase">{d.label}</p>
              <p className="text-gray-800 font-medium">{d.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Notes</h2>

        <form onSubmit={addNote} className="flex gap-2 mb-6">
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        {lead.notes?.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {lead.notes?.map(n => (
              <div key={n.id} className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 text-sm">{n.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    {n.created_by} · {new Date(n.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}