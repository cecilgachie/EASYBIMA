import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFAQsByCategory } from '../../data/FAQData';

/**
 * Small FAQ widget that can be embedded anywhere in the application
 * @param {Object} props
 * @param {string} props.title - Optional widget title
 * @param {string} props.category - Category to filter FAQs (required)
 * @param {number} props.maxItems - Maximum number of FAQs to display (default: 2)
 * @param {boolean} props.showViewAll - Show the View All link (default: true)
 * @param {string} props.style - Optional styling variants ('compact', 'bordered', 'default')
 */
const FAQWidget = ({
  title = "Common Questions",
  category,
  maxItems = 2,
  showViewAll = true,
  style = 'default'
}) => {
  const [activeItems, setActiveItems] = useState({});
  
  // Get FAQs for the specified category
  const faqs = getFAQsByCategory(category).slice(0, maxItems);
  
  // Toggle FAQ item open/closed
  const toggleItem = (id) => {
    setActiveItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Apply different styling based on the style prop
  const getContainerStyle = () => {
    switch(style) {
      case 'compact':
        return {
          padding: '10px',
          fontSize: '14px',
          backgroundColor: '#f9f9f9'
        };
      case 'bordered':
        return {
          padding: '15px',
          border: '1px solid #e1e1e1',
          borderRadius: '8px'
        };
      default:
        return {
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        };
    }
  };

  return (
    <div className="faq-widget" style={getContainerStyle()}>
      {title && (
        <h4 style={{ 
          margin: '0 0 12px 0', 
          color: '#333', 
          fontSize: style === 'compact' ? '16px' : '18px',
          fontWeight: '600'
        }}>
          {title}
        </h4>
      )}
      
      <div className="faq-widget-content">
        {faqs.length > 0 ? (
          faqs.map(faq => (
            <div 
              key={faq.id} 
              className={`faq-widget-item ${activeItems[faq.id] ? 'active' : ''}`}
              style={{
                margin: '8px 0',
                borderBottom: style !== 'compact' ? '1px solid #f0f0f0' : 'none',
                paddingBottom: '8px'
              }}
            >
              <div 
                onClick={() => toggleItem(faq.id)}
                style={{
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: style === 'compact' ? '14px' : '15px'
                }}
              >
                <span>{faq.question}</span>
                <span style={{ 
                  transition: 'transform 0.3s ease',
                  transform: activeItems[faq.id] ? 'rotate(180deg)' : 'rotate(0)',
                  fontSize: '12px'
                }}>▼</span>
              </div>
              
              {activeItems[faq.id] && (
                <div style={{
                  margin: '8px 0 0',
                  padding: '0 0 0 8px',
                  fontSize: style === 'compact' ? '13px' : '14px',
                  color: '#666',
                  borderLeft: '2px solid #A92219'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
            No FAQs available.
          </p>
        )}
      </div>
      
      {showViewAll && faqs.length > 0 && (
        <div style={{ 
          textAlign: 'right', 
          marginTop: '10px',
          fontSize: style === 'compact' ? '13px' : '14px'
        }}>
          <Link 
            to="/faqs" 
            style={{ 
              color: '#A92219', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            View all FAQs
          </Link>
        </div>
      )}
    </div>
  );
};

export default FAQWidget; 