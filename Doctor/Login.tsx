import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await signIn({ email: data.email, password: data.password, role: 'doctor' });
      navigate('/doctor/profile');
    } catch (err: any) {
      setError(err.message || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-icon">🩺</div>
          <h2>Doctor Portal</h2>
          <p>Sign in to review consultations and manage prescriptions.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-box">
          <h2>Doctor Sign In</h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>
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
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-link">Don't have an account? <Link to="/doctor/signup">Sign up</Link></div>
          <div className="divider" />
          <div className="auth-link">Are you a patient? <Link to="/patient/signin">Sign in here</Link></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
