import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { jsPDF } from 'jspdf';

type Patient = { _id: string; name: string; email: string; phone: string };
type Consultation = {
  _id: string;
  patient: Patient;
  step1: { currentIllness: string; recentSurgery: string };
  step2: { diabetic: string; allergies: string; others: string };
  step3: { transactionId: string };
  createdAt: string;
};
type Prescription = {
  _id: string;
  consultation: string;
  care: string;
  medicines: string;
  pdfUrl?: string;
  sentToPatient: boolean;
};

const DoctorPrescriptions = () => {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Record<string, Prescription>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-consultation form state
  const [forms, setForms] = useState<Record<string, { care: string; medicines: string }>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<Record<string, { text: string; type: 'success' | 'error' }>>({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, pRes] = await Promise.all([
        api.getJson('/api/consultations/doctor'),
        api.getJson('/api/prescriptions/doctor'),
      ]);
      const cJson: Consultation[] = cRes.json;
      const pJson: Prescription[] = pRes.json;

      if (cRes.res.ok) setConsultations(cJson);
      else setError((cJson as any)?.msg || (cJson as any)?.error || 'Failed to load consultations');

      if (pRes.res.ok) {
        const map: Record<string, Prescription> = {};
        pJson.forEach(p => { map[p.consultation as unknown as string] = p; });
        setPrescriptions(map);
        // Pre-fill forms for existing prescriptions
        const prefill: Record<string, { care: string; medicines: string }> = {};
        pJson.forEach(p => {
          prefill[p.consultation as unknown as string] = { care: p.care, medicines: p.medicines || '' };
        });
        setForms(f => ({ ...f, ...prefill }));
      }
    } catch (e: any) {
      setError(e?.message || 'Unable to load consultations. Ensure backend is running and you are logged in as doctor.');
    } finally {
      setLoading(false);
    }
  };

  const getForm = (cId: string) => forms[cId] || { care: '', medicines: '' };

  const setForm = (cId: string, val: { care: string; medicines: string }) => {
    setForms(f => ({ ...f, [cId]: val }));
  };

  const showMsg = (cId: string, text: string, type: 'success' | 'error') => {
    setMsg(m => ({ ...m, [cId]: { text, type } }));
    setTimeout(() => setMsg(m => { const n = { ...m }; delete n[cId]; return n; }), 3500);
  };

  // Generate and return a downloadable PDF URL.
  const generatePDF = (consult: Consultation, form: { care: string; medicines: string }): string => {
    const doc = new jsPDF();
    let y = 16;
    const print = (text: string, gap = 8) => {
      doc.text(text, 14, y);
      y += gap;
    };
    const printBlock = (title: string, value: string) => {
      print(`${title}:`, 6);
      const lines = doc.splitTextToSize(value || '—', 180);
      doc.text(lines, 14, y);
      y += Math.max(8, lines.length * 6);
      y += 2;
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    print('Prescription', 10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    print(`Date: ${new Date(consult.createdAt).toLocaleDateString('en-IN')}`);
    print(`Doctor: Dr. ${user?.name || ''}`);
    print(`Patient: ${consult.patient?.name || ''}`);
    print(`Email: ${consult.patient?.email || ''}`, 10);

    doc.setFont('helvetica', 'bold');
    print('Consultation Details', 8);
    doc.setFont('helvetica', 'normal');
    printBlock('Current Illness', consult.step1?.currentIllness || '—');
    printBlock('Recent Surgery', consult.step1?.recentSurgery || '—');
    printBlock('Diabetic Status', consult.step2?.diabetic || '—');
    printBlock('Allergies', consult.step2?.allergies || '—');
    printBlock('Others', consult.step2?.others || '—');
    printBlock('Transaction ID', consult.step3?.transactionId || '—');

    doc.setFont('helvetica', 'bold');
    print('Prescription', 8);
    doc.setFont('helvetica', 'normal');
    printBlock('Care to be taken', form.care || '—');
    printBlock('Medicines', form.medicines || '—');

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  };

  const handleSave = async (consult: Consultation, isEdit: boolean) => {
    const cId = consult._id;
    const form = getForm(cId);
    if (!form.care.trim()) { showMsg(cId, 'Care field is required', 'error'); return; }

    setSubmitting(s => ({ ...s, [cId]: true }));
    try {
      const pdfUrl = generatePDF(consult, form);
      let res;
      if (isEdit && prescriptions[cId]) {
        res = await api.put(`/api/prescriptions/${prescriptions[cId]._id}`, { care: form.care, medicines: form.medicines, pdfUrl });
      } else {
        res = await api.post(`/api/prescriptions/${cId}`, { care: form.care, medicines: form.medicines, pdfUrl });
      }
      const json = await (async () => {
        try { return await res.json(); } catch { return await res.text(); }
      })();
      if (!res.ok) throw new Error((json as any)?.msg || (json as any)?.error || 'Failed');
      setPrescriptions(p => ({ ...p, [cId]: json as any }));

      // Auto-download PDF
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `prescription-${consult.patient?.name?.replace(/\s/g,'_')}-${cId.slice(-5)}.pdf`;
      a.click();

      showMsg(cId, isEdit ? 'Prescription updated & downloaded!' : 'Prescription saved & downloaded!', 'success');
    } catch (e: any) {
      showMsg(cId, e.message || 'Error saving', 'error');
    } finally {
      setSubmitting(s => ({ ...s, [cId]: false }));
    }
  };

  const handleSend = async (cId: string) => {
    const pres = prescriptions[cId];
    if (!pres) { showMsg(cId, 'Save prescription first', 'error'); return; }
    setSubmitting(s => ({ ...s, [`send_${cId}`]: true }));
    try {
      const res = await api.post(`/api/prescriptions/${pres._id}/send`, {});
      if (!res.ok) throw new Error('Send failed');
      setPrescriptions(p => ({ ...p, [cId]: { ...p[cId], sentToPatient: true } }));
      showMsg(cId, 'Prescription sent to patient!', 'success');
    } catch (e: any) {
      showMsg(cId, e.message || 'Error sending', 'error');
    } finally {
      setSubmitting(s => ({ ...s, [`send_${cId}`]: false }));
    }
  };

  const handleDownload = (consult: Consultation) => {
    const form = getForm(consult._id);
    const url = generatePDF(consult, form);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${consult.patient?.name?.replace(/\s/g,'_')}.pdf`;
    a.click();
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">MedScript</div>
        <div className="navbar-right">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/profile')}>← Profile</button>
          <button className="btn btn-outline btn-sm" onClick={() => { signOut(); navigate('/doctor/signin'); }}>Sign Out</button>
        </div>
      </nav>

      <div className="page-wrapper">
        <div className="page-header">
          <h1>Prescriptions</h1>
          <p>Review patient consultations and write prescriptions</p>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="form-error-box">{error}</div>
        ) : consultations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No consultations yet</h3>
            <p>Patients who consult you will appear here</p>
          </div>
        ) : (
          <div className="consultation-list">
            {consultations.map(c => {
              const pres = prescriptions[c._id];
              const isExpanded = expanded === c._id;
              const form = getForm(c._id);
              const hasPres = !!pres;

              return (
                <div key={c._id} className="consultation-item fade-up">
                  {/* Header — clickable to expand */}
                  <div className="consult-header" onClick={() => setExpanded(isExpanded ? null : c._id)}>
                    <div className="consult-patient-info">
                      <div className="consult-patient-avatar">
                        {c.patient?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="consult-patient-name">{c.patient?.name}</div>
                        <div className="consult-patient-meta">
                          {c.patient?.email} · {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div className="consult-status">
                      {pres?.sentToPatient
                        ? <span className="badge badge-sent">Sent</span>
                        : hasPres
                        ? <span className="badge badge-done">Prescribed</span>
                        : <span className="badge badge-pending">Pending</span>}
                      <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="consult-body">
                      {/* Patient details */}
                      <div className="consult-detail-grid">
                        <div className="detail-block">
                          <div className="detail-label">Current Illness</div>
                          <div className="detail-val">{c.step1?.currentIllness || '—'}</div>
                        </div>
                        <div className="detail-block">
                          <div className="detail-label">Recent Surgery</div>
                          <div className="detail-val">{c.step1?.recentSurgery || '—'}</div>
                        </div>
                        <div className="detail-block">
                          <div className="detail-label">Family — Diabetic</div>
                          <div className="detail-val">{c.step2?.diabetic || '—'}</div>
                        </div>
                        <div className="detail-block">
                          <div className="detail-label">Allergies</div>
                          <div className="detail-val">{c.step2?.allergies || '—'}</div>
                        </div>
                        {c.step2?.others && (
                          <div className="detail-block">
                            <div className="detail-label">Others</div>
                            <div className="detail-val">{c.step2.others}</div>
                          </div>
                        )}
                        <div className="detail-block">
                          <div className="detail-label">Transaction ID</div>
                          <div className="detail-val">{c.step3?.transactionId || '—'}</div>
                        </div>
                      </div>

                      {/* Notification message */}
                      {msg[c._id] && (
                        <div className={msg[c._id].type === 'success' ? 'form-success-box' : 'form-error-box'}>
                          {msg[c._id].text}
                        </div>
                      )}

                      {/* Prescription Form */}
                      <div className="prescription-form-box">
                        <h4>✍️ {hasPres ? 'Edit Prescription' : 'Write Prescription'}</h4>

                        <div className="form-group">
                          <label>Care to be Taken <span style={{ color: 'var(--error)' }}>*</span></label>
                          <textarea
                            rows={3}
                            placeholder="e.g. Rest for 5 days, avoid cold water, take medicines after food..."
                            value={form.care}
                            onChange={e => setForm(c._id, { ...form, care: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>Medicines <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(comma separated)</span></label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Paracetamol 500mg, Azithromycin 250mg, Cetirizine 10mg"
                            value={form.medicines}
                            onChange={e => setForm(c._id, { ...form, medicines: e.target.value })}
                          />
                          {/* Medicine tags preview */}
                          {form.medicines && (
                            <div className="tags-panel" style={{ marginTop: '0.5rem' }}>
                              {form.medicines.split(',').filter(Boolean).map((m, i) => (
                                <span key={i} className="tag">{m.trim()}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pres-actions">
                          <button
                            className="btn btn-primary"
                            style={{ width: 'auto' }}
                            disabled={submitting[c._id]}
                            onClick={() => handleSave(c, hasPres)}
                          >
                            {submitting[c._id]
                              ? 'Saving...'
                              : hasPres
                              ? '💾 Update & Download PDF'
                              : '💾 Save & Download PDF'}
                          </button>

                          {hasPres && (
                            <>
                              <button
                                className="btn btn-outline"
                                style={{ width: 'auto' }}
                                onClick={() => handleDownload(c)}
                              >
                                ⬇️ Download PDF
                              </button>
                              <button
                                className="btn btn-accent"
                                style={{ width: 'auto' }}
                                disabled={submitting[`send_${c._id}`] || pres.sentToPatient}
                                onClick={() => handleSend(c._id)}
                              >
                                {submitting[`send_${c._id}`]
                                  ? 'Sending...'
                                  : pres.sentToPatient
                                  ? '✅ Sent'
                                  : '📤 Send to Patient'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;