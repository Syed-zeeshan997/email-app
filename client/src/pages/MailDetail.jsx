import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPaperclip } from 'react-icons/fi';
import { emailService } from '../services';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const MailDetail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const { data } = await emailService.getMailById(id);
        setEmail(data.email);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Email Details">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  if (!email) {
    return (
      <Layout title="Email Details">
        <div className="empty-state">
          <p>Email not found</p>
          <Link to="/sent-mails" className="btn btn-secondary">Back to Sent Mail</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Email Details">
      <Link to="/sent-mails" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back
      </Link>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{email.subject}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <span><strong>To:</strong> {email.receiver}</span>
            <span><strong>From:</strong> {email.senderEmail}</span>
            <span><strong>Date:</strong> {formatDate(email.createdAt)}</span>
            <span className={`badge badge-${email.status === 'sent' ? 'success' : 'danger'}`}>
              {email.status}
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          {email.message}
        </div>

        {email.attachment?.filename && (
          <div style={{ padding: '1rem', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
            <FiPaperclip style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            <a href={email.attachment.path} target="_blank" rel="noopener noreferrer">
              {email.attachment.filename}
            </a>
          </div>
        )}

        {email.errorMessage && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
            <strong>Error:</strong> {email.errorMessage}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MailDetail;
