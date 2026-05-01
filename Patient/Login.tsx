import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await signIn({ email: data.email, password: data.password, role: 'patient' });
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-icon">🧑‍🦽</div>
          <h2>Welcome Back</h2>
          <p>Sign in to view doctors,<br />book consultations, and<br />access your prescriptions.</p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '🔍', text: 'Browse verified doctors' },
              { icon: '💬', text: 'Submit consultation requests' },
              { icon: '📄', text: 'Receive digital prescriptions' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(255,255,255,0.08)', borderRadius: '10px',
                padding: '0.75rem 1rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className="auth-form-side">
        <div className="auth-box">
          <h2>Patient Sign In</h2>
          <p className="auth-subtitle">Enter your credentials to access your account</p>

          {error && <div className="form-error-box">⚠️ {error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" {...register('email')} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Your password" {...register('password')} required />
            </div>

            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/patient/signup">Create one</Link>
          </div>

          <div className="divider" />

          <div className="auth-link">
            Are you a doctor? <Link to="/doctor/signin">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;