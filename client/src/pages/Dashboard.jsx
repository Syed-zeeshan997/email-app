import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiInbox, FiUser, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { emailService } from '../services';
import { formatDate } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentEmails, setRecentEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data } = await emailService.getSentMails({ limit: 5 });
        setRecentEmails(data.emails);
      } catch {
        // Silently fail for dashboard preview
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your emails and account from here</p>
      </div>

      {!user?.verified && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <p style={{ color: 'var(--warning)', fontWeight: 500 }}>
            Your email is not verified. Please check your inbox for the verification link.
          </p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiMail /></div>
          <div className="stat-info">
            <h3>{recentEmails.length}</h3>
            <p>Recent Emails</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiUser /></div>
          <div className="stat-info">
            <h3>{user?.verified ? 'Verified' : 'Pending'}</h3>
            <p>Account Status</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/compose" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
          <FiSend style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <h3 style={{ color: 'var(--text)' }}>Compose Email</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Send a new email</p>
        </Link>
        <Link to="/sent-mails" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
          <FiInbox style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <h3 style={{ color: 'var(--text)' }}>Sent Mail</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View sent emails</p>
        </Link>
        <Link to="/profile" className="card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
          <FiUser style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <h3 style={{ color: 'var(--text)' }}>Profile</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your account</p>
        </Link>
      </div>

      <div className="card">
        <h2 className="card-title">Recent Sent Emails</h2>
        {loading ? (
          <LoadingSpinner />
        ) : recentEmails.length === 0 ? (
          <div className="empty-state">
            <FiInbox />
            <p>No emails sent yet. <Link to="/compose">Compose your first email</Link></p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEmails.map((email) => (
                  <tr key={email._id}>
                    <td>{email.receiver}</td>
                    <td>
                      <Link to={`/mail/${email._id}`}>{email.subject}</Link>
                    </td>
                    <td>
                      <span className={`badge badge-${email.status === 'sent' ? 'success' : 'danger'}`}>
                        {email.status}
                      </span>
                    </td>
                    <td>{formatDate(email.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
