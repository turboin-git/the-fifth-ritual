import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  // Info form
  const [infoForm, setInfoForm] = useState({ name: '', phone: '', dateOfBirth: '', medicalNotes: '' });
  const [savingInfo, setSavingInfo] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // Profile picture
  const [uploadingPic, setUploadingPic] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/clients/profile/${user.userId}`);
      setProfile(res.data);
      setAvatarUrl(res.data.profilePicture);
      setInfoForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        dateOfBirth: res.data.dateOfBirth || '',
        medicalNotes: res.data.medicalNotes || ''
      });
    } catch {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!infoForm.name) { toast.error('Name is required'); return; }
    setSavingInfo(true);
    try {
      await api.put(`/clients/profile/${user.userId}`, infoForm);
      toast.success('Profile updated!');
      fetchProfile();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPw(true);
    try {
      await api.put(`/clients/profile/${user.userId}/change-password`, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setUploadingPic(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/clients/profile/${user.userId}/picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatarUrl(res.data.imageUrl);
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to upload picture');
    } finally {
      setUploadingPic(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-sm tracking-widest">MY PROFILE</span>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="text-xs font-bold tracking-widest text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded-lg transition"
        >
          LOGOUT
        </button>
      </div>

      {/* Profile Hero */}
      <div className="px-5 py-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center border-2 border-purple-500">
                {avatarUrl ? (
                  <img
                    src={`http://localhost:8080${avatarUrl}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl(null)}
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{getInitials(profile?.name)}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center border-2 border-gray-900 transition disabled:opacity-50"
              >
                {uploadingPic ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profile?.name}</h2>
              <p className="text-gray-500 text-sm truncate">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold tracking-widest px-2 py-1 rounded-full bg-blue-900 text-blue-300">CLIENT</span>
                {profile?.hasValidConsent && (
                  <span className="text-xs font-bold tracking-widest px-2 py-1 rounded-full bg-green-900 text-green-300">CONSENT ✓</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">CLIENT ID</p>
              <p className="text-white font-bold">#{profile?.clientId}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">MEMBER SINCE</p>
              <p className="text-white font-bold text-xs">{formatDate(profile?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5">
        <div className="flex gap-2 mb-6 bg-gray-900 rounded-xl p-1 border border-gray-800">
          {[
            { key: 'info', label: 'Personal Info' },
            { key: 'security', label: 'Security' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest transition ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-sm tracking-widest text-gray-400 mb-4">PERSONAL INFORMATION</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">FULL NAME</label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                    placeholder="98XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">DATE OF BIRTH</label>
                  <input
                    type="date"
                    value={infoForm.dateOfBirth}
                    onChange={e => setInfoForm({ ...infoForm, dateOfBirth: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-sm tracking-widest text-gray-400 mb-4">HEALTH INFORMATION</h3>
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">MEDICAL NOTES & ALLERGIES</label>
                <textarea
                  value={infoForm.medicalNotes}
                  onChange={e => setInfoForm({ ...infoForm, medicalNotes: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
                  placeholder="Any allergies, medical conditions, or skin sensitivities relevant to tattooing..."
                />
              </div>
            </div>

            <button
              onClick={handleSaveInfo}
              disabled={savingInfo}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-4 rounded-xl text-xs transition disabled:opacity-50"
            >
              {savingInfo ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-sm tracking-widest text-gray-400 mb-4">CHANGE PASSWORD</h3>
              <div className="space-y-4">
                {[
                  { key: 'currentPassword', label: 'CURRENT PASSWORD', placeholder: '••••••••' },
                  { key: 'newPassword', label: 'NEW PASSWORD', placeholder: 'Min. 6 characters' },
                  { key: 'confirmPassword', label: 'CONFIRM NEW PASSWORD', placeholder: '••••••••' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-1">{label}</label>
                    <div className="relative">
                      <input
                        type={showPasswords[key] ? 'text' : 'password'}
                        value={pwForm[key]}
                        onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                        placeholder={placeholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition"
                      >
                        {showPasswords[key] ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                <p className="text-red-400 text-xs mt-2">Passwords do not match</p>
              )}
              {pwForm.newPassword && pwForm.newPassword === pwForm.confirmPassword && pwForm.newPassword.length >= 6 && (
                <p className="text-green-400 text-xs mt-2">✓ Passwords match</p>
              )}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={savingPw}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-4 rounded-xl text-xs transition disabled:opacity-50"
            >
              {savingPw ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}
            </button>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-sm tracking-widest text-gray-400 mb-2">ACCOUNT SECURITY</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-900 bg-opacity-40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Two-Factor Authentication</p>
                      <p className="text-gray-500 text-xs">OTP sent to email on every login</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold tracking-widest px-2 py-1 rounded-full bg-green-900 text-green-300">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}