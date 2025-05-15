import React from 'react';
import { useNavigate } from 'react-router-dom';
import './productselectionmodel.css';

// Import images
import seniorImg from '../assets/seniors.png';
import familyImg from '../assets/family.png';
import motorImg from '../assets/electric-motor.png';
import golfImg from '../assets/golf.png';
import educationImg from '../assets/education.png';
import privateImg from '../assets/engine.png';
import anchorImg from '../assets/anchor.png';

const products = [
  {
    title: 'CIC Seniors Mediplan',
    desc: 'Medical Cover built for comfort in old age.',
    img: seniorImg,
  },
  {
    title: 'CIC Family Medisure',
    desc: 'Protects insured persons against valid medical expenses, subject to annual benefit limits.',
    img: familyImg,
  },
  {
    title: 'Motor Commercial Insurance',
    desc: 'This policy provides cover for loss or damage to the insured vehicle and legal liability to third parties for bodily injury and property damage. It also c...',
    img: motorImg,
  },
  {
    title: 'Golfers / Sportsman Insurance',
    desc: 'As a sportsperson, your career depends on your well-being. This insurance covers accidents or disabilities that could impact your c...',
    img: golfImg,
  },
  {
    title: 'Student/Personal Accident Cover',
    desc: 'The Policy will provide monetary payments in the event of body injury sustained by the insured. It covers injuries caused by violent, accident...',
    img: educationImg,
  },
  {
    title: 'Private Motor Insurance',
    desc: 'CIC Easy Bima is a monthly motor insurance cover from CIC General Insurance Company. The cover enables you to pay for your motor ve...',
    img: privateImg,
  },
  {
    title: 'Marine Cargo Policy',
    desc: 'An insurance cover on all risk basis (ICC-A) that covers losses or damage to goods and/or merchandise in transit from port of ...',
    img: anchorImg,
  },
];

export default function ProductSelectionModal({ open, onClose, onSelect }) {
  const navigate = useNavigate();
  
  if (!open) return null;
  
  const handleProductClick = (product) => {
    // Navigate to the QuoteFormSummary page with product details
    navigate('/quoteformsummary', { state: { product } });
    onClose();
  };
  
  return (
    <div className="product-modal-backdrop">
      <div className="product-modal">
        <div className="product-modal-header">
          <h2>Select product to quote for.</h2>
          <button className="product-modal-close" onClick={onClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <hr className="product-modal-divider" />
        <div className="product-modal-grid">
          {products.map((p, i) => (
            <div 
              className="product-modal-card" 
              key={i} 
              onClick={() => handleProductClick(p)}
              style={{ cursor: 'pointer' }}
            >
              <img src={p.img} alt={p.title} className="product-modal-img" />
              <div className="product-modal-title">{p.title}</div>
              <div className="product-modal-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 