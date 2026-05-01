import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Doctor } from '../types';

const DoctorProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // ✅ Type guard: ensure user is a Doctor
  if (!user || user.role !== 'doctor') {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  // ✅ Now TypeScript knows 'user' is a Doctor
  const doctorUser = user as Doctor;

  const initials = doctorUser.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">MedScript</div>
        <div className="navbar-right">
          <div className="navbar-user">
            {doctorUser.avatarUrl
              ? <img src={doctorUser.avatarUrl} alt={doctorUser.name} />
              : <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem'
                }}>{initials}</div>}
            <span>Dr. {doctorUser.name}</span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { signOut(); navigate('/doctor/signin'); }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="page-wrapper" style={{ maxWidth: 860 }}>

        {/* Profile Card */}
        <div className="profile-card fade-up">
          <div className="profile-banner" />
          <div className="profile-body">
            <div className="profile-avatar-wrap">
              {doctorUser.avatarUrl ? (
                <img src={doctorUser.avatarUrl} alt={doctorUser.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar" style={{
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.8rem',
                  fontFamily: 'DM Serif Display, serif'
                }}>{initials}</div>
              )}
              <div className="profile-info">
                <h2>Dr. {doctorUser.name}</h2>
                <span className="specialty-badge">{doctorUser.specialty}</span>
              </div>
            </div>

            {/* Meta grid */}
            <div className="profile-meta">
              <div className="meta-item">
                <div className="meta-label">📧 Email</div>
                <div className="meta-value">{doctorUser.email}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">📞 Phone</div>
                <div className="meta-value">{doctorUser.phone || 'Not provided'}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">🩺 Specialty</div>
                <div className="meta-value">{doctorUser.specialty}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">⏳ Experience</div>
                <div className="meta-value">{doctorUser.experience} {Number(doctorUser.experience) === 1 ? 'year' : 'years'}</div>
              </div>
            </div>

            <div className="divider" />

            {/* CTA */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ width: 'auto' }}
                onClick={() => navigate('/doctor/prescriptions')}
              >
                📋 View Consultations & Prescriptions
              </button>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div style={{
          marginTop: '1.5rem',
          background: 'var(--primary-light)',
          border: '1px solid rgba(26,107,90,0.2)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.2rem', fontSize: '0.92rem' }}>
              How it works
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', margin: 0 }}>
              Patients can browse your profile and submit a consultation request. Once submitted,
              you'll see them in the Prescriptions panel where you can write and send prescriptions directly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorProfile;