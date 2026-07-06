import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { authService } from '../services';
import { useToast } from '../context/ToastContext';
import { validatePassword, getPasswordStrength } from '../utils/helpers';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const ResetPassword = () => {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.password) newErrors.password = 'Password is required';
    else if (validatePassword(form.password).length > 0) {
      newErrors.password = 'Password does not meet requirements';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    try {
      await authService.resetPassword(token, form);
      toast.success('Password reset successful!');
      navigate('/dashboard');
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
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
            />
            {form.password && (
              <div className="password-strength">
                <div
                  className="password-strength-bar"
                  style={{
                    width: passwordStrength.strength === 'strong' ? '100%' : passwordStrength.strength === 'medium' ? '66%' : '33%',
                    background: passwordStrength.color,
                  }}
                />
              </div>
            )}
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>

        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
