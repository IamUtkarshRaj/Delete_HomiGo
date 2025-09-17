import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user] = useState({
    name: 'John',
    role: 'student', 
  });


  const getPersonalizedStats = (role) => {
    if (role === 'owner') {
      return {
        totalListings: {
          count: '3',
          new: '+1',
          subtitle: 'Active Listings',
          secondaryText: 'Last updated today',
          trend: 'up',
          trendValue: '33%',
          icon: '🏠'
        },
        inquiries: {
          count: '28',
          new: '+5',
          subtitle: 'New Inquiries',
          secondaryText: 'This week',
          trend: 'up',
          trendValue: '12%',
          icon: '📩'
        },
        occupancyRate: {
          count: '85%',
          subtitle: 'Occupancy Rate',
          secondaryText: 'Across all properties',
          trend: 'up',
          trendValue: '5%',
          icon: '📊'
        },
        monthlyRevenue: {
          count: '₹45K',
          subtitle: 'Monthly Revenue',
          secondaryText: 'This month',
          trend: 'up',
          trendValue: '8%',
          icon: '💰'
        }
      };
    }
    
    return {
      roommateMatches: {
        count: '12',
        new: '+3',
        subtitle: 'Potential Matches',
        secondaryText: 'New this week',
        trend: 'up',
        trendValue: '15%',
        icon: '👥'
      },
      availableHostels: {
        count: '47',
        subtitle: 'Available Properties',
        secondaryText: 'Within 2km radius',
        trend: 'up',
        trendValue: '8%',
        icon: '🏢'
      },
      viewedProperties: {
        count: '15',
        subtitle: 'Properties Viewed',
        secondaryText: 'Last 30 days',
        trend: 'neutral',
        icon: '👁️'
      },
      averageRent: {
        count: '₹10.5K',
        subtitle: 'Average Rent',
        secondaryText: 'In your area',
        trend: 'down',
        trendValue: '3%',
        icon: '💰'
      }
    };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [viewMode, setViewMode] = useState('grid');

  const [stats, setStats] = useState(() => getPersonalizedStats(user.role));

  const [recentActivity] = useState([
    {
      id: 1,
      title: 'Property Match Found',
      description: 'New property matching your criteria in BTM Layout',
      time: '2 minutes ago',
      icon: '🎯',
      type: 'match',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Roommate Request',
      description: 'Sarah (90% compatibility) accepted your request',
      time: '30 minutes ago',
      icon: '✅',
      type: 'success',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Price Drop Alert',
      description: 'Student Haven PG reduced rent by ₹2,000',
      time: '2 hours ago',
      icon: '📉',
      type: 'info',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Scheduled Viewing',
      description: 'Reminder: Property viewing at Comfort Zone tomorrow',
      time: '5 hours ago',
      icon: '📅',
      type: 'reminder',
      priority: 'medium'
    }
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      title: 'Schedule Viewing',
      description: 'Book a visit to your preferred properties',
      icon: '📅',
      color: '#3B82F6',
      action: 'schedule'
    },
    {
      id: 2,
      title: 'Find Roommates',
      description: 'Browse compatible roommate profiles',
      icon: '👥',
      color: '#10B981',
      action: 'roommates'
    },
    {
      id: 3,
      title: 'Property Alerts',
      description: 'Set up notifications for new listings',
      icon: '�',
      color: '#8B5CF6',
      action: 'alerts'
    },
    {
      id: 4,
      title: 'Rent Calculator',
      description: 'Calculate total expenses and split rent',
      icon: '🧮',
      color: '#F59E0B',
      action: 'calculator'
    }
  ]);

  const [featuredHostels] = useState([
    {
      id: 1,
      name: 'Student Haven PG',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      rating: 4.5,
      distance: '0.8 km from college',
      price: '₹9,500/month',
      availability: 'Available now',
      amenities: ['Wi-Fi', 'Food', 'AC'],
      label: 'Popular'
    },
    {
      id: 2,
      name: 'Comfort Zone Hostel',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      rating: 4.2,
      distance: '1.2 km from college',
      price: '₹11,000/month',
      availability: 'Available now',
      amenities: ['Wi-Fi', 'Laundry', 'Gym'],
      label: 'New'
    },
    {
      id: 3,
      name: 'Green Valley PG',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
      rating: 4.7,
      distance: '1.5 km from college',
      price: '₹8,800/month',
      availability: 'Available now',
      amenities: ['Wi-Fi', 'Food', 'Parking'],
      label: 'Best Value',
      labelColor: 'purple'
    }
  ]);

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  const handleHostelAction = (hostelId, action) => {
    if (action === 'view') {
      navigate(`/hostel/${hostelId}`);
    } else if (action === 'save') {
      // Handle save functionality
      console.log('Saving hostel:', hostelId);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="main-content">
        <div className="dashboard-container">
          {/* Header Section */}
          <header className="dashboard-header">
            <div className="header-content">
              <h1>Find Your Perfect Place</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search for locations, properties, or amenities..."
                  className="search-input"
                />
                <button className="search-btn">
                  <span className="icon">🔍</span>
                  Search
                </button>
              </div>
            </div>
            <div className="header-actions">
              <button className="notification-btn">
                <span className="icon">�</span>
                <span className="badge">3</span>
              </button>
              <div className="user-menu" ref={dropdownRef}>
                <div
                  className="user-menu-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=4318FF&color=fff`}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <span className="user-name">{user.name}</span>
                </div>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=4318FF&color=fff`}
                        alt={user.name}
                        className="dropdown-avatar"
                      />
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">{user.name}</span>
                        <span className="dropdown-email">john@example.com</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={() => navigate('/profile')}>
                        <span className="item-icon">👤</span>
                        My Profile
                      </button>
                      <button className="dropdown-item">
                        <span className="item-icon">⚙️</span>
                        Settings
                      </button>
                      <button className="dropdown-item">
                        <span className="item-icon">🔒</span>
                        Privacy
                      </button>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item logout"
                        onClick={() => navigate('/')}
                      >
                        <span className="item-icon">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="dashboard-main-section">
            <div className="main-grid">
              {/* Stats Overview */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper">👥</div>
                <div className="stat-content">
                  <div className="stat-header">
                    <h3 className="stat-count">12</h3>
                    <span className="stat-trend up">15%</span>
                  </div>
                  <p className="stat-subtitle">Potential Matches</p>
                  <p className="stat-secondary">New this week</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">🏢</div>
                <div className="stat-content">
                  <div className="stat-header">
                    <h3 className="stat-count">47</h3>
                    <span className="stat-trend up">8%</span>
                  </div>
                  <p className="stat-subtitle">Available Properties</p>
                  <p className="stat-secondary">Within 2km radius</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">👁️</div>
                <div className="stat-content">
                  <div className="stat-header">
                    <h3 className="stat-count">15</h3>
                  </div>
                  <p className="stat-subtitle">Properties Viewed</p>
                  <p className="stat-secondary">Last 30 days</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">💰</div>
                <div className="stat-content">
                  <div className="stat-header">
                    <h3 className="stat-count">₹10.5K</h3>
                    <span className="stat-trend down">3%</span>
                  </div>
                  <p className="stat-subtitle">Average Rent</p>
                  <p className="stat-secondary">In your area</p>
                </div>
              </div>
            </div>
          </section>              {/* Quick Actions */}
              <section className="quick-actions">
                <div className="section-header">
                  <h2>Quick Actions</h2>
                  <p>Get started with these common tasks</p>
                </div>
                <div className="actions-grid">
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      className="action-card"
                      onClick={() => handleQuickAction(action.action)}
                      style={{ '--action-color': action.color }}
                    >
                      <div className="action-icon">{action.icon}</div>
                      <div className="action-content">
                        <h3>{action.title}</h3>
                        <p>{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Recent Activity Section */}
            <section className="recent-activity">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <p>Latest updates and notifications</p>
              </div>
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className={`activity-card ${activity.priority} ${activity.type}`}
                  >
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Featured Hostels */}
          <section className="featured-hostels">
            <div className="section-header">
              <div className="section-title">
                <h2>Featured Properties</h2>
                <p>Handpicked places for you</p>
              </div>
              <div className="section-actions">
                <div className="view-options">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <span className="icon">📊</span>
                    Grid
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <span className="icon">📋</span>
                    List
                  </button>
                  <button
                    className="view-all-btn"
                    onClick={() => window.location.href = '/listings'}
                  >
                    <span className="icon">→</span>
                    View All Listings
                  </button>
                </div>
              </div>
            </div>

            <div className={`hostels-${viewMode}`}>
              {featuredHostels.map(hostel => (
                <div key={hostel.id} className="hostel-card">
                  <div 
                    className="hostel-image-container"
                    onClick={() => navigate(`/hostel/${hostel.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={hostel.image} alt={hostel.name} className="hostel-image" />
                    <div className={`hostel-label ${hostel.labelColor || ''}`}>{hostel.label}</div>
                  </div>

                  <div className="hostel-content">
                    <div className="hostel-header">
                      <div>
                        <h4 
                          onClick={() => navigate(`/hostel/${hostel.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {hostel.name}
                        </h4>
                        <div className="rating">
                          <span className="stars">{'★'.repeat(Math.floor(hostel.rating))}{'☆'.repeat(5 - Math.floor(hostel.rating))}</span>
                          <span>{hostel.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hostel-details">
                      <p className="hostel-distance">
                        <span className="icon">📍</span>
                        {hostel.distance}
                      </p>
                      <p className="hostel-price">
                        <span className="icon">💰</span>
                        {hostel.price}
                      </p>
                      <p className="availability">
                        <span className="icon">✨</span>
                        {hostel.availability}
                      </p>
                    </div>

                    <div className="hostel-amenities">
                      {hostel.amenities.map((amenity, index) => (
                        <span key={index} className="amenity">
                          <span className="amenity-icon">
                            {amenity === 'Wi-Fi' && '📶'}
                            {amenity === 'Food' && '🍽️'}
                            {amenity === 'AC' && '❄️'}
                            {amenity === 'Laundry' && '🧺'}
                            {amenity === 'Gym' && '🏋️'}
                            {amenity === 'Parking' && '🅿️'}
                          </span>
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="hostel-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleHostelAction(hostel.id, 'save')}
                      >
                        <span className="icon">❤️</span>
                        Save
                      </button>
                      <button
                        className="view-btn"
                        onClick={() => handleHostelAction(hostel.id, 'view')}
                      >
                        <span className="icon">👀</span>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
