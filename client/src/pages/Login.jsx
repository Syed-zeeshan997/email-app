import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    try {
      const data = await login(form);
      console.log(data);
      toast.success('Welcome back!');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
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
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>

        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Login;
