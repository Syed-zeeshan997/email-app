import { useState, useRef } from 'react';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { useToast } from '../context/ToastContext';
import { validatePassword, formatDate } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('email', profileForm.email);
      const file = fileRef.current?.files[0];
      if (file) formData.append('profileImage', file);

      const { data } = await userService.updateProfile(formData);
      updateUser(data.user);
      toast.success('Profile updated successfully');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (validatePassword(passwordForm.newPassword).length > 0) {
      return toast.error('Password does not meet requirements');
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error('Enter your password to confirm');
    setDeleteLoading(true);
    try {
      await userService.deleteAccount(deletePassword);
      await logout();
      toast.success('Account deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
        {/* Profile Info */}
        <div className="card">
          <h2 className="card-title">Account Details</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600 }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Verified:</strong> {user?.verified ? 'Yes' : 'No'}</p>
              <p><strong>Joined:</strong> {formatDate(user?.createdAt)}</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Profile Picture</label>
              <div className="file-upload" onClick={() => fileRef.current?.click()}>
                <input type="file" ref={fileRef} accept="image/*" />
                <FiCamera style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                <p className="file-upload-label">Click to upload new photo</p>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="card-title">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? <LoadingSpinner size="sm" /> : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <h2 className="card-title" style={{ color: 'var(--danger)' }}>Danger Zone</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Account</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Enter your password to confirm account deletion.
            </p>
            <input
              type="password"
              className="form-input"
              placeholder="Your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? <LoadingSpinner size="sm" /> : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
