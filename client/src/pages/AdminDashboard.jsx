import { useEffect, useState } from 'react';
import { FiUsers, FiMail, FiUserCheck, FiUserX } from 'react-icons/fi';
import { adminService } from '../services';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminService.getStats();
        setStats(data.stats);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiUsers /></div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiMail /></div>
          <div className="stat-info">
            <h3>{stats?.totalEmails || 0}</h3>
            <p>Total Emails Sent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning"><FiUserCheck /></div>
          <div className="stat-info">
            <h3>{stats?.verifiedUsers || 0}</h3>
            <p>Verified Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger"><FiUserX /></div>
          <div className="stat-info">
            <h3>{stats?.suspendedUsers || 0}</h3>
            <p>Suspended Users</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
