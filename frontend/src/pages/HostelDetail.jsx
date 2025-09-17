import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
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

  // Mock hostel data - In a real app, this would come from an API
  const hostelData = {
    1: {
      id: 1,
      name: 'Student Haven PG',
      type: 'PG',
      price: 9500,
      location: 'Near MIT College',
      distance: 0.8,
      rating: 4.5,
      reviews: 127,
      occupancy: '2 sharing',
      gender: 'Male',
      available: true,
      availableRooms: 3,
      totalRooms: 20,
      amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Parking', 'Study Room', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Modern PG with all amenities, perfect for students. Clean rooms with attached bathrooms, nutritious meals, and a supportive community environment.',
      fullDescription: 'Student Haven PG offers the perfect blend of comfort, convenience, and community for students. Our facility features modern amenities including high-speed Wi-Fi, nutritious meals, air-conditioned rooms, and 24/7 security. Located just 0.8km from MIT College, it\'s ideal for students seeking quality accommodation with easy access to their campus.',
      owner: {
        name: 'Mrs. Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        verified: true,
        responseTime: 'Usually responds within 2 hours',
        joinedDate: 'Member since 2019'
      },
      coordinates: { lat: 28.6139, lng: 77.2090 },
      address: '123 Student Colony, Near MIT College, Delhi 110001',
      rules: [
        'No smoking inside the premises',
        'No loud music after 10 PM',
        'Visitors allowed till 8 PM',
        'Monthly payment in advance',
        'One month security deposit required'
      ],
      nearbyPlaces: [
        { name: 'MIT College', distance: '0.8 km', type: 'education' },
        { name: 'Metro Station', distance: '1.2 km', type: 'transport' },
        { name: 'Shopping Mall', distance: '1.5 km', type: 'shopping' },
        { name: 'Hospital', distance: '2.0 km', type: 'medical' }
      ],
      verified: true,
      featured: true,
      lastUpdated: '2 days ago'
    },
    2: {
      id: 2,
      name: 'Comfort Zone Hostel',
      type: 'Hostel',
      price: 11000,
      location: 'Green Park Area',
      distance: 1.2,
      rating: 4.2,
      reviews: 89,
      occupancy: '3 sharing',
      gender: 'Any',
      available: true,
      availableRooms: 5,
      totalRooms: 30,
      amenities: ['Wi-Fi', 'Laundry', 'Gym', 'Study Room', 'Cafeteria', 'Recreation Room'],
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Spacious hostel with gym facilities and study rooms. Great for active students.',
      fullDescription: 'Comfort Zone Hostel provides a vibrant community atmosphere with modern amenities. Our spacious rooms accommodate both male and female students, featuring a well-equipped gym, dedicated study areas, and recreational facilities.',
      owner: {
        name: 'Mr. Rajesh Kumar',
        phone: '+91 98765 12345',
        email: 'rajesh.kumar@email.com',
        verified: true,
        responseTime: 'Usually responds within 1 hour',
        joinedDate: 'Member since 2018'
      },
      coordinates: { lat: 28.5355, lng: 77.2066 },
      address: '456 Green Park Extension, New Delhi 110016',
      rules: [
        'Co-ed facility with separate floors',
        'Gym timings: 6 AM - 10 PM',
        'Study room available 24/7',
        'No outside food in rooms',
        'ID proof required for visitors'
      ],
      nearbyPlaces: [
        { name: 'Green Park Metro', distance: '0.5 km', type: 'transport' },
        { name: 'AIIMS', distance: '3.0 km', type: 'medical' },
        { name: 'IIT Delhi', distance: '4.5 km', type: 'education' },
        { name: 'Select City Walk', distance: '1.8 km', type: 'shopping' }
      ],
      verified: true,
      featured: false,
      lastUpdated: '1 week ago'
    }
  };

  // Mock potential matches data
  const potentialMatchesData = {
    1: [ // Matches for Student Haven PG
      {
        id: 101,
        name: 'Arjun Patel',
        age: 22,
        course: 'Computer Science',
        year: '3rd Year',
        college: 'MIT College',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        compatibility: 95,
        matchType: 'in-hostel', // in-hostel, looking-for, nearby
        budget: 9000,
        lifestyle: 'early_bird',
        interests: ['Cricket', 'Programming', 'Movies'],
        verified: true,
        location: 'Student Haven PG - Room 205',
        roomPreference: '2 sharing',
        smokingPreference: 'No',
        sleepSchedule: 'Early sleeper (10 PM)',
        bio: 'CS student at MIT College. Love coding and cricket. Looking for a like-minded roommate.',
        joinedDate: 'Joined 6 months ago',
        responseRate: '95%'
      },
      {
        id: 102,
        name: 'Vikram Singh',
        age: 21,
        course: 'Mechanical Engineering',
        year: '2nd Year',
        college: 'Delhi Technical University',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        compatibility: 88,
        matchType: 'looking-for',
        budget: 10000,
        lifestyle: 'balanced',
        interests: ['Gym', 'Books', 'Music'],
        verified: true,
        location: 'Looking for accommodation near MIT College',
        roomPreference: '2 sharing',
        smokingPreference: 'No',
        sleepSchedule: 'Moderate sleeper (11 PM)',
        bio: 'Mechanical engineering student looking for accommodation near MIT College area.',
        joinedDate: 'Joined 2 weeks ago',
        responseRate: '100%'
      },
      {
        id: 103,
        name: 'Rohan Gupta',
        age: 23,
        course: 'MBA',
        year: '1st Year',
        college: 'Delhi School of Business',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        compatibility: 82,
        matchType: 'nearby',
        budget: 9500,
        lifestyle: 'social',
        interests: ['Business', 'Networking', 'Travel'],
        verified: false,
        location: 'Currently at Green Valley PG (1.5km away)',
        roomPreference: '1 sharing',
        smokingPreference: 'Occasionally',
        sleepSchedule: 'Night owl (1 AM)',
        bio: 'MBA student interested in moving closer to college. Entrepreneurial mindset.',
        joinedDate: 'Joined 1 month ago',
        responseRate: '88%'
      }
    ],
    2: [ // Matches for Comfort Zone Hostel
      {
        id: 201,
        name: 'Priya Mehta',
        age: 20,
        course: 'Psychology',
        year: '2nd Year',
        college: 'Delhi University',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face',
        compatibility: 92,
        matchType: 'in-hostel',
        budget: 11500,
        lifestyle: 'balanced',
        interests: ['Yoga', 'Reading', 'Art'],
        verified: true,
        location: 'Comfort Zone Hostel - Room 305',
        roomPreference: '3 sharing',
        smokingPreference: 'No',
        sleepSchedule: 'Early sleeper (10:30 PM)',
        bio: 'Psychology student who loves arts and yoga. Looking for peaceful roommates.',
        joinedDate: 'Joined 8 months ago',
        responseRate: '97%'
      },
      {
        id: 202,
        name: 'Aditya Sharma',
        age: 24,
        course: 'Data Science',
        year: 'Working Professional',
        college: 'Tech Company',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        compatibility: 85,
        matchType: 'looking-for',
        budget: 12000,
        lifestyle: 'night_owl',
        interests: ['Data Science', 'Gaming', 'Cooking'],
        verified: true,
        location: 'Looking for accommodation in Green Park area',
        roomPreference: '2 sharing',
        smokingPreference: 'No',
        sleepSchedule: 'Night owl (12:30 AM)',
        bio: 'Data scientist working remotely. Looking for accommodation with good internet.',
        joinedDate: 'Joined 3 weeks ago',
        responseRate: '91%'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const selectedHostel = hostelData[id];
      const matches = potentialMatchesData[id] || [];
      
      if (selectedHostel) {
        setHostel(selectedHostel);
        setPotentialMatches(matches);
      }
      setLoading(false);
    }, 1000);
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
                src={hostel.images[activeImageIndex]} 
                alt={hostel.name}
                className="hostel-main-image"
              />
              <div className="image-overlay">
                <div className="hostel-type-badge">{hostel.type}</div>
                {hostel.featured && <div className="featured-badge">Featured</div>}
              </div>
            </div>
            <div className="image-thumbnails">
              {hostel.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${hostel.name} ${index + 1}`}
                  className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Hostel Information */}
          <div className="hostel-content">
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
                  {hostel.amenities.map((amenity, index) => (
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
                  {hostel.rules.map((rule, index) => (
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
                  {hostel.nearbyPlaces.map((place, index) => (
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
                      {hostel.owner.name.charAt(0)}
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
            <div className="matches-grid">
              {filteredMatches.map(match => (
                <div key={match.id} className="match-card">
                  <div className="match-header">
                    <div className="match-image">
                      <img src={match.profileImage} alt={match.name} />
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
                      {match.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                    </div>

                    <p className="match-bio">{match.bio}</p>
                  </div>

                  <div className="match-actions">
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