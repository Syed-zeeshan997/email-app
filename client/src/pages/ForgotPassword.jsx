import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authService } from '../services';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    if (!validateEmail(email)) return setError('Invalid email address');

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent if account exists');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <FiMail style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }} />
          <h1>Forgot Password</h1>
          <p>{sent ? 'Check your email for reset instructions' : 'Enter your email to reset password'}</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
              />
              {error && <p className="form-error">{error}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
        )}

        <div className="auth-footer">
          <Link to="/login"><FiArrowLeft style={{ verticalAlign: 'middle' }} /> Back to login</Link>
        </div>

        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
