
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import MatchCard from '../components/MatchCard';
import FilterPanel from '../components/FilterPanel';
import Toast from '../components/Toast';
import axios from 'axios';
import '../styles/matches.css';


const Matches = () => {
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    message: '',
    type: '',
    isVisible: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 52],
    budgetRange: [5000, 18000],
    gender: "",
    location: "",
    lifestyle: ""
  });
  
  
  // Temporary filters state that only applies when clicking Apply
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        // Only keep users with role === 'student'
        const students = response.data?.data?.filter(user => user.role === 'student') || [];
        
        // Get current user to exclude from matches
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = currentUser._id || currentUser.id;
        
        // Filter out current user from matches
        const otherStudents = students.filter(user => user._id !== currentUserId);
        
        // Transform user data to match expected structure
        const transformedStudents = otherStudents.map(user => {
          // Generate deterministic values based on user ID for consistency
          const userIdNum = parseInt(user._id.slice(-4), 16) || 1000;
          const compatibility = 70 + (userIdNum % 30);
          const interestCount = (userIdNum % 4) + 1;
          const isPerfectMatch = (userIdNum % 10) > 6;
          
          return {
            id: user._id,
            _id: user._id,
            name: user.fullname,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            college: user.college,
            course: user.course,
            year: user.year,
            location: user.location,
            profileImage: user.profilePicture || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
            profilePicture: user.profilePicture,
            budget: user.budget?.max || user.budget?.min || 0,
            budgetRange: user.budget,
            preferences: user.preferences,
            interests: ['Music', 'Movies', 'Sports', 'Reading'].slice(0, interestCount),
            compatibility: compatibility,
            verified: true,
            isPerfectMatch: isPerfectMatch,
            requestSent: false
          };
        });
        
        setAllMatches(transformedStudents);
        setFilteredMatches(transformedStudents);
      } catch (error) {
        setToast({ message: 'Failed to fetch matches', type: 'error', isVisible: true });
        setAllMatches([]);
        setFilteredMatches([]);
      }
      setLoading(false);
    };
    fetchMatches();
  }, []);

  // Handle scroll lock and filter panel state
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'auto';
      // Reset temporary filters to current filters when opening panel
      setTempFilters(filters);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showFilters, filters]);

  useEffect(() => {
    let filtered = allMatches.filter(match => {
      // Remove age filter since users don't have age field
      const budgetMatch = match.budget >= filters.budgetRange[0] && match.budget <= filters.budgetRange[1];
      const genderMatch = !filters.gender || match.gender === filters.gender;
      const locationMatch = !filters.location || match.location.toLowerCase().includes(filters.location.toLowerCase());
      // Remove lifestyle filter for now since it's not in user data structure
      
      return budgetMatch && genderMatch && locationMatch;
    });

    setFilteredMatches(filtered);
  }, [filters, allMatches]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleFilterChange = (newFilters) => {
    setTempFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleRequest = (matchId, matchName) => {
    console.log(`Request sent to ${matchName} (ID: ${matchId})`);

    setFilteredMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === matchId
          ? { ...match, requestSent: true }
          : match
      )
    );
    setAllMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === matchId
          ? { ...match, requestSent: true }
          : match
      )
    );

    showToast(`🎉 Roommate request sent to ${matchName}! They will be notified.`, 'success');
  };

  const handleCancelRequest = (matchId, matchName) => {
    console.log(`Cancelled request to ${matchName} (ID: ${matchId})`);

    setFilteredMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === matchId
          ? { ...match, requestSent: false }
          : match
      )
    );
    setAllMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === matchId
          ? { ...match, requestSent: false }
          : match
      )
    );

    showToast(`Request to ${matchName} has been cancelled.`, 'info');
  };

  const handleMessage = (matchId, matchName) => {
    console.log(`Opening message conversation with ${matchName} (ID: ${matchId})`);
    showToast(`Opening conversation with ${matchName}...`, 'info');
    // TODO: Navigate to messages page or open message modal
  };

  const handleReject = (matchId, matchName) => {
    console.log(`Rejected ${matchName} (ID: ${matchId})`);

    setFilteredMatches(prevMatches =>
      prevMatches.filter(match => match.id !== matchId)
    );

    showToast(`${matchName} has been removed from your matches.`, 'info');
  };

  const perfectMatches = filteredMatches.filter(match => match.isPerfectMatch && !match.requestSent);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="main-content">
          <div className="dashboard-contain">
            <header className="dashboard-header">
              <div className="header-content">
                <h1>Find Your Perfect Roommate</h1>
                <p className="matches-subtitle">Discovering compatible roommates...</p>
              </div>
            </header>
            <div className="matches-content">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Finding your perfect roommates...</p>
              </div>
            </div>
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

        <div className="dashboard-contain">
          {/* Navigation Header */}
          <header className="dashboard-header">
            <div className="header-content">
              <h1>Find Your Perfect Roommate</h1>
              <p className="matches-subtitle">Discover compatible roommates based on your preferences</p>
            </div>
          </header>

          <div className="matches-content">
            <div className="sidebar-filters">

            </div>

            <div className="matches-main">
              <div className="section-header">
                <h2>All Matches</h2>
                <span className="arrow">→</span>
              </div>

              <div className="matches-header">
                <div className="matches-count">
                  {filteredMatches.filter(match => !match.requestSent).length} potential roommates found
                </div>
                <button 
                  className="advanced-filter-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Advanced Filters'} 🔍
                </button>
              </div>

              {showFilters && (
                <div className="overlay" onClick={() => setShowFilters(false)}>
                  <div className="filter-panel-container" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="close-filter-btn"
                      onClick={() => setShowFilters(false)}
                    >
                      ✕
                    </button>
                    <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Advanced Filters</h2>
                    <FilterPanel 
                      filters={tempFilters} 
                      onFilterChange={handleFilterChange}
                      onApply={handleApplyFilters}
                    />
                  </div>
                </div>
              )}

              {/* Sent Requests Section */}
              {allMatches.filter(match => match.requestSent).length > 0 && (
                <>
                  <div className="section-header">
                    <h2>Sent Requests</h2>
                    <span className="arrow">→</span>
                  </div>
                  <div className="sent-requests-grid">
                    {allMatches.filter(match => match.requestSent).map(match => (
                      <div key={match._id || match.id} className="sent-request-card">
                        <div className="sent-request-profile">
                          <img 
                            src={match.profileImage} 
                            alt={`${match.name}'s profile`}
                            className="sent-request-avatar"
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1';
                            }}
                          />
                          <div className="sent-request-info">
                            <h4 className="sent-request-name">{match.name}</h4>
                            <p className="sent-request-details">
                              📍 {match.location} • 🎓 {match.course}
                            </p>
                            <div className="sent-request-status">
                              <span className="status-indicator">✅ Request Sent</span>
                              <span className="compatibility-small">{match.compatibility}% match</span>
                            </div>
                          </div>
                        </div>
                        <div className="sent-request-actions">
                          <button 
                            className="message-btn"
                            onClick={() => handleMessage(match.id, match.name)}
                          >
                            💬 Message
                          </button>
                          <button 
                            className="cancel-sent-btn"
                            onClick={() => handleCancelRequest(match.id, match.name)}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="matches-grid">
                {filteredMatches.filter(match => !match.requestSent).map(match => (
                  <MatchCard
                    key={match._id || match.id}
                    match={match}
                    onRequest={handleRequest}
                    onReject={handleReject}
                    onCancelRequest={handleCancelRequest}
                  />
                ))}
              </div>

              {filteredMatches.length === 0 && (
                <div className="no-matches">
                  <h3>No matches found</h3>
                  <p>Try adjusting your filters to see more potential roommates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default Matches;
