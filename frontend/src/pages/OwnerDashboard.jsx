import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import '../styles/ownerProfile.custom.css';
import '../styles/owner.css';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [ownerData, setOwnerData] = useState({ fullname: 'Owner', organization: 'My PG Business', listings: [] });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOwner = async () => {
            setIsLoading(true);
            try {
                const response = await authService.getCurrentUser();
                if (response.success && response.data) {
                    setOwnerData(prev => ({
                        ...prev,
                        ...response.data,
                        listings: response.data.listings || prev.listings
                    }));
                }
            } catch (err) {
                // Optionally handle error
            } finally {
                setIsLoading(false);
            }
        };
        fetchOwner();
    }, []);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Owner stats mock
    const ownerStats = {
        totalListings: {
            count: ownerData?.listings?.length || '0',
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
            secondaryText: 'Current month',
            trend: 'up',
            trendValue: '8%',
            icon: '💰'
        }
    };

    // Quick Actions for owner
    const quickActions = [
        {
            title: 'Add New Listing',
            description: 'Create a new hostel/PG listing',
            icon: '➕',
            action: () => navigate('/owner-listings'),
            color: 'blue'
        },
        {
            title: 'Manage Listings',
            description: 'Edit your existing properties',
            icon: '📝',
            action: () => navigate('/owner-listings'),
            color: 'green'
        },
        {
            title: 'View Inquiries',
            description: 'Check new student inquiries',
            icon: '💬',
            action: () => navigate('/owner-dashboard'),
            color: 'purple'
        },
        {
            title: 'Analytics',
            description: 'View detailed reports',
            icon: '📈',
            action: () => navigate('/owner-dashboard'),
            color: 'orange'
        }
    ];

    // Recent Activities mock data
    const recentActivities = [
        {
            id: 1,
            type: 'inquiry',
            title: 'New inquiry for Elite Girls PG',
            description: 'Priya Sharma is interested in your 2-sharing room',
            time: '2 hours ago',
            status: 'unread',
            priority: 'high'
        },
        {
            id: 2,
            type: 'booking',
            title: 'Room booking confirmed',
            description: 'Room 201 in Boys Hostel Prime has been booked',
            time: '4 hours ago',
            status: 'read',
            priority: 'medium'
        },
        {
            id: 3,
            type: 'review',
            title: 'New review received',
            description: 'Rajesh Kumar rated your property 5 stars',
            time: '1 day ago',
            status: 'read',
            priority: 'low'
        },
        {
            id: 4,
            type: 'payment',
            title: 'Payment received',
            description: 'Monthly rent payment from Room 105',
            time: '2 days ago',
            status: 'read',
            priority: 'low'
        }
    ];

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="owner-dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
            <div className="main-content" style={{ flex: 1, marginLeft: isSidebarCollapsed ? 80 : 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: 1, padding: '32px 32px 0 32px' }}>
                    {/* Header */}
                    <div className="dashboard-header">
                        <div className="header-content">
                            <h1>Owner Dashboard</h1>
                            <p>Welcome back, {ownerData?.fullname || 'Owner'}! Here's what's happening with your properties.</p>
                        </div>
                        <div className="header-actions">
                            <div className="profile-dropdown" ref={dropdownRef}>
                                <button 
                                    className="profile-trigger"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="profile-avatar">
                                        {ownerData?.fullname?.charAt(0) || 'O'}
                                    </div>
                                    <span>{ownerData?.fullname || 'Owner'}</span>
                                    <i className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></i>
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <a href="/owner-profile" className="dropdown-item">
                                            <i className="icon">👤</i>
                                            Profile Settings
                                        </a>
                                        <a href="/owner-listings" className="dropdown-item">
                                            <i className="icon">🏠</i>
                                            My Listings
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <button 
                                            className="dropdown-item logout"
                                            onClick={async () => {
                                                await authService.logout();
                                                navigate('/login');
                                            }}
                                        >
                                            <i className="icon">🚪</i>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {Object.entries(ownerStats).map(([key, stat]) => (
                            <div key={key} className="stat-card">
                                <div className="stat-content">
                                    <div className="stat-header">
                                        <span className="stat-icon">{stat.icon}</span>
                                        <span className="stat-count">{stat.count}</span>
                                        {stat.new && <span className="stat-new">{stat.new}</span>}
                                    </div>
                                    <div className="stat-details">
                                        <h3>{stat.subtitle}</h3>
                                        <p>{stat.secondaryText}</p>
                                        {stat.trend && (
                                            <div className={`trend ${stat.trend}`}>
                                                <span className="trend-icon">{stat.trend === 'up' ? '↗' : '↘'}</span>
                                                <span>{stat.trendValue}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Quick Actions */}
                    <div className="section">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions-grid">
                            {quickActions.map((action, index) => (
                                <div 
                                    key={index} 
                                    className={`quick-action-card ${action.color}`}
                                    onClick={action.action}
                                >
                                    <div className="action-icon">{action.icon}</div>
                                    <h3>{action.title}</h3>
                                    <p>{action.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Recent Activities */}
                    <div className="section">
                        <div className="section-header">
                            <h2>Recent Activities</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <div className="activities-list">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className={`activity-item ${activity.status}`}>
                                    <div className={`activity-indicator ${activity.type} ${activity.priority}`}></div>
                                    <div className="activity-content">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.description}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                    <div className="activity-actions">
                                        {activity.status === 'unread' && (
                                            <button className="mark-read-btn">Mark as Read</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Organization Info */}
                    {ownerData?.organization && (
                        <div className="section">
                            <h2>Organization Details</h2>
                            <div className="organization-card">
                                <div className="org-icon">🏢</div>
                                <div className="org-details">
                                    <h3>{ownerData.organization}</h3>
                                    <p>Primary business name for your listings</p>
                                    <button 
                                        className="edit-org-btn"
                                        onClick={() => navigate('/owner-profile')}
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Mobile Menu */}
                    <MobileMenu 
                        isOpen={isMobileMenuOpen} 
                        setIsOpen={setIsMobileMenuOpen}
                    />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default OwnerDashboard;
