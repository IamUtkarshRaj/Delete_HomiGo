import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import roomService from '../services/roomService';
import './HostelDetail.css';

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: '',
    isVisible: false
  });
  const [matchesFilter, setMatchesFilter] = useState('all'); // all, in-hostel, looking-for, nearby

  useEffect(() => {
    setLoading(true);
    roomService.getRoomDetails(id)
      .then(response => {
        if (response.success) {
          setHostel(response.data);
        } else {
          setHostel(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setHostel(null);
        setLoading(false);
      });
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSaveHostel = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Removed from saved hostels' : 'Hostel saved successfully!', 'success');
  };

  const handleContactOwner = () => {
    setShowContactForm(true);
  };

  const handleSendMessage = (matchId, matchName) => {
    showToast(`Message sent to ${matchName}!`, 'success');
  };

  const handleSendRequest = (matchId, matchName) => {
    setPotentialMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, requestSent: true }
          : match
      )
    );
    showToast(`Roommate request sent to ${matchName}!`, 'success');
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 80) return '#F59E0B'; // Yellow
    if (score >= 70) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getMatchTypeText = (type) => {
    switch (type) {
      case 'in-hostel': return 'Currently living here';
      case 'looking-for': return 'Looking for this hostel';
      case 'nearby': return 'Lives nearby';
      default: return '';
    }
  };

  const getMatchTypeIcon = (type) => {
    switch (type) {
      case 'in-hostel': return '🏠';
      case 'looking-for': return '🔍';
      case 'nearby': return '📍';
      default: return '';
    }
  };

  const filteredMatches = potentialMatches.filter(match => {
    if (matchesFilter === 'all') return true;
    return match.matchType === matchesFilter;
  });

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="main-content">
          <div className="hostel-detail-loading">
            <div className="loading-spinner"></div>
            <p>Loading hostel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="main-content">
          <div className="hostel-detail-error">
            <h2>Hostel not found</h2>
            <p>The hostel you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/hostels')} className="btn-primary">
              Back to Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="hostel-detail-container">
          {/* Back Button */}
          <div className="hostel-detail-header">
            <button onClick={() => navigate('/hostels')} className="back-btn">
              ← Back to Listings
            </button>
            <div className="hostel-detail-actions">
              <button 
                onClick={handleSaveHostel}
                className={`save-hostel-btn ${isSaved ? 'saved' : ''}`}
              >
                <span className="icon">{isSaved ? '❤️' : '🤍'}</span>
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Hostel Images */}
          <div className="hostel-images-section">
            <div className="main-image">
              <img 
                src={
                  hostel.images && hostel.images[activeImageIndex]
                    ? hostel.images[activeImageIndex]
                    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
                alt={hostel.name || 'Hostel'}
                className="hostel-main-image"
                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'; }}
              />
            </div>
            <div className="image-thumbnails">
              {(hostel.images && hostel.images.length > 0
                ? hostel.images
                : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80']
              ).map((img, idx) => (
                <img 
                  key={idx} 
                  src={img}
                  alt={`Hostel thumbnail ${idx+1}`}
                  className={`thumbnail ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'; }}
                />
              ))}
            </div>
          </div>

          {/* Hostel Information */}
          <div className="hostel-contentt">
            <div className="hostel-main-info">
              <div className="hostel-title-section">
                <div className="hostel-title-row">
                  <h1 className="hostel-title">{hostel.name}</h1>
                  {hostel.verified && <span className="verified-badge">✓ Verified</span>}
                </div>
                <div className="hostel-location-row">
                  <span className="location">📍 {hostel.location}</span>
                  <span className="distance">{hostel.distance}km away</span>
                </div>
                <div className="hostel-rating-row">
                  <div className="rating">
                    <span className="stars">⭐ {hostel.rating}</span>
                    <span className="reviews">({hostel.reviews} reviews)</span>
                  </div>
                  <span className="last-updated">Updated {hostel.lastUpdated}</span>
                </div>
              </div>

              <div className="hostel-price-availability">
                <div className="price-section">
                  <div className="price">₹{hostel.price.toLocaleString()}</div>
                  <div className="price-label">per month</div>
                </div>
                <div className="availability-section">
                  <div className={`availability-status ${hostel.available ? 'available' : 'unavailable'}`}>
                    {hostel.available ? '✓ Available' : '✗ Fully Occupied'}
                  </div>
                  {hostel.available && (
                    <div className="rooms-available">
                      {hostel.availableRooms} of {hostel.totalRooms} rooms available
                    </div>
                  )}
                </div>
              </div>

              <div className="hostel-quick-info">
                <div className="quick-info-item">
                  <span className="icon">👥</span>
                  <span className="value">{hostel.occupancy}</span>
                </div>
                <div className="quick-info-item">
                  <span className="icon">🚻</span>
                  <span className="value">{hostel.gender}</span>
                </div>
                <div className="quick-info-item">
                  <span className="icon">📍</span>
                  <span className="value">{hostel.address}</span>
                </div>
              </div>

              {/* Description */}
              <div className="hostel-description">
                <h3>About this place</h3>
                <p>{hostel.fullDescription}</p>
              </div>

              {/* Amenities */}
              <div className="hostel-amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {(hostel.amenities || []).map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">
                        {amenity === 'Wi-Fi' && '📶'}
                        {amenity === 'Food' && '🍽️'}
                        {amenity === 'AC' && '❄️'}
                        {amenity === 'Laundry' && '🧺'}
                        {amenity === 'Parking' && '🅿️'}
                        {amenity === 'Gym' && '🏋️'}
                        {amenity === 'Study Room' && '📚'}
                        {amenity === 'Security' && '🔒'}
                        {amenity === 'Cafeteria' && '☕'}
                        {amenity === 'Recreation Room' && '🎮'}
                      </span>
                      <span className="amenity-name">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div className="hostel-rules">
                <h3>House Rules</h3>
                <ul className="rules-list">
                  {(hostel.rules || []).map((rule, index) => (
                    <li key={index} className="rule-item">
                      <span className="rule-icon">•</span>
                      <span className="rule-text">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby Places */}
              <div className="hostel-nearby">
                <h3>What's nearby</h3>
                <div className="nearby-places">
                  {(hostel.nearbyPlaces || []).map((place, index) => (
                    <div key={index} className="nearby-place">
                      <span className="place-icon">
                        {place.type === 'education' && '🎓'}
                        {place.type === 'transport' && '🚇'}
                        {place.type === 'shopping' && '🛒'}
                        {place.type === 'medical' && '🏥'}
                      </span>
                      <div className="place-info">
                        <span className="place-name">{place.name}</span>
                        <span className="place-distance">{place.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner Information Sidebar */}
            <div className="hostel-sidebar">
              <div className="owner-card">
                <h3>Contact Owner</h3>
                <div className="owner-info">
                  <div className="owner-header">
                    <div className="owner-avatar">
                      {(hostel.owner?.name || 'O').charAt(0)}
                    </div>
                    <div className="owner-details">
                      <div className="owner-name">
                        {hostel.owner.name}
                        {hostel.owner.verified && <span className="owner-verified">✓</span>}
                      </div>
                      <div className="owner-meta">
                        <div className="response-time">{hostel.owner.responseTime}</div>
                        <div className="joined-date">{hostel.owner.joinedDate}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="contact-actions">
                    <button className="btn-primary contact-btn" onClick={handleContactOwner}>
                      <span className="icon">📞</span>
                      Contact Owner
                    </button>
                    <button className="btn-secondary message-btn">
                      <span className="icon">💬</span>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hostel-stats">
                <h4>Quick Stats</h4>
                <div className="stat-item">
                  <span className="stat-label">Total Rooms:</span>
                  <span className="stat-value">{hostel.totalRooms}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Available:</span>
                  <span className="stat-value">{hostel.availableRooms}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Rating:</span>
                  <span className="stat-value">⭐ {hostel.rating}/5</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Reviews:</span>
                  <span className="stat-value">{hostel.reviews}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Potential Matches Section */}
          <div className="potential-matches-section">
            <div className="matches-header">
              <h2>Potential Roommates</h2>
              <p className="matches-subtitle">
                Compatible people who are in this hostel, looking for it, or nearby
              </p>
            </div>

            {/* Matches Filter */}
            <div className="matches-filter">
              <button 
                className={`filter-btn ${matchesFilter === 'all' ? 'active' : ''}`}
                onClick={() => setMatchesFilter('all')}
              >
                All ({potentialMatches.length})
              </button>
              <button 
                className={`filter-btn ${matchesFilter === 'in-hostel' ? 'active' : ''}`}
                onClick={() => setMatchesFilter('in-hostel')}
              >
                🏠 Living Here ({potentialMatches.filter(m => m.matchType === 'in-hostel').length})
              </button>
              <button 
                className={`filter-btn ${matchesFilter === 'looking-for' ? 'active' : ''}`}
                onClick={() => setMatchesFilter('looking-for')}
              >
                🔍 Looking For ({potentialMatches.filter(m => m.matchType === 'looking-for').length})
              </button>
              <button 
                className={`filter-btn ${matchesFilter === 'nearby' ? 'active' : ''}`}
                onClick={() => setMatchesFilter('nearby')}
              >
                📍 Nearby ({potentialMatches.filter(m => m.matchType === 'nearby').length})
              </button>
            </div>

            {/* Matches Grid */}
            <div className="match-grid">
              {(filteredMatches || []).map(match => (
                <div key={match.id} className="match-card">
                  <div className="match-header">
                    <div className="match-image">
                      <img 
                        src={
                          match.profileImage && match.profileImage.startsWith('http')
                            ? match.profileImage
                            : 'https://via.placeholder.com/60x60?text=User'
                        }
                        alt={match.name}
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x60?text=User'; }}
                      />
                      {match.verified && <div className="match-verified">✓</div>}
                    </div>
                    <div className="compatibility-score" style={{backgroundColor: getCompatibilityColor(match.compatibility)}}>
                      {match.compatibility}%
                    </div>
                  </div>

                  <div className="match-info">
                    <h4 className="match-name">{match.name}, {match.age}</h4>
                    <p className="match-course">{match.course} • {match.year}</p>
                    <p className="match-college">{match.college}</p>
                    
                    <div className="match-type">
                      <span className="match-type-icon">{getMatchTypeIcon(match.matchType)}</span>
                      <span className="match-type-text">{getMatchTypeText(match.matchType)}</span>
                    </div>
                    
                    <div className="match-preferences">
                      <div className="preference-item">
                        <span className="pref-label">Budget:</span>
                        <span className="pref-value">₹{match.budget.toLocaleString()}</span>
                      </div>
                      <div className="preference-item">
                        <span className="pref-label">Room:</span>
                        <span className="pref-value">{match.roomPreference}</span>
                      </div>
                      <div className="preference-item">
                        <span className="pref-label">Sleep:</span>
                        <span className="pref-value">{match.sleepSchedule}</span>
                      </div>
                    </div>

                    <div className="match-interests">
                      {(match.interests || []).slice(0, 3).map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                    </div>

                    <p className="match-bio">{match.bio}</p>
                  </div>

                  <div className="match-action">
                    {match.requestSent ? (
                      <button className="btn-success request-sent">
                        ✓ Request Sent
                      </button>
                    ) : (
                      <>
                        <button 
                          className="btn-secondary message-match"
                          onClick={() => handleSendMessage(match.id, match.name)}
                        >
                          💬 Message
                        </button>
                        <button 
                          className="btn-primary request-match"
                          onClick={() => handleSendRequest(match.id, match.name)}
                        >
                          🤝 Send Request
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <div className="no-matches">
                <div className="no-matches-icon">🔍</div>
                <h3>No matches found</h3>
                <p>Try changing the filter to see more potential roommates.</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HostelDetail;