// FAQData.js - Centralized FAQ data for the entire application

// Category definitions
export const faqCategories = [
  { id: 'all', name: 'All FAQs' },
  { id: 'general', name: 'General Information' },
  { id: 'purchasing', name: 'Purchasing Insurance' },
  { id: 'payments', name: 'Payments' },
  { id: 'claims', name: 'Claims' },
  { id: 'account', name: 'Account Management' }
];

// FAQ data with categories
export const faqData = [
  {
    id: 1,
    category: 'general',
    question: "What types of insurance does CIC offer?",
    answer: "CIC Insurance Group offers a wide range of insurance products including Motor Insurance, Health Insurance (CIC Seniors Mediplan, CIC Family Mediplan), Personal Accident Coverage, and more. We provide comprehensive coverage options to meet various personal and business needs."
  },
  {
    id: 2,
    category: 'purchasing',
    question: "How do I get a quote for insurance?",
    answer: "Getting a quote is easy! Simply click on the 'Let's start!' button on our homepage, select the insurance product you're interested in, and fill in the required information. You'll receive quote options to choose from based on your inputs."
  },
  {
    id: 3,
    category: 'payments',
    question: "How can I pay for my insurance policy?",
    answer: "CIC Insurance accepts various payment methods including mobile money, debit/credit cards, bank transfers, and direct deposits. The specific payment options will be provided during the checkout process when you purchase a policy."
  },
  {
    id: 4,
    category: 'claims',
    question: "What should I do if I need to file a claim?",
    answer: "To file a claim, log in to your account and navigate to the Claims section in your dashboard. Follow the step-by-step process to submit your claim details and required documentation. Our claims team will process your claim promptly. You can also contact our support team directly at callc@cic.co.ke or 0703 099 120 for assistance."
  },
  {
    id: 5,
    category: 'account',
    question: "Can I manage my policy online?",
    answer: "Yes, once you create an account and purchase a policy, you can manage your policy details, make payments, view documents, and file claims through our online dashboard. Simply log in to access all features."
  },
  {
    id: 6,
    category: 'claims',
    question: "How long does it take to process a claim?",
    answer: "CIC Insurance is committed to processing claims quickly and efficiently. Most straightforward claims are processed within 7-14 business days after all required documentation is received. Complex claims may take longer depending on the circumstances."
  },
  {
    id: 7,
    category: 'purchasing',
    question: "What documents do I need to purchase insurance?",
    answer: "Required documents vary by insurance type. For most policies, you'll need personal identification (ID/Passport), contact information, and product-specific details (e.g., vehicle registration for motor insurance or medical history for health insurance). The exact requirements will be specified during the application process."
  },
  {
    id: 8,
    category: 'general',
    question: "Can I get insurance for my family members?",
    answer: "Yes, CIC Insurance offers family coverage options, especially for health insurance products like CIC Family Mediplan. You can add family members during the application process or later by updating your policy."
  },
  {
    id: 9,
    category: 'account',
    question: "How do I update my personal information?",
    answer: "You can update your personal information by logging into your account, navigating to the Profile or Settings section, and modifying your details. Alternatively, you can contact our customer support team for assistance."
  },
  {
    id: 10,
    category: 'payments',
    question: "When is my premium payment due?",
    answer: "Premium payment due dates are specified in your policy documents. You can also view this information by logging into your account and checking the Payments section. We typically send reminders via email and SMS before the due date."
  },
  {
    id: 11,
    category: 'claims',
    question: "What documents are required for filing a claim?",
    answer: "The required documents depend on the type of insurance and nature of the claim. Generally, you'll need to provide a completed claim form, identification, proof of loss or damage, and any relevant supporting documentation (e.g., police report for auto accidents, medical reports for health claims)."
  },
  {
    id: 12,
    category: 'general',
    question: "How can I contact CIC Insurance customer support?",
    answer: "You can reach our customer support team by calling 0703 099 120, emailing callc@cic.co.ke, or using the Live Chat feature on our website. Our support team is available Monday to Friday from 8:00 AM to 5:00 PM."
  }
];

// Function to get FAQs by category
export const getFAQsByCategory = (categoryId) => {
  if (categoryId === 'all') {
    return faqData;
  }
  return faqData.filter(faq => faq.category === categoryId);
};

// Function to get FAQ by ID
export const getFAQById = (id) => {
  return faqData.find(faq => faq.id === id);
};

// Function to search FAQs by keyword
export const searchFAQs = (keyword) => {
  const searchTerm = keyword.toLowerCase();
  return faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm) || 
    faq.answer.toLowerCase().includes(searchTerm)
  );
};

const FAQData = {
  faqData,
  faqCategories,
  getFAQsByCategory,
  getFAQById,
  searchFAQs
};

export default FAQData; 