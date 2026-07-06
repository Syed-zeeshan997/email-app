import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { authService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && <LoadingSpinner size="lg" />}
        {status === 'success' && (
          <>
            <FiCheckCircle style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }} />
            <h1>Email Verified!</h1>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{message}</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <FiXCircle style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1rem' }} />
            <h1>Verification Failed</h1>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{message}</p>
            <Link to="/login" className="btn btn-secondary">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
