import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import './Dashboard.css';
import './ListingCard.css';
import '../styles/ownerListings.custom.css';

const OwnerListingManagement = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API call
  const [myListings, setMyListings] = useState([
    {
      id: 1,
      name: 'Elite Girls PG',
      type: 'PG',
      price: 14500,
      occupancy: '2 sharing',
      gender: 'Female',
      status: 'active',
      views: 245,
      inquiries: 12,
      lastUpdated: '2 days ago',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry'],
      description: 'Premium PG for girls with all modern amenities',
      totalRooms: 15,
      occupiedRooms: 12,
      rating: 4.8,
      reviews: 56
    },
    {
      id: 2,
      name: 'Boys Hostel Prime',
      type: 'Hostel',
      price: 12000,
      occupancy: '3 sharing',
      gender: 'Male',
      status: 'active',
      views: 189,
      inquiries: 8,
      lastUpdated: '1 week ago',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['Wi-Fi', 'Food', 'Gym', 'Study Hall'],
      description: 'Affordable hostel for male students',
      totalRooms: 20,
      occupiedRooms: 17,
      rating: 4.5,
      reviews: 32
    }
  ]);
  const [otherListings, setOtherListings] = useState([
    {
      id: 101,
      name: 'Sunrise PG',
      type: 'PG',
      price: 11000,
      occupancy: '2 sharing',
      gender: 'Female',
      status: 'active',
      views: 120,
      inquiries: 5,
      lastUpdated: '3 days ago',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['Wi-Fi', 'AC', 'Parking', 'Security'],
      description: 'Luxury single occupancy rooms for professionals',
      totalRooms: 10,
      occupiedRooms: 0,
      rating: 4.2,
      reviews: 18
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredListings = myListings.filter(listing => {
    const matchesTab = activeTab === 'all' || listing.status === activeTab;
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'oldest':
        return new Date(a.lastUpdated) - new Date(b.lastUpdated);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      case 'inquiries':
        return b.inquiries - a.inquiries;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleStatusChange = (listingId, newStatus) => {
    setMyListings(prev => prev.map(listing => 
      listing.id === listingId ? { ...listing, status: newStatus } : listing
    ));
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setMyListings(prev => prev.filter(listing => listing.id !== listingId));
    }
  };

  // Add a summary bar for listings
  const summaryBar = (
    <div className="owner-listing-summary-bar">
      <div>Total Listings: <b>{myListings.length}</b></div>
      <div>Active: <b>{myListings.filter(l => l.status === 'active').length}</b></div>
      <div>Occupancy: <b>{Math.round((myListings.reduce((acc, l) => acc + l.occupiedRooms, 0) / myListings.reduce((acc, l) => acc + l.totalRooms, 0)) * 100) || 0}%</b></div>
      <div>Revenue: <b>₹{myListings.reduce((acc, l) => acc + l.price * l.occupiedRooms, 0).toLocaleString()}</b></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="owner-listing-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="listing-main-content" style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: '32px 32px 0 32px' }}>
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1>Manage Listings</h1>
              <p>Create, edit, and manage your property listings</p>
            </div>
            <div className="header-actions">
              <button 
                className="primary-btn"
                onClick={() => navigate('/add-listing')}
              >
                ➕ Add New Listing
              </button>
            </div>
          </div>

          {/* Summary Bar */}
          {summaryBar}

          {/* Quick Stats */}
          <div className="quick-stats-row">
            <div className="stat-item">
              <span className="stat-number">{myListings.filter(l => l.status === 'active').length}</span>
              <span className="stat-label">Active Listings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{myListings.reduce((sum, l) => sum + l.views, 0)}</span>
              <span className="stat-label">Total Views</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{myListings.reduce((sum, l) => sum + l.inquiries, 0)}</span>
              <span className="stat-label">Total Inquiries</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Math.round(myListings.reduce((sum, l) => sum + l.rating, 0) / myListings.filter(l => l.rating > 0).length * 10) / 10 || 0}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="listings-controls">
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All ({myListings.length})
                </button>
                <button 
                  className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active ({myListings.filter(l => l.status === 'active').length})
                </button>
                <button 
                  className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inactive')}
                >
                  Inactive ({myListings.filter(l => l.status === 'inactive').length})
                </button>
                <button 
                  className={`tab ${activeTab === 'draft' ? 'active' : ''}`}
                  onClick={() => setActiveTab('draft')}
                >
                  Drafts ({myListings.filter(l => l.status === 'draft').length})
                </button>
              </div>
            </div>

            <div className="search-and-sort">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="views">Most Views</option>
                <option value="inquiries">Most Inquiries</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="listings-section">
            <h2 style={{marginTop: 24}}>My Listings</h2>
            <div className="listings-grid">
              {myListings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No listings found</h3>
                  <button 
                    className="primary-btn"
                    onClick={() => navigate('/add-listing')}
                  >
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                myListings.map(listing => (
                  <div key={listing.id} className="owner-listing-card">
                    <div className="listing-image">
                      <img src={listing.image} alt={listing.name} />
                      <div className="listing-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(listing.status) }}
                        >
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="listing-content">
                      <div className="listing-header">
                        <h3>{listing.name}</h3>
                        <div className="listing-type-badge">{listing.type}</div>
                      </div>

                      <div className="listing-details">
                        <p className="listing-description">{listing.description}</p>
                        <div className="detail-row">
                          <span>💰 ₹{listing.price.toLocaleString()}/month</span>
                          <span>👥 {listing.occupancy}</span>
                          <span>⚧ {listing.gender}</span>
                        </div>
                        <div className="detail-row">
                          <span>🏠 {listing.occupiedRooms}/{listing.totalRooms} occupied</span>
                          {listing.rating > 0 && (
                            <span>⭐ {listing.rating} ({listing.reviews} reviews)</span>
                          )}
                        </div>
                      </div>

                      <div className="listing-stats">
                        <div className="stat">
                          <span className="stat-number">{listing.views}</span>
                          <span className="stat-label">Views</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{listing.inquiries}</span>
                          <span className="stat-label">Inquiries</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{listing.lastUpdated}</span>
                          <span className="stat-label">Updated</span>
                        </div>
                      </div>

                      <div className="listing-amenities">
                        {listing.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                        {listing.amenities.length > 4 && (
                          <span className="amenity-tag more">+{listing.amenities.length - 4} more</span>
                        )}
                      </div>

                      <div className="listing-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => navigate(`/hostel/${listing.id}`)}
                        >
                          👁️ View
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => alert('Edit listing feature coming soon!')}
                        >
                          ✏️ Edit
                        </button>
                        <div className="status-dropdown">
                          <select 
                            value={listing.status}
                            onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="listings-section">
            <h2 style={{marginTop: 48}}>Other Listings</h2>
            <div className="listings-grid">
              {otherListings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No other listings found</h3>
                </div>
              ) : (
                otherListings.map(listing => (
                  <div key={listing.id} className="owner-listing-card">
                    <div className="listing-image">
                      <img src={listing.image} alt={listing.name} />
                      <div className="listing-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(listing.status) }}
                        >
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="listing-content">
                      <div className="listing-header">
                        <h3>{listing.name}</h3>
                        <div className="listing-type-badge">{listing.type}</div>
                      </div>

                      <div className="listing-details">
                        <p className="listing-description">{listing.description}</p>
                        <div className="detail-row">
                          <span>💰 ₹{listing.price.toLocaleString()}/month</span>
                          <span>👥 {listing.occupancy}</span>
                          <span>⚧ {listing.gender}</span>
                        </div>
                        <div className="detail-row">
                          <span>🏠 {listing.occupiedRooms}/{listing.totalRooms} occupied</span>
                          {listing.rating > 0 && (
                            <span>⭐ {listing.rating} ({listing.reviews} reviews)</span>
                          )}
                        </div>
                      </div>

                      <div className="listing-stats">
                        <div className="stat">
                          <span className="stat-number">{listing.views}</span>
                          <span className="stat-label">Views</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{listing.inquiries}</span>
                          <span className="stat-label">Inquiries</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{listing.lastUpdated}</span>
                          <span className="stat-label">Updated</span>
                        </div>
                      </div>

                      <div className="listing-amenities">
                        {listing.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                        {listing.amenities.length > 4 && (
                          <span className="amenity-tag more">+{listing.amenities.length - 4} more</span>
                        )}
                      </div>

                      <div className="listing-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => navigate(`/hostel/${listing.id}`)}
                        >
                          👁️ View
                        </button>
                        {/* No edit/delete/status for other listings */}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {sortedListings.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                Showing {sortedListings.length} of {myListings.length} listings
              </div>
              <div className="bulk-buttons">
                <button className="secondary-btn">Export Data</button>
                <button className="secondary-btn">Bulk Edit</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
      />
    </div>
  );
};

export default OwnerListingManagement;