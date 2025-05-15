// FAQAdmin.js - Utility functions for managing FAQs

/**
 * This file contains utility functions for managing FAQs in the application.
 * In a real application, these functions would likely make API calls to a backend
 * service rather than manipulating state directly.
 */

import { faqData, faqCategories } from './FAQData';

/**
 * Add a new FAQ
 * @param {Object} faq - The FAQ to add
 * @param {string} faq.question - The question text
 * @param {string} faq.answer - The answer text
 * @param {string} faq.category - The category ID (must exist in faqCategories)
 * @returns {Object|null} The added FAQ or null if failed
 */
export const addFAQ = (faq) => {
  // Validate inputs
  if (!faq.question || !faq.answer || !faq.category) {
    console.error('Invalid FAQ data: Missing required fields');
    return null;
  }
  
  // Verify category exists
  if (!faqCategories.some(cat => cat.id === faq.category) && faq.category !== 'all') {
    console.error(`Invalid category: ${faq.category}`);
    return null;
  }
  
  // Generate a new unique ID (in a real app, this would be handled by the backend)
  const newId = Math.max(...faqData.map(f => f.id)) + 1;
  
  // Create the new FAQ
  const newFAQ = {
    id: newId,
    question: faq.question,
    answer: faq.answer,
    category: faq.category
  };
  
  // Add to the data array (in a real app, this would be an API call)
  faqData.push(newFAQ);
  
  return newFAQ;
};

/**
 * Update an existing FAQ
 * @param {number} id - The ID of the FAQ to update
 * @param {Object} updates - The fields to update
 * @returns {Object|null} The updated FAQ or null if not found
 */
export const updateFAQ = (id, updates) => {
  const faqIndex = faqData.findIndex(faq => faq.id === id);
  
  if (faqIndex === -1) {
    console.error(`FAQ with ID ${id} not found`);
    return null;
  }
  
  // Verify category if it's being updated
  if (updates.category && 
      !faqCategories.some(cat => cat.id === updates.category) && 
      updates.category !== 'all') {
    console.error(`Invalid category: ${updates.category}`);
    return null;
  }
  
  // Update the FAQ
  faqData[faqIndex] = {
    ...faqData[faqIndex],
    ...updates
  };
  
  return faqData[faqIndex];
};

/**
 * Delete an FAQ
 * @param {number} id - The ID of the FAQ to delete
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteFAQ = (id) => {
  const initialLength = faqData.length;
  
  // Remove the FAQ with the given ID
  const index = faqData.findIndex(faq => faq.id === id);
  
  if (index !== -1) {
    faqData.splice(index, 1);
    return true;
  }
  
  return false;
};

/**
 * Add a new category
 * @param {Object} category - The category to add
 * @param {string} category.id - Unique identifier for the category
 * @param {string} category.name - Display name for the category
 * @returns {Object|null} The added category or null if failed
 */
export const addCategory = (category) => {
  // Validate inputs
  if (!category.id || !category.name) {
    console.error('Invalid category data: Missing required fields');
    return null;
  }
  
  // Check if category ID already exists
  if (faqCategories.some(cat => cat.id === category.id)) {
    console.error(`Category with ID ${category.id} already exists`);
    return null;
  }
  
  // Add to categories array
  faqCategories.push(category);
  
  return category;
};

/**
 * Export and import FAQ data (for backup/restore)
 * @returns {Object} Object containing all FAQ data and categories
 */
export const exportFAQData = () => {
  return {
    faqs: [...faqData],
    categories: [...faqCategories]
  };
};

/**
 * Import FAQ data from a backup
 * @param {Object} data - The data to import
 * @param {Array} data.faqs - Array of FAQ objects
 * @param {Array} data.categories - Array of category objects
 * @returns {boolean} True if import successful
 */
export const importFAQData = (data) => {
  if (!data || !data.faqs || !data.categories) {
    console.error('Invalid import data');
    return false;
  }
  
  // Replace existing data (in a real app, this would be done with proper validation)
  // Clear existing data
  faqData.length = 0;
  faqCategories.length = 0;
  
  // Add imported data
  faqData.push(...data.faqs);
  faqCategories.push(...data.categories);
  
  return true;
};

export default {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  addCategory,
  exportFAQData,
  importFAQData
}; 