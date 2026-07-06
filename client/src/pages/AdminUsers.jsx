import { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';
import { adminService } from '../services';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers({ page, search, limit: 10 });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleSuspend = async (id, currentStatus) => {
    try {
      await adminService.updateUserStatus(id, !currentStatus);
      toast.success(currentStatus ? 'User unsuspended' : 'User suspended');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Layout title="Manage Users">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View, search, suspend, or delete users</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or email..."
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
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-${user.verified ? 'success' : 'warning'}`}>
                          {user.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${user.suspended ? 'danger' : 'success'}`}>
                          {user.suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleSuspend(user._id, user.suspended)}
                            title={user.suspended ? 'Unsuspend' : 'Suspend'}
                          >
                            {user.suspended ? <FiUserCheck /> : <FiUserX />}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user._id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
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

export default AdminUsers;
