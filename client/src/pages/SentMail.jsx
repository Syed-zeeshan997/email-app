import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInbox, FiSearch } from 'react-icons/fi';
import { emailService } from '../services';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const SentMail = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const { toast } = useToast();

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data } = await emailService.getSentMails({ page, search, limit: 10 });
      setEmails(data.emails);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmails();
  };

  return (
    <Layout title="Sent Mail">
      <div className="page-header">
        <h1>Sent Mail</h1>
        <p>View your sent email history</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by recipient or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          <FiSearch /> Search
        </button>
      </form>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : emails.length === 0 ? (
          <div className="empty-state">
            <FiInbox />
            <p>No sent emails found</p>
          </div>
        ) : (
          <>
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
                  {emails.map((email) => (
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
            <Pagination page={page} pages={pagination.pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SentMail;
