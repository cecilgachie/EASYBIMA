import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FAQSection from './shared/FAQSection';
import '../styles/auth.css';
import cicLogo from '../assets/cic_insurance.png';

const FAQs = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="page-container">
      {/* Header with logo and navigation */}
      <header className="cover-header">
        <div className="logo">
          {!logoError ? (
            <img 
              src={cicLogo} 
              alt="CIC GROUP" 
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '1.5rem', 
              color: '#800000' 
            }}>
              CIC GROUP
            </div>
          )}
        </div>
        <div className="cover-nav">
          <Link to="/" className="nav-link">Home</Link>
          <div className="auth-links">
            <Link to="/login" className="nav-link login-link">
              <i className="fa-regular fa-user"></i> Login
            </Link>
          </div>
        </div>
      </header>

      <div className="content-wrap">
        {/* Main FAQ Section using the shared component */}
        <FAQSection 
          showTitle={true}
          showCategories={true}
          showSearch={true}
          showContactCTA={true}
        />
      </div>

      <footer className="cic-footer">
        <div className="footer-content">
          <p>Let us guide you through your life's journey</p>
          <p className="contact-info">
            Call us directly on 0703 099 120 or Email us at <a 
              href="mailto:callc@cic.co.ke" 
              style={{ 
                color: 'white', 
                textDecoration: 'underline' 
              }}
            >
              callc@cic.co.ke
            </a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FAQs; 