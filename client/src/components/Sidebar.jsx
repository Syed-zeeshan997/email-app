import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiMail,
  FiSend,
  FiUser,
  FiLogOut,
  FiUsers,
  FiBarChart2,
  FiInbox,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const userLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/compose', icon: FiSend, label: 'Compose' },
    { to: '/sent-mails', icon: FiInbox, label: 'Sent Mail' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiBarChart2, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
    { to: '/admin/emails', icon: FiMail, label: 'Email Logs' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <FiMail className="sidebar-logo" />
        <span className="sidebar-title">Email App</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={to === '/dashboard' || to === '/admin'}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="sidebar-avatar" />
          ) : (
            <div className="sidebar-avatar-placeholder">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
        </div>
        <div className="sidebar-actions">
          <ThemeToggle />
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
