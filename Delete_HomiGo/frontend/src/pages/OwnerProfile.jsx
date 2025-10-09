import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import './Profile.css';
import '../styles/ownerProfile.custom.css';
import authService from '../services/authService';

const defaultOwnerProfile = {
  fullname: '',
  email: '',
  phone: '',
  organization: '',
  avatar: '',
  businessDetails: {
    establishedYear: '',
    totalProperties: 0,
    businessLicense: '',
    gstNumber: '',
    businessAddress: '',
    operatingHours: {
      from: '09:00',
      to: '18:00'
    }
  },
  contactInfo: {
    alternatePhone: '',
    whatsapp: '',
    landline: '',
    website: ''
  },
  bankDetails: {
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: ''
  },
  preferences: {
    preferredTenants: 'any', // 'students', 'working_professionals', 'any'
    minStayDuration: '1', // months
    securityDeposit: 'standard',
    paymentTerms: 'monthly'
  },
  verified: false,
  businessRating: 0
};

const OwnerProfile = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(defaultOwnerProfile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setOwnerProfile(prev => ({
            ...prev,
            ...response.data,
            businessDetails: {
              ...prev.businessDetails,
              ...response.data.businessDetails
            },
            contactInfo: {
              ...prev.contactInfo,
              ...response.data.contactInfo
            }
          }));
        } else {
          setError(response.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('Failed to load owner profile');
        console.error('Error fetching owner profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOwnerProfile();
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setOwnerProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setOwnerProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Implement API call to update owner profile
      console.log('Saving owner profile:', ownerProfile);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
  { id: 'business', label: 'Business Info', icon: '🏢' },
  { id: 'contact', label: 'Contact Details', icon: '📞' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  // Add a summary card for verification and rating
  const summaryCard = (
    <div className="owner-summary-card">
      <div className="avatar-section">
        <img
          src={ownerProfile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ownerProfile.fullname)}
          alt="Owner Avatar"
          className="owner-avatar"
        />
        <div className="owner-name-email">
          <h2>{ownerProfile.fullname}</h2>
          <p>{ownerProfile.email}</p>
        </div>
      </div>
      <div className="owner-verification">
        <span className={`verified-badge ${ownerProfile.verified ? 'verified' : ''}`}>{ownerProfile.verified ? 'Verified' : 'Unverified'}</span>
        <span className="business-rating">⭐ {ownerProfile.businessRating || 0}</span>
        <button
          className="edit-profile-btn"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          style={{marginTop: 12}}
        >
          {isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit Profile'}
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading owner profile...</p>
      </div>
    );
  }

  return (
    <div className="owner-profile-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="profile-main-content" style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: '32px 32px 0 32px' }}>
          {/* Personalized Welcome */}
          <h1>Welcome, {ownerProfile.fullname || 'Owner'}!</h1>
          {/* Summary Card */}
          {summaryCard}
          {/* Tabs */}
          <div className="profile-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="tab-content">
            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div className="owner-profile-section-card">
                <h2><span className="section-icon">🏢</span>Business Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      value={ownerProfile.fullname}
                      onChange={(e) => handleInputChange(null, 'fullname', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Organization/Business Name*</label>
                    <input
                      type="text"
                      value={ownerProfile.organization}
                      onChange={(e) => handleInputChange(null, 'organization', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Established Year</label>
                    <input
                      type="number"
                      value={ownerProfile.businessDetails.establishedYear}
                      onChange={(e) => handleInputChange('businessDetails', 'establishedYear', e.target.value)}
                      disabled={!isEditing}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Properties</label>
                    <input
                      type="number"
                      value={ownerProfile.businessDetails.totalProperties}
                      onChange={(e) => handleInputChange('businessDetails', 'totalProperties', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="0"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Business Address</label>
                    <textarea
                      value={ownerProfile.businessDetails.businessAddress}
                      onChange={(e) => handleInputChange('businessDetails', 'businessAddress', e.target.value)}
                      disabled={!isEditing}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Business License Number</label>
                    <input
                      type="text"
                      value={ownerProfile.businessDetails.businessLicense}
                      onChange={(e) => handleInputChange('businessDetails', 'businessLicense', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>GST Number</label>
                    <input
                      type="text"
                      value={ownerProfile.businessDetails.gstNumber}
                      onChange={(e) => handleInputChange('businessDetails', 'gstNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Operating Hours (From)</label>
                    <input
                      type="time"
                      value={ownerProfile.businessDetails.operatingHours.from}
                      onChange={(e) => handleInputChange('businessDetails', 'operatingHours', {
                        ...ownerProfile.businessDetails.operatingHours,
                        from: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Operating Hours (To)</label>
                    <input
                      type="time"
                      value={ownerProfile.businessDetails.operatingHours.to}
                      onChange={(e) => handleInputChange('businessDetails', 'operatingHours', {
                        ...ownerProfile.businessDetails.operatingHours,
                        to: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Details Tab */}
            {activeTab === 'contact' && (
              <div className="owner-profile-section-card">
                <h2><span className="section-icon">📞</span>Contact Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Primary Email*</label>
                    <input
                      type="email"
                      value={ownerProfile.email}
                      onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Primary Phone*</label>
                    <input
                      type="tel"
                      value={ownerProfile.phone}
                      onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="tel"
                      value={ownerProfile.contactInfo.alternatePhone}
                      onChange={(e) => handleInputChange('contactInfo', 'alternatePhone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input
                      type="tel"
                      value={ownerProfile.contactInfo.whatsapp}
                      onChange={(e) => handleInputChange('contactInfo', 'whatsapp', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Landline</label>
                    <input
                      type="tel"
                      value={ownerProfile.contactInfo.landline}
                      onChange={(e) => handleInputChange('contactInfo', 'landline', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={ownerProfile.contactInfo.website}
                      onChange={(e) => handleInputChange('contactInfo', 'website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Banking Tab */}
            {activeTab === 'banking' && (
              <div className="owner-profile-section-card">
                <h2><span className="section-icon">🏦</span>Banking Information</h2>
                <div className="security-notice" style={{marginBottom: 16, color: '#6c63ff', fontWeight: 500}}>
                  🔒 Your banking information is encrypted and secure
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      value={ownerProfile.bankDetails.accountHolderName}
                      onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={ownerProfile.bankDetails.accountNumber}
                      onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      value={ownerProfile.bankDetails.ifscCode}
                      onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={ownerProfile.bankDetails.bankName}
                      onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Branch Name</label>
                    <input
                      type="text"
                      value={ownerProfile.bankDetails.branchName}
                      onChange={(e) => handleInputChange('bankDetails', 'branchName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="owner-profile-section-card">
                <h2><span className="section-icon">⚙️</span>Business Preferences</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Preferred Tenants</label>
                    <select
                      value={ownerProfile.preferences.preferredTenants}
                      onChange={(e) => handleInputChange('preferences', 'preferredTenants', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="any">Any</option>
                      <option value="students">Students Only</option>
                      <option value="working_professionals">Working Professionals Only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Minimum Stay Duration (months)</label>
                    <select
                      value={ownerProfile.preferences.minStayDuration}
                      onChange={(e) => handleInputChange('preferences', 'minStayDuration', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Security Deposit Policy</label>
                    <select
                      value={ownerProfile.preferences.securityDeposit}
                      onChange={(e) => handleInputChange('preferences', 'securityDeposit', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="standard">1 Month Rent</option>
                      <option value="double">2 Months Rent</option>
                      <option value="custom">Custom Amount</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <select
                      value={ownerProfile.preferences.paymentTerms}
                      onChange={(e) => handleInputChange('preferences', 'paymentTerms', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="biannual">Bi-Annual</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
      />
    </div>
  );
};

export default OwnerProfile;