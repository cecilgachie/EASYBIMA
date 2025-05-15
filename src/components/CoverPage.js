import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import ProductSelectionModal from './productselectionmodule';
import cicLogo from '../assets/enhanced/cic_insurance.png';
import fillFormImg from '../assets/fill-form.png';
import quotationImg from '../assets/quotation.png';
import policyImg from '../assets/policy.png';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Preload images
  useEffect(() => {
    const images = [fillFormImg, quotationImg, policyImg];
    let loadedCount = 0;
    const errors = {};

    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        errors[`image${index}`] = true;
        setImageErrors(prev => ({ ...prev, [`image${index}`]: true }));
        loadedCount++;
        if (loadedCount === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  const renderImage = (src, alt, index) => {
    if (imageErrors[`image${index}`]) {
      return (
        <div className="image-placeholder" style={{
          backgroundColor: '#f0f0f0',
          width: '100%',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px'
        }}>
          <span>{alt}</span>
        </div>
      );
    }
    return <img src={src} alt={alt} onError={() => setImageErrors(prev => ({ ...prev, [`image${index}`]: true }))} />;
  };

  if (!imagesLoaded) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #800000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="cover-header">
        <div className="logo">
          <img src={cicLogo} alt="CIC GROUP" onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div style="font-weight: bold; font-size: 1.5rem; color: #800000;">CIC GROUP</div>';
          }} />
        </div>
        <div className="cover-nav" style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <Link to="/faqs" className="nav-link">FAQs</Link>
          </div>
          <div className="auth-links">
            <Link to="/login" className="nav-link login-link">
              <i className="fa-regular fa-user"></i> Login
            </Link>
          </div>
      </header>

      <div className="content-wrap">
        <div className="welcome-text">
          <h2>Welcome to CIC Insurance Group</h2>
          <h1>We keep our word</h1>
          <p className="steps-intro">Getting Insured with us is easy as 1-2-3</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-image">
              {renderImage(fillFormImg, "Fill in details", 0)}
            </div>
            <div className="step-number">1</div>
            <h3>Fill in some details</h3>
            <p>Fill in basic information about yourself and what you want to cover.</p>
          </div>

          <div className="step">
            <div className="step-image">
              {renderImage(quotationImg, "Get a quotation", 1)}
            </div>
            <div className="step-number">2</div>
            <h3>Get a quotation</h3>
            <p>Pick from different quotations the cover that is best for you.</p>
          </div>

          <div className="step">
            <div className="step-image">
              {renderImage(policyImg, "Buy & Get Covered", 2)}
            </div>
            <div className="step-number">3</div>
            <h3>Buy & Get Covered</h3>
            <p>Buy the cover you like and enjoy the personal attention you deserve.</p>
          </div>
        </div>

        {!selectedProduct && (
          <div className="cta-container">
            <button className="start-btn" onClick={() => setShowModal(true)}>
              Let's start! <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

        {selectedProduct && (
          <div className="quote-form-wrapper">
            <button
              className="back-to-products-btn"
              onClick={() => setSelectedProduct(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#800000',
                border: '1px solid #800000',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <span>←</span> Back to Products
            </button>

            <ProductSelectionModal
              open={false}
              selectedProduct={selectedProduct}
              onlyForm={true}
            />
          </div>
        )}
      </div>

      <footer className="cic-footer">
        <div className="footer-content">
          <p>Let us guide you through your life's journey</p>
          <p className="contact-info">
            Call us directly on 0703 099 120 or Email us at <a href="mailto:callc@cic.co.ke" style={{ color: 'white', textDecoration: 'underline' }}>callc@cic.co.ke</a>.
          </p>
        </div>
      </footer>

      <ProductSelectionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelect={setSelectedProduct}
      />
    </div>
  );
}

export default Home;
