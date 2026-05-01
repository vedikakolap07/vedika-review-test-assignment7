import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Navigation/Header';
import Footer from '../components/Navigation/Footer';
import QRCode from 'react-qr-code';
import api from '../utils/api';

const Consult = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
      step1: { currentIllness: '', recentSurgery: '' },
      step2: { diabetic: 'non-diabetic', allergies: '', others: '' },
      step3: { transactionId: '' },
    });
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const qrValue = useMemo(
      () => `upi://pay?pa=medscript@upi&pn=MedScript&am=500&cu=INR&tn=Consultation%20with%20Doctor%20${doctorId || ''}`,
      [doctorId]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (!doctorId) {
              throw new Error('Missing doctor id. Please go back and select a doctor again.');
            }
            const payload = {
              doctorId,
              step1: form.step1,
              step2: form.step2,
              step3: form.step3,
            };
            const { res, json } = await api.postJson('/api/consultations', payload);
            if (!res.ok) throw new Error(json?.msg || json?.error || 'Failed to submit consultation');
            setMessage('Consultation submitted successfully.');
            navigate('/patient/dashboard');
        } catch (err: any) {
            setMessage(err.message || 'Error creating consultation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>  
            <Header />
            <main className="page-wrapper">
                <div className="consult-page fade-up">
                    <h2>Consultation Form</h2>
                    <p style={{ marginBottom: '1rem' }}>Doctor ID: {doctorId}</p>

                    <div className="step-indicator">
                      <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                      <div className={`step-line ${step > 1 ? 'done' : ''}`} />
                      <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                      <div className={`step-line ${step > 2 ? 'done' : ''}`} />
                      <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>

                    <form className="consult-card" onSubmit={handleSubmit}>
                        {step === 1 && (
                          <>
                            <h3>Step 1: Illness and surgery history</h3>
                            <div className="form-group">
                                <label>Current Illness History</label>
                                <textarea
                                  value={form.step1.currentIllness}
                                  onChange={(e) => setForm({ ...form, step1: { ...form.step1, currentIllness: e.target.value } })}
                                  required
                                />
                            </div>
                            <div className="form-group">
                                <label>Recent Surgery (include time span)</label>
                                <textarea
                                  value={form.step1.recentSurgery}
                                  onChange={(e) => setForm({ ...form, step1: { ...form.step1, recentSurgery: e.target.value } })}
                                  required
                                />
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <h3>Step 2: Family medical history</h3>
                            <div className="form-group">
                              <label>Diabetics or Non-Diabetics</label>
                              <div className="radio-group">
                                <label className={`radio-option ${form.step2.diabetic === 'diabetic' ? 'selected' : ''}`}>
                                  <input
                                    type="radio"
                                    name="diabetic"
                                    checked={form.step2.diabetic === 'diabetic'}
                                    onChange={() => setForm({ ...form, step2: { ...form.step2, diabetic: 'diabetic' } })}
                                  />
                                  Diabetic
                                </label>
                                <label className={`radio-option ${form.step2.diabetic === 'non-diabetic' ? 'selected' : ''}`}>
                                  <input
                                    type="radio"
                                    name="diabetic"
                                    checked={form.step2.diabetic === 'non-diabetic'}
                                    onChange={() => setForm({ ...form, step2: { ...form.step2, diabetic: 'non-diabetic' } })}
                                  />
                                  Non-Diabetic
                                </label>
                              </div>
                            </div>
                            <div className="form-group">
                                <label>Any Allergies</label>
                                <input
                                  type="text"
                                  value={form.step2.allergies}
                                  onChange={(e) => setForm({ ...form, step2: { ...form.step2, allergies: e.target.value } })}
                                  required
                                />
                            </div>
                            <div className="form-group">
                                <label>Others</label>
                                <textarea
                                  value={form.step2.others}
                                  onChange={(e) => setForm({ ...form, step2: { ...form.step2, others: e.target.value } })}
                                />
                            </div>
                          </>
                        )}

                        {step === 3 && (
                          <>
                            <h3>Step 3: Payment and transaction</h3>
                            <div className="qr-section">
                              <div className="qr-box">
                                <QRCode value={qrValue} size={180} />
                              </div>
                              <div className="qr-hint">Scan QR and complete payment before submitting.</div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Transaction ID</label>
                                <input
                                  type="text"
                                  value={form.step3.transactionId}
                                  onChange={(e) => setForm({ ...form, step3: { transactionId: e.target.value } })}
                                  required
                                />
                            </div>
                          </>
                        )}

                        {message && (
                          <div className={message.includes('successfully') ? 'form-success-box' : 'form-error-box'}>
                            {message}
                          </div>
                        )}

                        <div className="step-nav">
                          <button
                            className="btn btn-ghost"
                            type="button"
                            disabled={step === 1}
                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                          >
                            Back
                          </button>

                          {step < 3 ? (
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={() => setStep((s) => Math.min(3, s + 1))}
                            >
                              Next
                            </button>
                          ) : (
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Consultation'}
                            </button>
                          )}
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Consult;