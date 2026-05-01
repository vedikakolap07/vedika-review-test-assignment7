import React from 'react';
import Header from '../components/Navigation/Header';
import Footer from '../components/Navigation/Footer';
import api from '../utils/api';

type PrescriptionItem = {
  _id: string;
  care: string;
  medicines?: string;
  sentToPatient: boolean;
  createdAt: string;
  consultation: {
    _id: string;
    step1?: { currentIllness?: string; recentSurgery?: string };
    step2?: { diabetic?: string; allergies?: string; others?: string };
    step3?: { transactionId?: string };
    doctor?: {
      name: string;
      specialty: string;
      avatarUrl?: string;
    };
  };
};

const DoctorPrescriptions = () => {
    const [list, setList] = React.useState<PrescriptionItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const load = async () => {
        try {
          const { res, json } = await api.getJson('/api/prescriptions/patient');
          if (!res.ok) throw new Error(json?.msg || json?.error || 'Failed to load prescriptions');
          setList(json);
        } catch (err: any) {
          setError(err.message || 'Unable to load prescriptions');
        } finally {
          setLoading(false);
        }
      };
      load();
    }, []);

    return (
        <>  
            <Header />
            <main className="page-wrapper">
                <div className="page-header">
                    <h1>My Prescriptions</h1>
                </div>
                {loading ? (
                  <div className="loading-center"><div className="spinner" /></div>
                ) : error ? (
                  <div className="form-error-box">{error}</div>
                ) : list.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💊</div>
                    <h3>No prescriptions yet</h3>
                    <p>After doctor sends a prescription, it will appear here.</p>
                  </div>
                ) : (
                  <div className="consultation-list">
                    {list.map((item) => (
                      <div className="patient-pres-card fade-up" key={item._id}>
                        <div className="patient-pres-header">
                          <div>
                            <div style={{ fontWeight: 700 }}>Dr. {item.consultation?.doctor?.name || 'Doctor'}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {item.consultation?.doctor?.specialty || 'Specialist'} · {new Date(item.createdAt).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          <span className="badge badge-sent">Sent</span>
                        </div>
                        <div className="patient-pres-body">
                          <div className="detail-block" style={{ marginBottom: '0.8rem' }}>
                            <div className="detail-label">Care To Be Taken</div>
                            <div className="detail-val">{item.care}</div>
                          </div>
                          <div className="detail-block">
                            <div className="detail-label">Medicines</div>
                            <div className="detail-val">
                              {item.medicines
                                ? (
                                  <ul className="medicine-list">
                                    {item.medicines.split(',').filter(Boolean).map((m) => <li key={m.trim()}>{m.trim()}</li>)}
                                  </ul>
                                )
                                : 'No medicines added'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default DoctorPrescriptions;