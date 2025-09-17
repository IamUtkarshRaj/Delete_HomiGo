import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import FilterPanel from './FilterPanel';
import Toast from './Toast';
import '../styles/matches.css';
import Sidebar from './Sidebar';
import Footer from './Footer';

const mockMatches = [
  {
    id: 1,
    name: "Sarah",
    age: 25,
    gender: "female",
    location: "Delhi, India",
    course: "Software Engineering",
    compatibility: 28,
    budget: 8000,
    lifestyle: "early_bird",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face",
    verified: true,
    interests: ["Coding", "Travel", "Music"],
    isPerfectMatch: false
  },
  {
    id: 2,
    name: "Priya",
    age: 24,
    gender: "female",
    location: "Mumbai, India",
    course: "Computer Science",
    compatibility: 85,
    budget: 12000,
    lifestyle: "night_owl",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    verified: true,
    interests: ["Gaming", "Books", "Fitness"],
    isPerfectMatch: false
  },
  {
    id: 3,
    name: "Ananya",
    age: 22,
    gender: "female",
    location: "Bangalore, India",
    course: "Data Science",
    compatibility: 72,
    budget: 7000,
    lifestyle: "balanced",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    verified: false,
    interests: ["Art", "Photography", "Coffee"],
    isPerfectMatch: false
  },
  {
    id: 4,
    name: "Kavya",
    age: 27,
    gender: "female",
    location: "Delhi, India",
    course: "Business Administration",
    compatibility: 91,
    budget: 15000,
    lifestyle: "social",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    interests: ["Yoga", "Cooking", "Networking"],
    isPerfectMatch: true
  },
  {
    id: 5,
    name: "Shruti",
    age: 23,
    gender: "female",
    location: "Pune, India",
    course: "Marketing",
    compatibility: 95,
    budget: 10000,
    lifestyle: "early_bird",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    verified: true,
    interests: ["Dancing", "Movies", "Food"],
    isPerfectMatch: true
  }
];

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllMatches(mockMatches);
      setFilteredMatches(mockMatches);
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
      const ageMatch = match.age >= filters.ageRange[0] && match.age <= filters.ageRange[1];
      const budgetMatch = match.budget >= filters.budgetRange[0] && match.budget <= filters.budgetRange[1];
      const genderMatch = !filters.gender || match.gender === filters.gender;
      const locationMatch = !filters.location || match.location.toLowerCase().includes(filters.location.toLowerCase());
      const lifestyleMatch = !filters.lifestyle || match.lifestyle === filters.lifestyle;

      return ageMatch && budgetMatch && genderMatch && locationMatch && lifestyleMatch;
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
                <h2>Personalized Matches</h2>
                <span className="arrow">→</span>
              </div>

              {perfectMatches.length > 0 && (
                <div className="perfect-matches-alert">
                  <h3>🎉 {perfectMatches.length} Perfect Match{perfectMatches.length > 1 ? 'es' : ''} Found!</h3>
                  <p>These roommates have high compatibility with your preferences. Send requests now!</p>
                  <div className="perfect-matches-actions">
                    {perfectMatches.slice(0, 2).map(match => (
                      <button
                        key={match.id}
                        className="quick-request-btn"
                        onClick={() => handleRequest(match.id, match.name)}
                      >
                        Request {match.name} ({match.compatibility}% match)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="matches-header">
                <div className="matches-count">
                  {filteredMatches.length} potential roommates found
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

              <div className="matches-grid">
                {filteredMatches.map(match => (
                  <MatchCard
                    key={match.id}
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
