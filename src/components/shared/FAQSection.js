import React, { useState, useEffect } from 'react';
import { getFAQsByCategory, faqCategories, searchFAQs } from '../../data/FAQData';
import '../../styles/auth.css';

/**
 * Reusable FAQ Section component that can be used across the application
 * @param {Object} props - Component props
 * @param {boolean} props.showTitle - Whether to show the main title (default: true)
 * @param {boolean} props.showCategories - Whether to show category filters (default: true) 
 * @param {boolean} props.showSearch - Whether to show search input (default: true)
 * @param {boolean} props.showContactCTA - Whether to show contact CTA section (default: true)
 * @param {string} props.defaultCategory - Default category to show (default: 'all')
 * @param {number} props.maxItems - Maximum number of FAQs to display (default: all)
 * @param {string} props.categoryFilter - Only show FAQs from this category (overrides user selection)
 */
const FAQSection = ({ 
  showTitle = true, 
  showCategories = true, 
  showSearch = true,
  showContactCTA = true,
  defaultCategory = 'all',
  maxItems = null,
  categoryFilter = null
}) => {
  // Get initial FAQs to initialize activeItems correctly
  const initialFaqs = categoryFilter 
    ? getFAQsByCategory(categoryFilter) 
    : getFAQsByCategory(defaultCategory);
  
  const initialMaxedFaqs = maxItems && initialFaqs.length > maxItems 
    ? initialFaqs.slice(0, maxItems) 
    : initialFaqs;

  // State to track which FAQ items are open - initialize with all current FAQ IDs set to false
  const [activeItems, setActiveItems] = useState(() => {
    const initialState = {};
    initialMaxedFaqs.forEach(faq => {
      initialState[faq.id] = false;
    });
    return initialState;
  });
  
  const [activeCategory, setActiveCategory] = useState(categoryFilter || defaultCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(initialMaxedFaqs);

  // Toggle FAQ item open/closed
  const toggleItem = (id) => {
    setActiveItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update filtered FAQs when category or search changes
  useEffect(() => {
    let results = [];
    
    if (searchTerm.trim()) {
      // Search takes precedence over category
      results = searchFAQs(searchTerm);
    } else {
      // Otherwise filter by category
      const effectiveCategory = categoryFilter || activeCategory;
      results = getFAQsByCategory(effectiveCategory);
    }
    
    // Apply maxItems limit if specified
    if (maxItems && results.length > maxItems) {
      results = results.slice(0, maxItems);
    }
    
    // Update activeItems with any new FAQs that weren't in the previous state
    setActiveItems(prev => {
      const newState = {...prev};
      results.forEach(faq => {
        if (newState[faq.id] === undefined) {
          newState[faq.id] = false;
        }
      });
      return newState;
    });
    
    setFilteredFaqs(results);
  }, [activeCategory, searchTerm, maxItems, categoryFilter]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category changes
  const handleCategoryChange = (categoryId) => {
    if (!categoryFilter) {
      setActiveCategory(categoryId);
      setSearchTerm(''); // Clear search when changing categories
    }
  };

  return (
    <div className="faq-section">
      {showTitle && <h2>Frequently Asked Questions</h2>}
      
      {/* Search input */}
      {showSearch && (
        <div className="faq-search" style={{ 
          margin: '20px auto', 
          maxWidth: '500px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 20px',
              border: '2px solid #e1e1e1',
              borderRadius: '30px',
              fontSize: '16px',
              backgroundColor: '#f9f9f9',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            className="faq-search-input"
          />
          <span style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }}>🔍</span>
        </div>
      )}
      
      {/* Category filters */}
      {showCategories && !categoryFilter && (
        <div className="faq-categories" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          margin: '20px 0 30px'
        }}>
          {faqCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={activeCategory === category.id ? 'active' : ''}
              style={{
                padding: '8px 15px',
                backgroundColor: activeCategory === category.id ? '#A92219' : '#f0f0f0',
                color: activeCategory === category.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
      
      {/* FAQ items */}
      <div className="faq-container">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`faq-item ${activeItems[faq.id] ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleItem(faq.id)}
              >
                {faq.question}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <p style={{ color: '#666', fontSize: '16px' }}>
              {searchTerm 
                ? "No FAQs match your search. Please try different keywords or browse by category." 
                : "No FAQs available in this category."}
            </p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      {showContactCTA && (
        <div style={{ 
          margin: '40px auto', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          maxWidth: '600px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Can't find what you're looking for?</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Our customer support team is ready to assist you with any questions you may have.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <a 
              href="tel:0703099120" 
              style={{
                padding: '10px 20px',
                backgroundColor: '#A92219',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: '500'
              }}
            >
              Call Us
            </a>
            <a 
              href="mailto:callc@cic.co.ke" 
              style={{
                padding: '10px 20px',
                backgroundColor: '#A92219',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: '500'
              }}
            >
              Email Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQSection; 