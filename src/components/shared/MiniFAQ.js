import React from 'react';
import { Link } from 'react-router-dom';
import FAQSection from './FAQSection';

/**
 * MiniFAQ - A compact FAQ component for Dashboard and other pages
 * @param {Object} props
 * @param {string} props.title - Optional custom title
 * @param {string} props.category - Optional category filter 
 * @param {number} props.maxItems - Max number of FAQs to show (default: 3)
 * @param {boolean} props.showViewAll - Show link to full FAQ page (default: true)
 */
const MiniFAQ = ({ 
  title = "Frequently Asked Questions",
  category = null,
  maxItems = 3,
  showViewAll = true
}) => {
  return (
    <div className="mini-faq-container" style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '18px',
          fontWeight: '600'
        }}>{title}</h3>
        
        {showViewAll && (
          <Link to="/faqs" style={{
            color: '#A92219',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            View All FAQs
          </Link>
        )}
      </div>
      
      <FAQSection 
        showTitle={false}
        showCategories={false}
        showSearch={false}
        showContactCTA={false}
        defaultCategory="all"
        maxItems={maxItems}
        categoryFilter={category}
      />
    </div>
  );
};

export default MiniFAQ; 