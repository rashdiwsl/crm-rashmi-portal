import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Send, Trash2, User, Mail, Phone, Briefcase, DollarSign, Calendar } from 'lucide-react';
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

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading...</div>;
  if (!lead) return <div className="p-6 text-sm text-gray-400">Lead not found.</div>;

  const details = [
    { label: 'Email', value: lead.email, icon: Mail },
    { label: 'Phone', value: lead.phone, icon: Phone },
    { label: 'Lead Source', value: lead.lead_source, icon: Briefcase },
    { label: 'Assigned To', value: lead.assigned_to, icon: User },
    { label: 'Deal Value', value: `LKR ${lead.deal_value?.toLocaleString()}`, icon: DollarSign },
    { label: 'Created', value: new Date(lead.created_at).toLocaleDateString(), icon: Calendar },
    { label: 'Last Updated', value: new Date(lead.updated_at).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
      >
        <ArrowLeft size={15} />
        Back to Leads
      </button>

      {/* Lead header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-5">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{lead.lead_name}</h1>
            <p className="text-gray-400 text-sm mt-0.5 truncate">{lead.company_name}</p>
            <div className="mt-3">
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
          <button
            onClick={() => navigate(`/leads/${id}/edit`)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 md:px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition flex-shrink-0"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit Lead</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>

        {/* Details grid — 1 col on mobile, 2 on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          {details.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Notes</h2>

        <form onSubmit={addNote} className="flex gap-2 mb-6">
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex-shrink-0"
          >
            <Send size={14} />
            <span className="hidden sm:inline">{submitting ? 'Adding...' : 'Add'}</span>
          </button>
        </form>

        {lead.notes?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No notes yet. Add the first one above.</p>
        ) : (
          <div className="space-y-3">
            {lead.notes?.map(n => (
              <div key={n.id} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-800">{n.content}</p>
                <div className="flex justify-between items-center mt-3 gap-2">
                  <p className="text-xs text-gray-400 truncate">
                    {n.created_by} · {new Date(n.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}