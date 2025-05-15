import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth.css';
import logo from '../assets/enhanced/cic_insurance.png';
import MiniFAQ from './shared/MiniFAQ';
import { DateRangeCalendar, MonthPicker } from './shared/Calendar';
import { isAuthenticated, logout, getCurrentUser, USER_TYPES } from '../utils/auth';
import { initializeSession } from '../utils/sessionManager';
import { getNotifications, markAsRead, markAllAsRead, NOTIFICATION_TYPES, addNotification } from '../utils/notificationManager';
import Chart from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteData = location.state || null;
  
  // Get complete user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('registrationData') || '{}');
  
  const [userData, setUserData] = useState({
    name: storedUser.firstName || 'User',
    email: storedUser.email || '',
    lastLogin: storedUser.lastLogin || new Date().toLocaleString(),
    userType: storedUser.userType || 'customer',
    fullName: `${storedUser.firstName || ''} ${storedUser.lastName || ''}`.trim(),
    mobileNo: storedUser.mobileNo || '',
    nationality: storedUser.nationality || '',
    idNumber: storedUser.id || ''
  });
  const [stats, setStats] = useState({
    totalVisits: 156,
    activeProjects: 3,
    notifications: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [quoteOptions, setQuoteOptions] = useState([
    { id: 1, name: 'Basic Cover', price: 15000, coverage: 'Essential coverage' },
    { id: 2, name: 'Standard Cover', price: 25000, coverage: 'Comprehensive coverage with added benefits' },
    { id: 3, name: 'Premium Cover', price: 40000, coverage: 'Full coverage with all benefits included' }
  ]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState(
    JSON.parse(localStorage.getItem('dashboardLayout')) || {
      showStats: true,
      showActivity: true,
      showQuickActions: true,
      showFAQ: true,
      showCalendar: true
    }
  );

  // Add useEffect to update user data when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('registrationData') || '{}');
      setUserData({
        name: updatedUser.firstName || 'User',
        email: updatedUser.email || '',
        lastLogin: updatedUser.lastLogin || new Date().toLocaleString(),
        userType: updatedUser.userType || 'customer',
        fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
        mobileNo: updatedUser.mobileNo || '',
        nationality: updatedUser.nationality || '',
        idNumber: updatedUser.id || ''
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setIsMounted(true);

    // Check if user is authenticated using the centralized utility
    if (!isAuthenticated()) {
      // User is not authenticated, redirect to login
      navigate('/login');
      return;
    }

    // Simulate fetching user data
    const fetchUserData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get user data using the centralized utility
        const currentUser = getCurrentUser();
        let userId = 'Unknown';
        let userType = USER_TYPES.CUSTOMER;

        if (currentUser) {
          userId = currentUser.id || 'Unknown';
          userType = currentUser.userType || USER_TYPES.CUSTOMER;
        }

        // For demo purposes, we'll use mock data
        if (isMounted) {
          setUserData({
            name: quoteData?.formData?.name || `User ${userId}`,
            email: quoteData?.formData?.email || 'user@example.com',
            lastLogin: new Date().toLocaleString(),
            userType: userType
          });

          setStats({
            totalVisits: 156,
            activeProjects: 3,
            notifications: 5
          });
        }

        // If we have quote data, generate some mock quote options based on product type
        if (quoteData && isMounted) {
          const productTitle = quoteData.productDetails.title;
          let basePrice = 10000;

          // Adjust base price based on product type
          if (productTitle.includes('Motor')) {
            basePrice = 15000;
          } else if (productTitle.includes('Family')) {
            basePrice = 20000;
          } else if (productTitle.includes('Seniors')) {
            basePrice = 25000;
          }

          setQuoteOptions([
            { id: 1, name: 'Basic Cover', price: basePrice, coverage: 'Essential coverage' },
            { id: 2, name: 'Standard Cover', price: basePrice * 1.5, coverage: 'Comprehensive coverage with added benefits' },
            { id: 3, name: 'Premium Cover', price: basePrice * 2.5, coverage: 'Full coverage with all benefits included' }
          ]);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching user data:', error);
        }
        if (isMounted) {
          setError('Failed to load user data. Please refresh the page.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to handle component unmounting
    return () => {
      setIsMounted(false);
    };
  }, [quoteData, navigate, isMounted]);

  // Initialize session management
  useEffect(() => {
    initializeSession(navigate, setShowSessionWarning);
  }, [navigate]);

  // Load notifications
  useEffect(() => {
    const loadNotifications = () => {
      const userNotifications = getNotifications();
      setNotifications(userNotifications);
    };

    loadNotifications();
    // Refresh notifications every minute
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const result = await logout();

      if (result.success) {
        // Show logout confirmation
        alert('You have been logged out successfully');
        // Redirect to login page
        navigate('/login');
      } else {
        alert(result.error || 'Failed to logout. Please try again.');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
      alert('Failed to logout. Please try again.');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
  };

  const handlePurchaseQuote = () => {
    alert('Thank you for your purchase! Your insurance policy will be processed shortly.');
    navigate('/');
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleStartDateChange = (date) => {
    setDateRange(prev => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({ ...prev, endDate: date }));
  };

  // Profile image handling
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dashboard customization
  const toggleDashboardSection = (section) => {
    const newLayout = {
      ...dashboardLayout,
      [section]: !dashboardLayout[section]
    };
    setDashboardLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  // Profile update handling
  const handleProfileUpdate = async (updatedData) => {
    try {
      // Update user data in localStorage
      const currentData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      const newData = { ...currentData, ...updatedData };
      localStorage.setItem('registrationData', JSON.stringify(newData));
      
      // Update state
      setUserData(prev => ({
        ...prev,
        ...updatedData,
        fullName: `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim()
      }));

      // Show success notification
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.'
      });

      setShowProfileModal(false);
    } catch (error) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    }
  };

  // Session warning modal
  const SessionWarningModal = () => showSessionWarning && (
    <div className="session-warning-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="session-warning-dialog" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3>Session Expiring</h3>
        <p>Your session will expire in 5 minutes. Would you like to stay logged in?</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={() => {
              setShowSessionWarning(false);
              initializeSession(navigate, setShowSessionWarning);
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#882323',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );

  // Profile modal
  const ProfileModal = () => showProfileModal && (
    <div className="profile-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="profile-modal" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>Edit Profile</h2>
        <div className="profile-image-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            margin: '0 auto',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#882323',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                {userData.name.charAt(0)}
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            style={{ display: 'none' }}
            id="profile-image-input"
          />
          <label
            htmlFor="profile-image-input"
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#882323',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Change Photo
          </label>
        </div>
        {/* Add profile form fields here */}
        <button
          onClick={() => setShowProfileModal(false)}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#882323',
            color: 'white',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // Notification center
  const NotificationCenter = () => showNotificationCenter && (
    <div className="notification-center" style={{
      position: 'fixed',
      top: '60px',
      right: '20px',
      width: '300px',
      maxHeight: '500px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Notifications</h3>
        <button
          onClick={() => markAllAsRead()}
          style={{
            border: 'none',
            background: 'none',
            color: '#882323',
            cursor: 'pointer'
          }}
        >
          Mark all as read
        </button>
      </div>
      <div style={{ maxHeight: '400px', overflow: 'auto', padding: '10px' }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              opacity: notification.read ? 0.7 : 1,
              cursor: 'pointer'
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
              {notification.title}
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              {notification.message}
            </div>
            <div style={{ fontSize: '0.8em', color: '#999', marginTop: '5px' }}>
              {new Date(notification.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render quote selection if we have quote data
  if (quoteData) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="CIC Insurance" className="sidebar-logo" />
            <div className="user-brief">
              <div className="user-avatar">
                {userData.name.charAt(0)}
              </div>
              <div className="user-info">
                <h3>{userData.name}</h3>
                <p>{userData.email}</p>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className="nav-item active">
              <span className="nav-icon">📊</span>
              Quote Selection
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="back-button" onClick={handleBackToProducts}>
              <span className="nav-icon">←</span>
              Back to Products
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-title">
              <h1>Select Your {quoteData.productDetails.title} Quote</h1>
              <p className="user-greeting">Thank you for your interest, {quoteData.formData.name || 'Valued Customer'}</p>
            </div>
          </header>

          <div className="quote-options-container">
            <div className="product-summary">
              <h3>Product Details</h3>
              <div className="product-card">
                <img src={quoteData.productDetails.img} alt={quoteData.productDetails.title} className="product-img" />
                <div className="product-info">
                  <h4>{quoteData.productDetails.title}</h4>
                  <p>{quoteData.productDetails.desc}</p>
                </div>
              </div>
            </div>

            <div className="quote-options">
              <h3>Available Quote Options</h3>
              <div className="quote-cards">
                {quoteOptions.map(quote => (
                  <div
                    key={quote.id}
                    className={`quote-card ${selectedQuote === quote ? 'selected' : ''}`}
                    onClick={() => handleSelectQuote(quote)}
                  >
                    <h4>{quote.name}</h4>
                    <div className="quote-price">KES {quote.price.toLocaleString()}</div>
                    <div className="quote-details">
                      <p>{quote.coverage}</p>
                    </div>
                    <button className="select-quote-btn">
                      {selectedQuote === quote ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedQuote && (
              <div className="quote-action">
                <button className="purchase-btn" onClick={handlePurchaseQuote}>
                  Purchase Selected Quote
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Render regular dashboard if no quote data
  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="CIC Insurance" className="sidebar-logo" />
          <div className="user-brief">
            <div className="user-avatar">
              {userData.name.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{userData.name}</h3>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeMenu === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveMenu('profile')}
          >
            <span className="nav-icon">👤</span>
            My Profile
          </button>
          <button
            className={`nav-item ${activeMenu === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveMenu('policies')}
          >
            <span className="nav-icon">📋</span>
            My Policies
          </button>
          <button
            className={`nav-item ${activeMenu === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveMenu('claims')}
          >
            <span className="nav-icon">🔔</span>
            Claims
          </button>
          <button
            className={`nav-item ${activeMenu === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveMenu('payments')}
          >
            <span className="nav-icon">💰</span>
            Payments
          </button>
          <button
            className={`nav-item ${activeMenu === 'support' ? 'active' : ''}`}
            onClick={() => setActiveMenu('support')}
          >
            <span className="nav-icon">🧑‍💼</span>
            Support
          </button>
          <button
            className={`nav-item ${activeMenu === 'faqs' ? 'active' : ''}`}
            onClick={() => navigate('/faqs')}
          >
            <span className="nav-icon">❓</span>
            FAQs
          </button>
          <button
            className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-status">
            <span className="status-dot online"></span>
            <span>Online</span>
          </div>
          <button className="logout-button" onClick={handleLogoutClick}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Add the logout confirmation popup */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="logout-confirm-dialog" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={handleLogoutCancel}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#882323',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add modals */}
      <SessionWarningModal />
      <ProfileModal />
      <NotificationCenter />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p className="user-greeting">Welcome back, {userData.name}</p>
          </div>
          <div className="user-profile">
            <span className="notification-badge">{stats.notifications}</span>
            <div className="profile-info">
              <p className="user-name">{userData.fullName}</p>
              <p className="user-email">{userData.email}</p>
              <p className="user-details">
                ID: {userData.idNumber} | Mobile: {userData.mobileNo}
              </p>
              <p className="last-login">Last login: {userData.lastLogin}</p>
              <p className="user-type">{userData.userType === 'intermediary' ? 'Intermediary' : 'Customer'}</p>
            </div>
            <div className="profile-avatar">
              {userData.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-details">
              <h3>Total Visits</h3>
              <p className="stat-number">{stats.totalVisits}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-details">
              <h3>Active Policies</h3>
              <p className="stat-number">{stats.activeProjects}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-details">
              <h3>Notifications</h3>
              <p className="stat-number">{stats.notifications}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-details">
                  <p>Updated your motor insurance policy</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📊</span>
                <div className="activity-details">
                  <p>Premium payment confirmed</p>
                  <small>5 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">👥</span>
                <div className="activity-details">
                  <p>Customer service chat completed</p>
                  <small>1 day ago</small>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-button">
                <span className="action-icon">📋</span>
                New Policy
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                Pay Premium
              </button>
              <button className="action-button">
                <span className="action-icon">⚙️</span>
                Update Profile
              </button>
            </div>
          </div>

          <MiniFAQ
            title="Need Help?"
            category="general"
            maxItems={2}
            showViewAll={true}
          />

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Date Selection</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>Filter by Date Range</h3>
              <DateRangeCalendar
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChangeStart={handleStartDateChange}
                onChangeEnd={handleEndDateChange}
                startLabel="From"
                endLabel="To"
                showSelectedRange={true}
              />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Select Month</h3>
              <MonthPicker
                selectedDate={selectedMonth}
                onChange={setSelectedMonth}
                label="View Reports For"
                showSelectedValue={true}
              />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;