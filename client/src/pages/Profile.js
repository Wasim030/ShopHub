import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || { street: '', city: '', state: '', zipCode: '', country: '' },
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const updateAddress = (field, value) => {
    setProfileForm({ ...profileForm, address: { ...profileForm.address, [field]: value } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2"><FiUser /><span>Personal Information</span></h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
            </div>
            <h3 className="font-semibold mt-4 flex items-center space-x-2"><FiMapPin /><span>Address</span></h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Street</label>
                <input type="text" value={profileForm.address.street} onChange={(e) => updateAddress('street', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" value={profileForm.address.city} onChange={(e) => updateAddress('city', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input type="text" value={profileForm.address.state} onChange={(e) => updateAddress('state', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input type="text" value={profileForm.address.zipCode} onChange={(e) => updateAddress('zipCode', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input type="text" value={profileForm.address.country} onChange={(e) => updateAddress('country', e.target.value)} className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary flex items-center space-x-2">
              <FiSave /><span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2"><FiLock /><span>Change Password</span></h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="input-field" required />
            </div>
            <button type="submit" disabled={passwordLoading} className="btn-primary">
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
