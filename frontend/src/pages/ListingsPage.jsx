import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListingCard.css';
import authService from '../services/authService';
import './ListingCard.advanced.css';
import Sidebar from '../components/Sidebar';
import '../components/Sidebar.css';


const ListingsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([5000, 20000]);
  const [genderFilter, setGenderFilter] = useState('any');
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [occupancyFilter, setOccupancyFilter] = useState('any');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState('any');
  const [distanceFilter, setDistanceFilter] = useState(5);
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    const checkUserType = async () => {
      const userType = authService.getUserType();
      setIsOwner(userType === 'owner');
      
      if (userType === 'owner') {
        try {
          const response = await authService.getCurrentOwner();
          if (response.success) {
            setOwnerData(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch owner data:', error);
        }
      }
    };

    checkUserType();
  }, []);

  // Dummy data with more diversity
  const listings = [
    {
      id: 5,
      name: 'Elite Girls PG',
      type: 'PG',
      price: 14500,
      distance: 2.1,
      rating: 4.9,
      reviews: 312,
      occupancy: '1 sharing',
      gender: 'Female',
      available: true,
      amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Parking', 'Gym', 'Garden'],
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Downtown',
      description: 'Premium PG for girls with all modern amenities and security.',
      owner: 'Ms. Ritu Singh',
      ownerId: 'owner123', // This will be the logged-in owner's listing
      verified: true,
      featured: true,
      compatibility: 98,
      lastUpdated: 'Today'
    },
    {
      id: 6,
      name: 'Boys Hostel Prime',
      type: 'Hostel',
      price: 8000,
      distance: 3.5,
      rating: 4.0,
      reviews: 67,
      occupancy: '3 sharing',
      gender: 'Male',
      available: false,
      amenities: ['Wi-Fi', 'Parking', 'Laundry'],
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'West End',
      description: 'Affordable boys hostel with basic facilities and easy commute.',
      owner: 'Mr. Suresh Mehta',
      ownerId: 'owner123', // This will be the logged-in owner's listing
      verified: false,
      featured: false,
      compatibility: 75,
      lastUpdated: '5 days ago'
    },
    {
      id: 7,
      name: 'Urban Studio Apartment',
      type: 'Apartment',
      price: 18000,
      distance: 0.3,
      rating: 4.6,
      reviews: 54,
      occupancy: 'Studio',
      gender: 'Any',
      available: true,
      amenities: ['Wi-Fi', 'AC', 'Kitchen', 'Parking', 'Balcony'],
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Central Plaza',
      description: 'Modern studio apartment for students who want privacy and comfort.',
      owner: 'Mr. John Dsouza',
      ownerId: 'other_owner',
      verified: true,
      featured: false,
      compatibility: 90,
      lastUpdated: 'Today'
    },
    {
      id: 8,
      name: 'Budget Boys PG',
      type: 'PG',
      price: 6000,
      distance: 4.2,
      rating: 3.8,
      reviews: 23,
      occupancy: '4 sharing',
      gender: 'Male',
      available: true,
      amenities: ['Wi-Fi', 'Parking'],
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Suburb Area',
      description: 'Best for students on a tight budget. Basic amenities included.',
      owner: 'Mr. Manoj Kumar',
      verified: false,
      featured: false,
      compatibility: 70,
      lastUpdated: '2 weeks ago'
    },
    {
      id: 1,
      name: 'Student Haven PG',
      type: 'PG',
      price: 9500,
      distance: 0.8,
      rating: 4.5,
      reviews: 127,
      occupancy: '2 sharing',
      gender: 'Male',
      available: true,
      amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Parking'],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Near MIT College',
      description: 'Modern PG with all amenities, perfect for students. Clean rooms with attached bathrooms.',
      owner: 'Mrs. Priya Sharma',
      verified: true,
      featured: true,
      compatibility: 95,
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      name: 'Comfort Zone Hostel',
      type: 'Hostel',
      price: 11000,
      distance: 1.2,
      rating: 4.2,
      reviews: 89,
      occupancy: '3 sharing',
      gender: 'Any',
      available: true,
      amenities: ['Wi-Fi', 'Laundry', 'Gym', 'Study Room'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Near City Center',
      description: 'Spacious hostel with gym facilities and study rooms. Great for active students.',
      owner: 'Mr. Rajesh Kumar',
      verified: true,
      featured: false,
      compatibility: 88,
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      name: 'Green Valley PG',
      type: 'PG',
      price: 8800,
      distance: 1.5,
      rating: 4.7,
      reviews: 203,
      occupancy: '1 sharing',
      gender: 'Female',
      available: true,
      amenities: ['Wi-Fi', 'Food', 'Parking', 'Garden'],
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Green Park Area',
      description: 'Peaceful PG with garden view. Perfect for students who prefer quiet environment.',
      owner: 'Mrs. Lakshmi Devi',
      verified: true,
      featured: true,
      compatibility: 92,
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Tech Hub Accommodation',
      type: 'Apartment',
      price: 13500,
      distance: 0.5,
      rating: 4.8,
      reviews: 156,
      occupancy: '2 sharing',
      gender: 'Any',
      available: false,
      amenities: ['Wi-Fi', 'AC', 'Kitchen', 'Balcony'],
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: 'Tech Park Area',
      description: 'Modern apartment with kitchen facilities. Ideal for tech students.',
      owner: 'Mr. Amit Patel',
      verified: true,
      featured: false,
      compatibility: 85,
      lastUpdated: '1 day ago'
    }
  ];

  // All possible amenities for filter
  const allAmenities = [
    'Wi-Fi', 'Food', 'AC', 'Laundry', 'Parking', 'Gym', 'Study Room', 'Kitchen', 'Balcony', 'Garden'
  ];

  // All possible occupancies
  const allOccupancies = [
    '1 sharing', '2 sharing', '3 sharing', '4 sharing', 'Studio'
  ];

  // Filtering logic
  let filteredListings = listings.filter(listing => {
    const matchesFilter = filter === 'all' ||
      (filter === 'pg' && listing.type === 'PG') ||
      (filter === 'hostel' && listing.type === 'Hostel') ||
      (filter === 'apartment' && listing.type === 'Apartment');
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesGender = genderFilter === 'any' || listing.gender.toLowerCase() === genderFilter;
    const matchesAmenities = amenitiesFilter.length === 0 || amenitiesFilter.every(a => listing.amenities.includes(a));
    const matchesOccupancy = occupancyFilter === 'any' || listing.occupancy === occupancyFilter;
    const matchesRating = ratingFilter === 0 || listing.rating >= ratingFilter;
    const matchesAvailability = availabilityFilter === 'any' || (availabilityFilter === 'available' ? listing.available : !listing.available);
    const matchesDistance = listing.distance <= distanceFilter;
    return matchesFilter && matchesSearch && matchesPrice && matchesGender && matchesAmenities && matchesOccupancy && matchesRating && matchesAvailability && matchesDistance;
  });

  // Sorting with owner's listings prioritized
  const currentOwnerId = ownerData?._id || 'owner123'; // Use actual owner ID or mock ID for demo
  
  filteredListings = filteredListings.sort((a, b) => {
    // First priority: Show owner's listings first if user is an owner
    if (isOwner) {
      const aIsOwners = a.ownerId === currentOwnerId;
      const bIsOwners = b.ownerId === currentOwnerId;
      
      if (aIsOwners && !bIsOwners) return -1;
      if (!aIsOwners && bIsOwners) return 1;
    }
    
    // Second priority: Apply the selected sorting
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distance - b.distance;
    
    // Default: relevance (compatibility score)
    return b.compatibility - a.compatibility;
  });

  // Separate owner's listings and other listings for display purposes
  const ownerListings = isOwner ? filteredListings.filter(listing => listing.ownerId === currentOwnerId) : [];
  const otherListings = isOwner ? filteredListings.filter(listing => listing.ownerId !== currentOwnerId) : filteredListings;
  // Filter chips for active filters
  const filterChips = [];
  if (genderFilter !== 'any') filterChips.push({ label: genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1), onRemove: () => setGenderFilter('any') });
  if (amenitiesFilter.length > 0) amenitiesFilter.forEach(a => filterChips.push({ label: a, onRemove: () => setAmenitiesFilter(amenitiesFilter.filter(am => am !== a)) }));
  if (occupancyFilter !== 'any') filterChips.push({ label: occupancyFilter, onRemove: () => setOccupancyFilter('any') });
  if (ratingFilter > 0) filterChips.push({ label: `Rating ${ratingFilter}+`, onRemove: () => setRatingFilter(0) });
  if (availabilityFilter !== 'any') filterChips.push({ label: availabilityFilter === 'available' ? 'Available' : 'Booked', onRemove: () => setAvailabilityFilter('any') });
  if (distanceFilter < 5) filterChips.push({ label: `≤ ${distanceFilter}km`, onRemove: () => setDistanceFilter(5) });

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 80) return 'from-blue-400 to-indigo-500';
    if (score >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className={`listing-page-container${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="listing-page-wrapper">
        {/* Header */}
        <div className="listing-header">
          <div className="listing-header-row">
            <div>
              <h1 className="listing-title">
                <span className="listing-title-icon" role="img" aria-label="building">🏢</span>
                Accommodation Listings
              </h1>
              <p className="listing-subtitle">Find the perfect accommodation that matches your lifestyle and budget</p>
            </div>
            <div className="listing-header-actions">
              <div className="listing-search-wrapper">
                <span className="listing-search-icon" role="img" aria-label="search">🔍</span>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="listing-search-input"
                />
              </div>
              <button className="btn-secondary listing-advanced-filter-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                <span className="listing-advanced-filter-icon" role="img" aria-label="filter">⚙️</span>
                Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="advanced-filters-panel">
            <div className="advanced-filters-row">
              {/* Gender */}
              <div className="advanced-filter-group">
                <label>Gender</label>
                <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {/* Occupancy */}
              <div className="advanced-filter-group">
                <label>Occupancy</label>
                <select value={occupancyFilter} onChange={e => setOccupancyFilter(e.target.value)}>
                  <option value="any">Any</option>
                  {allOccupancies.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {/* Rating */}
              <div className="advanced-filter-group">
                <label>Min. Rating</label>
                <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))}>
                  <option value={0}>Any</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </div>
              {/* Availability */}
              <div className="advanced-filter-group">
                <label>Availability</label>
                <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              {/* Distance */}
              <div className="advanced-filter-group">
                <label>Max Distance (km)</label>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={distanceFilter}
                  onChange={e => setDistanceFilter(Number(e.target.value))}
                  className="advanced-filter-slider"
                />
                <span className="distance-value">{distanceFilter} km</span>
              </div>
            </div>
            
            {/* Amenities in separate row for better spacing */}
            <div className="advanced-filter-group amenities-group">
              <label>Amenities</label>
              <div className="advanced-filter-amenities">
                {allAmenities.map(a => (
                  <div key={a} className="amenity-item">
                    <input
                      type="checkbox"
                      id={`amenity-${a}`}
                      checked={amenitiesFilter.includes(a)}
                      onChange={e => {
                        if (e.target.checked) setAmenitiesFilter([...amenitiesFilter, a]);
                        else setAmenitiesFilter(amenitiesFilter.filter(am => am !== a));
                      }}
                    />
                    <label htmlFor={`amenity-${a}`}>{a}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="advanced-filters-actions">
              <button className="btn-secondary" onClick={() => {
                setGenderFilter('any');
                setAmenitiesFilter([]);
                setOccupancyFilter('any');
                setRatingFilter(0);
                setAvailabilityFilter('any');
                setDistanceFilter(5);
              }}>Clear Filters</button>
              <button className="btn-primary" onClick={() => setShowAdvanced(false)}>Apply</button>
            </div>
          </div>
        )}

        {/* Filter Tabs, Price Range, Sort By */}
        <div className="listing-filters-section">
          <div className="listing-filter-tabs">
            {[
              { id: 'all', label: 'All Types', count: listings.length },
              { id: 'pg', label: 'PG', count: listings.filter(l => l.type === 'PG').length },
              { id: 'hostel', label: 'Hostel', count: listings.filter(l => l.type === 'Hostel').length },
              { id: 'apartment', label: 'Apartment', count: listings.filter(l => l.type === 'Apartment').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`listing-filter-tab ${filter === tab.id ? 'active' : ''}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <div className="listing-filters-row">
            <div className="listing-price-range-box">
              <label className="listing-price-range-label">Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</label>
              <input
                type="range"
                min="5000"
                max="20000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="listing-price-range-slider"
              />
            </div>
            <div className="listing-sort-by">
              <label>Sort By:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
          {/* Filter Chips */}
          {filterChips.length > 0 && (
            <div className="filter-chips-row">
              {filterChips.map((chip, idx) => (
                <span key={idx} className="filter-chip">
                  {chip.label}
                  <button className="filter-chip-remove" onClick={chip.onRemove}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Listings Grid */}
        <div className="listing-grid">
          {/* Owner's Listings Section */}
          {isOwner && ownerListings.length > 0 && (
            <>
              <div className="listings-section-header">
                <h3 className="listings-section-title">
                  🏢 Your Listings ({ownerListings.length})
                </h3>
                <p className="listings-section-subtitle">Manage and view your property listings</p>
                <button 
                  className="manage-listings-btn"
                  onClick={() => navigate('/owner-listings')}
                >
                  Manage All Listings
                </button>
              </div>
              {ownerListings.map((listing) => (
                <div key={`owner-${listing.id}`} className="listing-card owner-listing">
                  <div className="owner-listing-label">Your Property</div>
                  <div 
                    className="listing-card-image-wrapper"
                    onClick={() => navigate(`/hostel/${listing.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img className="listing-card-image" src={listing.image} alt={listing.name} />
                    {/* Badges */}
                    <div className="listing-card-badges">
                      {listing.featured && (
                        <span className="listing-badge-featured">
                          Featured
                        </span>
                      )}
                      <span className="listing-badge-type">
                        {listing.type}
                      </span>
                      <span className="listing-badge-owner">
                        Owner
                      </span>
                    </div>
                    {/* Rating */}
                    <div className="listing-card-rating">
                      <div className="listing-card-rating-inner">
                        <span className="listing-card-rating-star" role="img" aria-label="star">⭐</span>
                        <span className="listing-card-rating-value">{listing.rating}</span>
                      </div>
                    </div>
                    {/* Owner Actions */}
                    <div className="owner-listing-actions">
                      <button 
                        className="owner-action-btn edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/owner/edit-listing/${listing.id}`);
                        }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="owner-action-btn stats"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Show stats modal or navigate to stats page
                        }}
                      >
                        📊
                      </button>
                    </div>
                  </div>
                  <div className="listing-card-content" onClick={() => navigate(`/hostel/${listing.id}`)}>
                    <div className="listing-card-header">
                      <h3 className="listing-card-title">{listing.name}</h3>
                      <div className="listing-card-verified">
                        {listing.verified && <span className="listing-verified-icon" role="img" aria-label="verified">✅</span>}
                      </div>
                    </div>
                    <p className="listing-card-description">{listing.description}</p>
                    <div className="listing-card-info">
                      <div className="listing-card-info-row">
                        <span className="listing-card-location">📍 {listing.location}</span>
                        <span className="listing-card-distance">{listing.distance} km away</span>
                      </div>
                      <div className="listing-card-info-row">
                        <span className="listing-card-occupancy">👥 {listing.occupancy}</span>
                        <span className="listing-card-gender">⚧ {listing.gender}</span>
                      </div>
                    </div>
                    <div className="listing-card-amenities">
                      {listing.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="listing-amenity-tag">{amenity}</span>
                      ))}
                      {listing.amenities.length > 4 && (
                        <span className="listing-amenity-tag listing-amenity-more">+{listing.amenities.length - 4} more</span>
                      )}
                    </div>
                    <div className="listing-card-footer">
                      <div className="listing-card-price">
                        <span className="listing-card-price-amount">₹{listing.price.toLocaleString()}</span>
                        <span className="listing-card-price-period">/month</span>
                      </div>
                      <span className={`listing-card-availability ${listing.available ? 'available' : 'unavailable'}`}>
                        {listing.available ? '✅ Available' : '❌ Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Separator for other listings */}
              {otherListings.length > 0 && (
                <div className="listings-section-header">
                  <h3 className="listings-section-title">
                    🔍 Other Available Properties ({otherListings.length})
                  </h3>
                  <p className="listings-section-subtitle">Explore more accommodation options</p>
                </div>
              )}
            </>
          )}

          {/* Other Listings or All Listings for Students */}
          {(isOwner ? otherListings : filteredListings).map((listing) => (
            <div key={listing.id} className="listing-card">
              <div 
                className="listing-card-image-wrapper"
                onClick={() => navigate(`/hostel/${listing.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img className="listing-card-image" src={listing.image} alt={listing.name} />
                {/* Badges */}
                <div className="listing-card-badges">
                  {listing.featured && (
                    <span className="listing-badge-featured">
                      Featured
                    </span>
                  )}
                  <span className="listing-badge-type">
                    {listing.type}
                  </span>
                </div>
                {/* Rating */}
                <div className="listing-card-rating">
                  <div className="listing-card-rating-inner">
                    <span className="listing-card-rating-star" role="img" aria-label="star">⭐</span>
                    <span className="listing-card-rating-value">{listing.rating}</span>
                  </div>
                </div>
                {/* Compatibility Score */}
                <div className="listing-card-compatibility">
                  <div className={`listing-card-compatibility-inner ${getCompatibilityColor(listing.compatibility)}`}>
                    <span className="listing-card-compatibility-value">{listing.compatibility}%</span>
                  </div>
                </div>
                {/* Availability Status */}
                <div className="listing-card-availability">
                  <span className={`listing-card-availability-status ${listing.available ? 'available' : 'booked'}`}>
                    {listing.available ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>
              <div className="listing-card-content">
                <div className="listing-card-title-row">
                  <div>
                    <h3 
                      className="listing-card-title"
                      onClick={() => navigate(`/hostel/${listing.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {listing.name}
                    </h3>
                    <p className="listing-card-location">
                      <span className="listing-card-location-icon" role="img" aria-label="location">📍</span>
                      {listing.location} • {listing.distance}km away
                    </p>
                  </div>
                </div>
                <div className="listing-card-info-row">
                  <div className="listing-card-info-occupancy">
                    <div className="listing-card-info-occupancy-inner">
                      <span className="listing-card-info-occupancy-icon" role="img" aria-label="occupancy">👥</span>
                      <span className="listing-card-info-occupancy-value">{listing.occupancy}</span>
                    </div>
                    <div className="listing-card-info-gender">
                      <span className="listing-card-info-gender-dot">•</span>
                      <span className="listing-card-info-gender-value">{listing.gender}</span>
                    </div>
                  </div>
                  <div className="listing-card-info-price">
                    <p className="listing-card-info-price-value">₹{listing.price.toLocaleString()}</p>
                    <p className="listing-card-info-price-label">per month</p>
                  </div>
                </div>
                <p className="listing-card-description">{listing.description}</p>
                {/* Amenities */}
                <div className="listing-card-amenities">
                  {listing.amenities.map((amenity, index) => (
                    <span key={index} className="listing-card-amenity">
                      {amenity === 'Wi-Fi' && <span className="listing-card-amenity-icon" role="img" aria-label="wifi">📶</span>}
                      {amenity === 'Food' && <span className="listing-card-amenity-icon" role="img" aria-label="food">🍽️</span>}
                      {amenity === 'Gym' && <span className="listing-card-amenity-icon" role="img" aria-label="gym">🏋️</span>}
                      {amenity === 'Parking' && <span className="listing-card-amenity-icon" role="img" aria-label="parking">🅿️</span>}
                      {amenity === 'AC' && <span className="listing-card-amenity-icon" role="img" aria-label="ac">❄️</span>}
                      {amenity === 'Laundry' && <span className="listing-card-amenity-icon" role="img" aria-label="laundry">🧺</span>}
                      {amenity === 'Kitchen' && <span className="listing-card-amenity-icon" role="img" aria-label="kitchen">🍳</span>}
                      {amenity === 'Balcony' && <span className="listing-card-amenity-icon" role="img" aria-label="balcony">🏠</span>}
                      {amenity === 'Study Room' && <span className="listing-card-amenity-icon" role="img" aria-label="study room">📚</span>}
                      {amenity === 'Garden' && <span className="listing-card-amenity-icon" role="img" aria-label="garden">🌱</span>}
                      {amenity}
                    </span>
                  ))}
                </div>
                {/* Owner Info */}
                <div className="listing-card-owner-info">
                  <div className="listing-card-owner-info-inner">
                    <span className="listing-card-owner-label">Owner:</span>
                    <span className="listing-card-owner-name">{listing.owner}</span>
                    {listing.verified && <span className="listing-card-owner-verified" role="img" aria-label="verified">✅</span>}
                  </div>
                  <span className="listing-card-owner-updated">{listing.lastUpdated}</span>
                </div>
                {/* Action Buttons */}
                <div className="listing-card-actions">
                  <button className="btn-primary listing-card-action-contact">
                    <span className="listing-card-action-icon" role="img" aria-label="phone">📞</span>
                    Contact Owner
                  </button>
                  <button className="btn-secondary listing-card-action-fav">
                    <span className="listing-card-action-icon" role="img" aria-label="favorite">❤️</span>
                  </button>
                  <button className="btn-secondary listing-card-action-share">
                    <span className="listing-card-action-icon" role="img" aria-label="share">🔗</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredListings.length === 0 && (
          <div className="listing-no-results">
            <span className="listing-no-results-icon" role="img" aria-label="building">🏢</span>
            <h3 className="listing-no-results-title">No listings found</h3>
            <p className="listing-no-results-desc">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Results Summary for Owners */}
        {isOwner && filteredListings.length > 0 && (
          <div className="listings-summary">
            <p>
              Showing {ownerListings.length} of your listings and {otherListings.length} other properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;