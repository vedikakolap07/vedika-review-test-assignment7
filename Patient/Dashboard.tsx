import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Navigation/Header';
import Footer from '../components/Navigation/Footer';
import { Link } from 'react-router-dom';
import api from '../utils/api';

type DoctorCard = {
  _id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  experience?: number;
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = React.useState<DoctorCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { res, json } = await api.getJson('/api/doctors');
        if (!res.ok) throw new Error(json?.msg || json?.error || 'Failed to load doctors');
        setDoctors(json);
      } catch (err: any) {
        setError(err.message || 'Unable to load doctors');
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  return (
    <>  
      <Header />
      <main className="page-wrapper patient-dashboard">
        <div className="page-header">
            <h1>Welcome, {user?.name || 'Patient'}</h1>
            <p>Track your consultations and prescriptions in one place.</p>
        </div>
        <div className="doctor-grid">
            <div className="doctor-card">
              <h3>Recent Consultations</h3>
              <p>Use the doctor list below to start a consultation.</p>
            </div>
            <div className="doctor-card">
              <h3>Prescriptions</h3>
              <p>View prescriptions once your doctor sends them.</p>
              <div style={{ marginTop: '1rem' }}>
                <Link className="btn btn-outline btn-sm" to="/patient/prescriptions">View Prescriptions</Link>
              </div>
            </div>
            <div className="doctor-card">
              <h3>Upcoming</h3>
              <p>Appointments are created after you submit consultation details.</p>
            </div>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <div className="page-header">
            <h2>Available Doctors</h2>
            <p>Choose a doctor and start consultation.</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : error ? (
            <div className="form-error-box">{error}</div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩺</div>
              <h3>No doctors found</h3>
              <p>Doctors will appear here after they register.</p>
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors.map((doctor) => {
                const initials = doctor.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <div className="doctor-card fade-up" key={doctor._id}>
                    {doctor.avatarUrl ? (
                      <img src={doctor.avatarUrl} alt={doctor.name} className="avatar" />
                    ) : (
                      <div className="avatar" style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {initials}
                      </div>
                    )}
                    <h3>Dr. {doctor.name}</h3>
                    <div className="specialty">{doctor.specialty}</div>
                    <div className="experience">{doctor.experience || 0} years experience</div>
                    <Link className="btn btn-primary btn-sm" to={`/patient/consult/${doctor._id}`}>
                      Consult
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PatientDashboard;