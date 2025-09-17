import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import './Profile.css';
import userService from '../services/userService';

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  college: '',
  course: '',
  year: '',
  avatar: '',
  location: '',
  budget: {
    min: 5000,
    max: 8000
  },
  lifestyle: {
    smoking: 'Non-smoker',
    sleepSchedule: 'Flexible',
    cleanliness: 'Moderately clean',
    studyHabits: 'Balanced',
    social: 'Moderately social'
  },
  preferences: {
    roommates: 1,
    gender: 'Any',
    amenities: [],
    petFriendly: false
  },
  trustScore: 0,
  verified: false
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(defaultProfile);



useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getProfile();
      const data = response.data ? response.data : response;
      setUserProfile({
        name: data.fullname ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        college: data.college ?? '',
        course: data.course ?? '',
        year: data.year ?? '',
        avatar: data.profilePicture ?? '',
        location: data.location ?? '',
        budget: data.budget ?? { min: '', max: '' },
        lifestyle: (data.preferences && data.preferences.lifestyle) ?? {
          smoking: '',
          sleepSchedule: '',
          cleanliness: '',
          studyHabits: '',
          social: ''
        },
        preferences: {
          roommates: data.preferences?.roommates ?? '',
          gender: data.preferences?.gender ?? '',
          amenities: data.preferences?.amenities ?? [],
          petFriendly: data.preferences?.petFriendly ?? false,
        },
        trustScore: data.trustScore ?? 0,
        verified: data.verified ?? false
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };
  fetchUserProfile();
}, []);


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setUserProfile(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleLifestyleChange = (key, value) => {
  setUserProfile(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      [key]: value
    }
  }));
};

const handlePreferenceChange = (key, value) => {
  setUserProfile(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      [key]: value
    }
  }));
};

const handleSaveProfile = async () => {
  try {
    setIsLoading(true);
    setError(null);
    // Send location and budget as expected by backend
    const payload = {
      ...userProfile,
      location: userProfile.location,
      budgetMin: userProfile.budget?.min,
      budgetMax: userProfile.budget?.max,
    };
    await userService.updateProfile(payload);
    setIsEditing(false);
  } catch (err) {
    setError(err.message || 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};


if (isLoading) {
  return (
    <div className="profile-container">
      <Sidebar />
      <div className="loading-spinner">Loading...</div>
    </div>
  );
}

if (error) {
  return (
    <div className="profile-container">
      <Sidebar />
      <div className="error-message">
        {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );
}

if (!userProfile) {
  return (
    <div className="profile-container">
      <Sidebar />
      <div className="error-message">No profile data found</div>
    </div>
  );
}

return (
  <div className="profile-page">
    <Sidebar />
    <button
      className="mobile-menu-trigger"
      onClick={() => setIsMobileMenuOpen(true)}
    >
      ☰
    </button>
    <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    <div className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and roommate preferences</p>
        </div>

        <div className="profile-grid">
          <div className="profile-card-section">
            <div className="profile-card">
              <div className="profile-card-content">
                <div className="profile-image-container">
                  {userProfile.avatar ? (
                    <img
                      className="profile-avatar"
                      src={userProfile.avatar}
                      alt={userProfile.name || 'User Avatar'}
                    />
                  ) : (
                    <div className="profile-avatar" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F3F4F6',
                      borderRadius: '50%',
                      width: '100%',
                      height: '100%',
                      fontSize: '3rem',
                      color: '#9CA3AF',
                      border: '2px solid var(--color-border)'
                    }}>
                      <span role="img" aria-label="avatar">👤</span>
                    </div>
                  )}
                  {isEditing && (
                    <div className="image-upload">
                      <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Please choose an image under 5MB');
                              return;
                            }

                            setIsUploading(true);
                            const reader = new FileReader();

                            reader.onload = (e) => {
                              setUserProfile(prev => ({
                                ...prev,
                                avatar: e.target.result
                              }));
                              setIsUploading(false);
                            };

                            reader.onerror = () => {
                              alert('Error reading file');
                              setIsUploading(false);
                            };

                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className={`edit-photo-btn ${isUploading ? 'uploading' : ''}`}
                      >
                        {isUploading ? '⏳ Uploading...' : '✏️ Change Photo'}
                      </label>
                    </div>
                  )}
                </div>

                <h2 className="profile-name">{userProfile.name}</h2>
                <p className="profile-course">{userProfile.course} • {userProfile.year}</p>

                <div className="profile-stats">
                  <div className="trust-score">
                    <span className="shield-icon">🛡️</span>
                    <span className="score-text">Trust Score: {userProfile.trustScore}%</span>
                  </div>
                  {userProfile.verified && (
                    <div className="verified-badge">
                      <span className="star-icon">⭐</span>
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  {isEditing ? (
                    <div className="save-actions">
                      <button
                        className="save-btn"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-details-section">
            <div className="info-card">
              <h3 className="card-title">
                <span className="card-icon">👤</span>
                Personal Information
              </h3>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userProfile.name}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userProfile.name}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userProfile.email}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userProfile.phone}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">College</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={userProfile.college}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userProfile.college}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">📍 Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={userProfile.location}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userProfile.location}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">💰 Budget Range</label>
                  {isEditing ? (
                    <select
                      name="budget"
                      value={`${(userProfile.budget?.min ?? 5000)}-${(userProfile.budget?.max ?? 8000)}`}
                      onChange={(e) => {
                        const [min, max] = e.target.value.split('-').map(Number);
                        setUserProfile(prev => ({
                          ...prev,
                          budget: { min, max }
                        }));
                      }}
                      className="info-select"
                    >
                      <option value="5000-8000">₹5,000 - ₹8,000</option>
                      <option value="8000-12000">₹8,000 - ₹12,000</option>
                      <option value="12000-15000">₹12,000 - ₹15,000</option>
                      <option value="15000-20000">₹15,000+</option>
                    </select>
                  ) : (
                    <p className="info-value">
                      ₹{(userProfile.budget?.min ?? 5000).toLocaleString()} - ₹{(userProfile.budget?.max ?? 8000).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3 className="card-title">
                <span className="card-icon">☀️</span>
                Lifestyle & Preferences
              </h3>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Smoking</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.lifestyle?.smoking || 'Non-smoker'}
                      onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
                      className="info-select"
                    >
                      <option value="Non-smoker">Non-smoker</option>
                      <option value="Occasional smoker">Occasional smoker</option>
                      <option value="Regular smoker">Regular smoker</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.lifestyle?.smoking || 'Non-smoker'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">🌙 Sleep Schedule</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.lifestyle?.sleepSchedule || 'Flexible'}
                      onChange={(e) => handleLifestyleChange('sleepSchedule', e.target.value)}
                      className="info-select"
                    >
                      <option value="Early bird (6 AM - 10 PM)">Early bird (6 AM - 10 PM)</option>
                      <option value="Night owl (10 PM - 2 AM)">Night owl (10 PM - 2 AM)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.lifestyle?.sleepSchedule || 'Flexible'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Cleanliness</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.lifestyle?.cleanliness || 'Moderately clean'}
                      onChange={(e) => handleLifestyleChange('cleanliness', e.target.value)}
                      className="info-select"
                    >
                      <option value="Very clean">Very clean</option>
                      <option value="Moderately clean">Moderately clean</option>
                      <option value="Casual">Casual</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.lifestyle?.cleanliness || 'Moderately clean'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">📚 Study Habits</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.lifestyle?.studyHabits || 'Balanced'}
                      onChange={(e) => handleLifestyleChange('studyHabits', e.target.value)}
                      className="info-select"
                    >
                      <option value="Study focused">Study focused</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Social focused">Social focused</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.lifestyle?.studyHabits || 'Balanced'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Social Preference</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.lifestyle?.social || 'Moderately social'}
                      onChange={(e) => handleLifestyleChange('social', e.target.value)}
                      className="info-select"
                    >
                      <option value="Very social">Very social</option>
                      <option value="Moderately social">Moderately social</option>
                      <option value="Quiet/Private">Quiet/Private</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.lifestyle?.social || 'Moderately social'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Gender Preference</label>
                  {isEditing ? (
                    <select
                      value={userProfile?.preferences?.gender || 'Any'}
                      onChange={(e) => handlePreferenceChange('gender', e.target.value)}
                      className="info-select"
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="info-value">{userProfile?.preferences?.gender || 'Any'}</p>
                  )}
                </div>
                <div className="info-item full-width">
                  <label className="info-label">Required Amenities</label>
                  <div className="amenities-list">
                    {(userProfile?.preferences?.amenities || []).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity === 'Wi-Fi' && '📶'}
                        {amenity === 'Food' && '🍽️'}
                        {amenity === 'AC' && '❄️'}
                        {amenity === 'Laundry' && '🧺'}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
  };

export default Profile;