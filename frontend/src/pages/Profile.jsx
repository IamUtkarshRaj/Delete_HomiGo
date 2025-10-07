import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import authService from '../services/authService';
import userService from '../services/userService';
import './Profile.modern.css';

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
  const navigate = useNavigate();
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
        
        // Get fresh user data from backend
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUserProfile({
            name: userResponse.data.name || userResponse.data.fullname || '',
            email: userResponse.data.email || '',
            phone: userResponse.data.phone || '',
            college: userResponse.data.college || '',
            course: userResponse.data.course || '',
            year: userResponse.data.year || '',
            avatar: userResponse.data.profilePicture || userResponse.data.avatar || '',
            location: userResponse.data.location || '',
            budget: userResponse.data.budget || { min: 5000, max: 8000 },
            lifestyle: userResponse.data.preferences?.lifestyle || {
              smoking: 'Non-smoker',
              sleepSchedule: 'Flexible',
              cleanliness: 'Moderately clean',
              studyHabits: 'Balanced',
              social: 'Moderately social'
            },
            preferences: {
              roommates: userResponse.data.preferences?.roommates || 1,
              gender: userResponse.data.preferences?.gender || 'Any',
              amenities: userResponse.data.preferences?.amenities || [],
              petFriendly: userResponse.data.preferences?.petFriendly || false,
            },
            trustScore: userResponse.data.trustScore || 85,
            verified: userResponse.data.verified || false
          });
        }
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
      
      const payload = {
        ...userProfile,
        fullname: userProfile.name,
        profilePicture: userProfile.avatar,
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

  const handleImageUpload = (e) => {
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
  };

  const tabSections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'preferences', label: 'Lifestyle', icon: '⚙️' },
    { id: 'roommate', label: 'Roommate Prefs', icon: '🏠' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  if (isLoading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="main-content">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
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
          {/* Modern Header Section */}
          <div className="profile-header">
            <div className="header-background"></div>
            <div className="header-content">
              <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                  {userProfile.avatar ? (
                    <img
                      className="profile-avatar-large"
                      src={userProfile.avatar}
                      alt={userProfile.name || 'User Avatar'}
                      onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                  ) : (
                    <div className="profile-avatar-large default">
                      <span>👤</span>
                    </div>
                  )}
                  {isEditing && (
                    <div className="avatar-edit-overlay">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-upload" className="avatar-edit-btn">
                        <span>�</span>
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <div className="name-section">
                    <h1 className="profile-name">
                      {userProfile.name || 'Your Name'}
                    </h1>
                    {userProfile.verified && (
                      <span className="verified-badge">
                        <span className="check-icon">✓</span>
                      </span>
                    )}
                  </div>
                  <p className="profile-subtitle">
                    {userProfile.course && userProfile.year 
                      ? `${userProfile.course} • ${userProfile.year}` 
                      : 'Student'
                    }
                  </p>
                  <p className="profile-location">
                    <span className="location-icon">📍</span>
                    {userProfile.location || 'Add your location'}
                  </p>
                  
                  <div className="profile-stats">
                    <div className="stat-item">
                      <div className="stat-number">{userProfile.trustScore || 85}%</div>
                      <div className="stat-label">Trust Score</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Connections</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.8</div>
                      <div className="stat-label">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="header-actions">
                {isEditing ? (
                  <div className="edit-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <div className="view-actions">
                    <button 
                      className="btn-outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      <span>🏠</span>
                      Dashboard
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <span>✏️</span>
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabSections.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'personal' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <p>Manage your basic profile information</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={userProfile.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="form-value">{userProfile.name || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userProfile.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="form-value">{userProfile.email || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userProfile.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="form-value">{userProfile.phone || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">College/University</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="college"
                        value={userProfile.college}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your college name"
                      />
                    ) : (
                      <div className="form-value">{userProfile.college || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="course"
                        value={userProfile.course}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Computer Science"
                      />
                    ) : (
                      <div className="form-value">{userProfile.course || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Academic Year</label>
                    {isEditing ? (
                      <select
                        name="year"
                        value={userProfile.year}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    ) : (
                      <div className="form-value">{userProfile.year || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={userProfile.location}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your current location"
                      />
                    ) : (
                      <div className="form-value">{userProfile.location || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Budget Range</label>
                    {isEditing ? (
                      <select
                        value={`${userProfile.budget?.min || 5000}-${userProfile.budget?.max || 8000}`}
                        onChange={(e) => {
                          const [min, max] = e.target.value.split('-').map(Number);
                          setUserProfile(prev => ({
                            ...prev,
                            budget: { min, max }
                          }));
                        }}
                        className="form-select"
                      >
                        <option value="3000-5000">₹3,000 - ₹5,000</option>
                        <option value="5000-8000">₹5,000 - ₹8,000</option>
                        <option value="8000-12000">₹8,000 - ₹12,000</option>
                        <option value="12000-15000">₹12,000 - ₹15,000</option>
                        <option value="15000-20000">₹15,000 - ₹20,000</option>
                        <option value="20000-30000">₹20,000+</option>
                      </select>
                    ) : (
                      <div className="form-value">
                        ₹{(userProfile.budget?.min || 5000).toLocaleString()} - ₹{(userProfile.budget?.max || 8000).toLocaleString()} per month
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Lifestyle Preferences</h2>
                  <p>Help us find compatible roommates for you</p>
                </div>
                
                <div className="preference-grid">
                  <div className="preference-card">
                    <div className="preference-icon">🚭</div>
                    <h3>Smoking Preference</h3>
                    {isEditing ? (
                      <select
                        value={userProfile.lifestyle?.smoking || 'Non-smoker'}
                        onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
                        className="form-select"
                      >
                        <option value="Non-smoker">Non-smoker</option>
                        <option value="Occasional smoker">Occasional smoker</option>
                        <option value="Regular smoker">Regular smoker</option>
                      </select>
                    ) : (
                      <div className="preference-value">{userProfile.lifestyle?.smoking || 'Non-smoker'}</div>
                    )}
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon">🌙</div>
                    <h3>Sleep Schedule</h3>
                    {isEditing ? (
                      <select
                        value={userProfile.lifestyle?.sleepSchedule || 'Flexible'}
                        onChange={(e) => handleLifestyleChange('sleepSchedule', e.target.value)}
                        className="form-select"
                      >
                        <option value="Early bird (6 AM - 10 PM)">Early bird (6 AM - 10 PM)</option>
                        <option value="Night owl (10 PM - 2 AM)">Night owl (10 PM - 2 AM)</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    ) : (
                      <div className="preference-value">{userProfile.lifestyle?.sleepSchedule || 'Flexible'}</div>
                    )}
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon">🧹</div>
                    <h3>Cleanliness Level</h3>
                    {isEditing ? (
                      <select
                        value={userProfile.lifestyle?.cleanliness || 'Moderately clean'}
                        onChange={(e) => handleLifestyleChange('cleanliness', e.target.value)}
                        className="form-select"
                      >
                        <option value="Very clean">Very clean</option>
                        <option value="Moderately clean">Moderately clean</option>
                        <option value="Casual">Casual</option>
                      </select>
                    ) : (
                      <div className="preference-value">{userProfile.lifestyle?.cleanliness || 'Moderately clean'}</div>
                    )}
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon">📚</div>
                    <h3>Study Habits</h3>
                    {isEditing ? (
                      <select
                        value={userProfile.lifestyle?.studyHabits || 'Balanced'}
                        onChange={(e) => handleLifestyleChange('studyHabits', e.target.value)}
                        className="form-select"
                      >
                        <option value="Study focused">Study focused</option>
                        <option value="Balanced">Balanced</option>
                        <option value="Social focused">Social focused</option>
                      </select>
                    ) : (
                      <div className="preference-value">{userProfile.lifestyle?.studyHabits || 'Balanced'}</div>
                    )}
                  </div>

                  <div className="preference-card">
                    <div className="preference-icon">👥</div>
                    <h3>Social Level</h3>
                    {isEditing ? (
                      <select
                        value={userProfile.lifestyle?.social || 'Moderately social'}
                        onChange={(e) => handleLifestyleChange('social', e.target.value)}
                        className="form-select"
                      >
                        <option value="Very social">Very social</option>
                        <option value="Moderately social">Moderately social</option>
                        <option value="Quiet/Private">Quiet/Private</option>
                      </select>
                    ) : (
                      <div className="preference-value">{userProfile.lifestyle?.social || 'Moderately social'}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roommate' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Roommate Preferences</h2>
                  <p>Set your preferences for finding the perfect roommate</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Gender Preference</label>
                    {isEditing ? (
                      <select
                        value={userProfile.preferences?.gender || 'Any'}
                        onChange={(e) => handlePreferenceChange('gender', e.target.value)}
                        className="form-select"
                      >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      <div className="form-value">{userProfile.preferences?.gender || 'Any'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Roommates</label>
                    {isEditing ? (
                      <select
                        value={userProfile.preferences?.roommates || 1}
                        onChange={(e) => handlePreferenceChange('roommates', parseInt(e.target.value))}
                        className="form-select"
                      >
                        <option value={1}>1 roommate</option>
                        <option value={2}>2 roommates</option>
                        <option value={3}>3 roommates</option>
                        <option value={4}>4+ roommates</option>
                      </select>
                    ) : (
                      <div className="form-value">{userProfile.preferences?.roommates || 1} roommate(s)</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Required Amenities</label>
                    <div className="amenities-grid">
                      {['Wi-Fi', 'AC', 'Food', 'Laundry', 'Gym', 'Parking'].map(amenity => (
                        <div key={amenity} className="amenity-item">
                          <span className="amenity-icon">
                            {amenity === 'Wi-Fi' && '📶'}
                            {amenity === 'AC' && '❄️'}
                            {amenity === 'Food' && '🍽️'}
                            {amenity === 'Laundry' && '🧺'}
                            {amenity === 'Gym' && '🏋️'}
                            {amenity === 'Parking' && '🅿️'}
                          </span>
                          <span className="amenity-name">{amenity}</span>
                          {isEditing && (
                            <input
                              type="checkbox"
                              checked={(userProfile.preferences?.amenities || []).includes(amenity)}
                              onChange={(e) => {
                                const amenities = userProfile.preferences?.amenities || [];
                                const updatedAmenities = e.target.checked
                                  ? [...amenities, amenity]
                                  : amenities.filter(a => a !== amenity);
                                handlePreferenceChange('amenities', updatedAmenities);
                              }}
                              className="amenity-checkbox"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Security & Privacy</h2>
                  <p>Manage your account security and privacy settings</p>
                </div>
                
                <div className="security-grid">
                  <div className="security-card">
                    <div className="security-icon">🛡️</div>
                    <h3>Trust Score</h3>
                    <div className="trust-score-display">
                      <div className="score-circle">
                        <span className="score-number">{userProfile.trustScore || 85}%</span>
                      </div>
                      <p>Your trust score is calculated based on verified information and user reviews.</p>
                    </div>
                  </div>

                  <div className="security-card">
                    <div className="security-icon">✅</div>
                    <h3>Verification Status</h3>
                    <div className="verification-status">
                      {userProfile.verified ? (
                        <div className="verified">
                          <span className="status-indicator verified"></span>
                          <span>Account Verified</span>
                        </div>
                      ) : (
                        <div className="unverified">
                          <span className="status-indicator unverified"></span>
                          <span>Account Not Verified</span>
                          <button className="verify-btn">Verify Now</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="security-card">
                    <div className="security-icon">🔒</div>
                    <h3>Password</h3>
                    <button className="change-password-btn">Change Password</button>
                  </div>

                  <div className="security-card">
                    <div className="security-icon">📱</div>
                    <h3>Two-Factor Authentication</h3>
                    <div className="toggle-switch">
                      <input type="checkbox" id="2fa-toggle" />
                      <label htmlFor="2fa-toggle" className="toggle-label">
                        <span className="toggle-slider"></span>
                      </label>
                      <span>Enable 2FA</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;