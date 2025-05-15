import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePickerManager from './shared/DatePickerManager';
import './quoteformsummary.css';
import './shared/DatePickerManager.css';

// Common fields used across multiple forms
const commonFields = {
  contactInfo: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your full name', required: true },
    { name: 'idNumber', label: 'ID Number', type: 'text', placeholder: 'Enter your ID number', required: true },
    { name: 'kraPin', label: 'KRA PIN', type: 'text', placeholder: 'Enter your KRA PIN', required: true },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter your phone number', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email address', required: true },
  ],
  motorVehicleBase: [
    { name: 'vehicleMake', label: 'Vehicle Make', type: 'select', options: ['Select Vehicle Make', 'Toyota', 'Nissan', 'Ford', 'Chevrolet', 'Honda', 'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Volvo', 'Jeep', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Peugeot', 'Renault', 'Skoda', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo'], required: true },
    { name: 'vehicleModel', label: 'Vehicle Model', type: 'select', options: ['Select Vehicle Model', 'Corolla', 'Camry', 'RAV4', 'Highlander', 'Land Cruiser', 'Prado', 'Fortuner', 'Hilux', 'Altima', 'Sentra', 'Patrol', 'X-Trail', 'Navara', 'Focus', 'Ranger', 'F-150', 'Escape', 'EcoSport', 'Malibu', 'Cruze', 'Silverado', 'Tahoe', 'Suburban', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Elantra', 'Tucson', 'Santa Fe', 'i20', 'i30', 'Sportage', 'Sorento', 'Rio', 'Picanto', 'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', '3 Series', '5 Series', 'X3', 'X5', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Golf', 'Passat', 'Tiguan', 'Polo', 'XC40', 'XC60', 'XC90', 'Wrangler', 'Cherokee', 'Grand Cherokee', 'Range Rover', 'Discovery', 'Defender', 'Evoque', 'ES', 'RX', 'LX', 'NX', 'CX-5', 'CX-30', 'Mazda3', 'Mazda6', 'Cooper', 'Countryman', 'Outlander', 'Pajero', 'ASX', 'Eclipse Cross', '208', '308', '3008', '5008', 'Clio', 'Megane', 'Duster', 'Koleos', 'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Forester', 'Outback', 'Impreza', 'XV', 'Swift', 'Jimny', 'Vitara', 'Ertiga'], required: true },
    { name: 'year', label: 'Year of Manufacture', type: 'text', placeholder: 'YOM', required: true, note: 'Maximum vehicle age for comprehensive cover is 15 yrs' },
    { name: 'vehicleValue', label: 'Vehicle Value', type: 'text', placeholder: 'Kes', required: true, note: 'Minimum value for comprehensive cover is Kes 500,000' },
  ]
};

// Define coverage plans for each product
const productCoveragePlans = {
  'CIC Seniors Mediplan': [
    { id: 'basic', name: 'Basic Plan', priceMultiplier: 0.8, features: ['Outpatient care', 'Basic dental', 'Basic optical'] },
    { id: 'standard', name: 'Standard Plan', priceMultiplier: 1.0, features: ['Outpatient care', 'Inpatient care', 'Dental care', 'Optical care', 'Chronic disease management'] },
    { id: 'premium', name: 'Premium Plan', priceMultiplier: 1.3, features: ['Comprehensive outpatient care', 'Comprehensive inpatient care', 'Advanced dental care', 'Advanced optical care', 'Chronic disease management', 'International emergency coverage', 'Medical evacuation'] }
  ],
  'CIC Family Medisure': [
    { id: 'basic', name: 'Family Basic', priceMultiplier: 0.8, features: ['Outpatient care', 'Basic dental & optical', 'Maternity care'] },
    { id: 'standard', name: 'Family Standard', priceMultiplier: 1.0, features: ['Outpatient care', 'Inpatient care', 'Dental care', 'Optical care', 'Maternity care', 'Child immunization'] },
    { id: 'premium', name: 'Family Premium', priceMultiplier: 1.3, features: ['Comprehensive outpatient care', 'Comprehensive inpatient care', 'Advanced dental care', 'Advanced optical care', 'Expanded maternity coverage', 'Child immunization & wellness', 'International coverage'] }
  ],
  'Motor Commercial Insurance': [
    { id: 'basic', name: 'Third Party Only', priceMultiplier: 0.6, features: ['Legal liability to third parties', 'Injury to other people', 'Damage to other people\'s property'] },
    { id: 'standard', name: 'Third Party Fire & Theft', priceMultiplier: 0.8, features: ['Legal liability to third parties', 'Fire damage to your vehicle', 'Theft of your vehicle', 'Injury to other people', 'Damage to other people\'s property'] },
    { id: 'premium', name: 'Comprehensive', priceMultiplier: 1.0, features: ['Damage to your vehicle', 'Fire damage to your vehicle', 'Theft of your vehicle', 'Legal liability to third parties', 'Personal accident cover', 'Medical expenses'] }
  ],
  'Student/Personal Accident Cover': [
    { id: 'basic', name: 'Basic Coverage', priceMultiplier: 0.8, features: ['Accidental death', 'Permanent disability', 'Medical expenses (limited)'] },
    { id: 'standard', name: 'Standard Coverage', priceMultiplier: 1.0, features: ['Accidental death', 'Permanent disability', 'Medical expenses', 'Hospital cash benefit', 'Temporary disability'] },
    { id: 'premium', name: 'Premium Coverage', priceMultiplier: 1.2, features: ['Accidental death', 'Permanent disability', 'Higher medical expenses', 'Hospital cash benefit', 'Temporary disability', 'Counseling services', 'Rehabilitation expenses'] }
  ],
  'Private Motor Insurance': [
    { id: 'basic', name: 'Third Party Only', priceMultiplier: 0.5, features: ['Legal liability to third parties', 'Injury to other people', 'Damage to other people\'s property'] },
    { id: 'standard', name: 'Third Party Fire & Theft', priceMultiplier: 0.7, features: ['Legal liability to third parties', 'Fire damage to your vehicle', 'Theft of your vehicle', 'Injury to other people', 'Damage to other people\'s property'] },
    { id: 'premium', name: 'Comprehensive', priceMultiplier: 1.0, features: ['Damage to your vehicle', 'Fire damage to your vehicle', 'Theft of your vehicle', 'Legal liability to third parties', 'Personal accident cover', 'Medical expenses', 'Windscreen cover', 'Radio/audio equipment cover'] }
  ],
  'Golfers / Sportsman Insurance': [
    { id: 'basic', name: 'Basic Coverage', priceMultiplier: 0.8, features: ['Personal liability', 'Golf equipment (limited)', 'Personal accident'] },
    { id: 'standard', name: 'Standard Coverage', priceMultiplier: 1.0, features: ['Personal liability', 'Golf equipment', 'Personal accident', 'Hole-in-one celebration', 'Trophy damage'] },
    { id: 'premium', name: 'Premium Coverage', priceMultiplier: 1.3, features: ['Enhanced personal liability', 'Comprehensive golf equipment', 'Personal accident with higher limits', 'Hole-in-one celebration', 'Trophy damage', 'Tournament fee reimbursement', 'Club membership fee protection'] }
  ],
  'Marine Cargo Policy': [
    { id: 'basic', name: 'Basic Cover (ICC C)', priceMultiplier: 0.7, features: ['Total loss', 'General average', 'Salvage charges', 'Limited peril protection'] },
    { id: 'standard', name: 'Standard Cover (ICC B)', priceMultiplier: 0.9, features: ['Total loss', 'General average', 'Salvage charges', 'Expanded peril protection', 'Washing overboard'] },
    { id: 'premium', name: 'Comprehensive Cover (ICC A)', priceMultiplier: 1.0, features: ['All risks protection', 'General average', 'Salvage charges', 'Total loss', 'Partial loss', 'War & strikes coverage (optional)', 'Additional transportation costs'] }
  ]
};

const productFormFields = {
  'CIC Seniors Mediplan': [
    ...commonFields.contactInfo,
    { name: 'dob', label: 'What is your Date of Birth?', type: 'date', placeholder: 'Pick Date of Birth', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: ['--Select--','Male', 'Female'], required: true },
    { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['--Select--','Single', 'Married', 'Divorced', 'Widowed'], required: true },
    { name: 'spouse', label: 'Do you have and want to insure your spouse?', type: 'select', options: ['--select--','No', 'Yes'], required: true },
  ],
  'CIC Family Medisure': [
    ...commonFields.contactInfo,
    { name: 'dob', label: 'What is your Date of Birth?', type: 'date', placeholder: 'Pick Date of Birth', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: ['--Select--','Male', 'Female'], required: true },
    { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['--select--','Single', 'Married', 'Divorced', 'Widowed'], required: true },
    { name: 'spouse', label: 'Do you have and want to insure your spouse?', type: 'select', options: ['--select--','No', 'Yes'], required: true },
    { name: 'children', label: 'Do you have children you want to insure?', type: 'select', options: ['--select--','No', 'Yes'], required: true },
  ],
  'Motor Commercial Insurance': [
    ...commonFields.contactInfo,
    ...commonFields.motorVehicleBase,
    { name: 'vehicleBodyType', label: 'Vehicle Body Type', type: 'select', options: ['lorry', 'bus', 'car', 'motorcycle', 'other'], required: true },
    { name: 'vehicleTonnage', label: 'Vehicle Tonnage', type: 'text', placeholder: '1', required: true },
    { name: 'specialNote', type: 'note', value: 'N/B: Refer to back office on +254 793 772 728 or +254 113 921 047 for special type e.g Petroleum tankers, Ambulance, Fire engines, psv assets among others', color: 'red' },
  ],
  'Student/Personal Accident Cover': [
    ...commonFields.contactInfo,
    { name: 'occupation', label: 'Occupation', type: 'select', options: ['--Select Occupation--', 'Accountant', 'Actor', 'Architect', 'Artist', 'Attorney', 'Banker', 'Biologist', 'Business Analyst', 'Chef', 'Civil Engineer', 'Computer Programmer', 'Consultant', 'Dentist', 'Designer', 'Doctor', 'Economist', 'Electrician', 'Engineer', 'Entrepreneur', 'Event Planner', 'Farmer', 'Financial Advisor', 'Firefighter', 'Graphic Designer', 'Healthcare Professional', 'Human Resources', 'IT Specialist', 'Journalist', 'Lawyer', 'Lecturer', 'Librarian', 'Manager', 'Marketing Professional', 'Mechanic', 'Musician', 'Nurse', 'Nutritionist', 'Pharmacist', 'Photographer', 'Physician', 'Pilot', 'Police Officer', 'Professor', 'Project Manager', 'Psychologist', 'Real Estate Agent', 'Researcher', 'Retired', 'Sales Representative', 'Scientist', 'Software Developer', 'Student', 'Teacher', 'Technician', 'Veterinarian', 'Web Developer', 'Writer'], required: true, note: 'For students on industrial attachment, pick Occupation as ', noteHighlight: 'Student or Intern' },
    { name: 'placeOfAttachment', label: 'Place of Attachment', type: 'text', placeholder: 'Enter place of attachment', required: true },
    { name: 'department', label: 'Department', type: 'select', options: ['--Select Department--', 'IT', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations', 'Customer Service', 'Other'], required: true },
    { name: 'attachmentStart', label: 'Attachment Start Date', type: 'date', placeholder: 'Pick Policy Start Date', required: true },
    { name: 'attachmentEnd', label: 'Attachment End Date', type: 'date', placeholder: 'Pick Policy End Date', required: true },
    { name: 'duration', label: 'Duration of Attachment', type: 'select', options: ['--select duration--','12 Months', '6 Months', '3 Months', '1 Month'], required: true },
  ],
  'Private Motor Insurance': [
    ...commonFields.contactInfo,
    ...commonFields.motorVehicleBase,
    { name: 'specialNote', type: 'note', value: 'N/B: This product does not cover vehicles used for hire and reward.', color: 'red' },
  ],
  'Golfers / Sportsman Insurance': [
    ...commonFields.contactInfo,
    { name: 'clubs', label: 'Which clubs are you a member of?', type: 'select', options: ['Select Club(s)','Nairobi Sports Club','Royal Nairobi Golf Club','Muthaiga Golf Club','Karen Country Club','Limuru Country Club','Windsor Golf Hotel & Country Club','Sigona Golf Club','Nyali Golf & Country Club','Nyanza Club','Nakuru Golf Club','Thika Sports Club','Vetlab Sports Club','Mombasa Golf Club','Kenya Railway Golf Club','Kiambu Golf Club','Eldoret Club','Kericho Golf Club','Great Rift Valley Lodge & Golf Resort','Leisure Lodge Beach & Golf Resort','Other'], required: true },
    { name: 'occupation', label: 'Occupation', type: 'select', options: ['Select Occupation', 'Accountant', 'Actor', 'Architect', 'Artist', 'Attorney', 'Banker', 'Biologist', 'Business Analyst', 'Chef', 'Civil Engineer', 'Computer Programmer', 'Consultant', 'Dentist', 'Designer', 'Doctor', 'Economist', 'Electrician', 'Engineer', 'Entrepreneur', 'Event Planner', 'Farmer', 'Financial Advisor', 'Firefighter', 'Graphic Designer', 'Healthcare Professional', 'Human Resources', 'IT Specialist', 'Journalist', 'Lawyer', 'Lecturer', 'Librarian', 'Manager', 'Marketing Professional', 'Mechanic', 'Musician', 'Nurse', 'Nutritionist', 'Pharmacist', 'Photographer', 'Physician', 'Pilot', 'Police Officer', 'Professor', 'Project Manager', 'Psychologist', 'Real Estate Agent', 'Researcher', 'Retired', 'Sales Representative', 'Scientist', 'Software Developer', 'Student', 'Teacher', 'Technician', 'Veterinarian', 'Web Developer', 'Writer'], required: true },
    { name: 'policyStart', label: 'Proposed Policy Start Date', type: 'date', placeholder: 'Pick Policy Start Date', required: true },
  ],
  'Marine Cargo Policy': [
    ...commonFields.contactInfo,
    { name: 'goodsValue', label: 'Value of Goods', type: 'text', placeholder: 'Kes', required: true },
    { name: 'goodsCategory', label: 'Goods Category', type: 'select', options: ['Select Category', 'Electronics', 'Textiles', 'Machinery', 'Food Products', 'Pharmaceuticals', 'Chemicals', 'Furniture', 'Automotive Parts', 'Construction Materials', 'Agricultural Products', 'Raw Materials', 'Consumer Goods', 'Other'], required: true },
    { name: 'goodsDescription', label: 'Description of Goods', type: 'text', placeholder: 'Enter goods description', required: true },
    { name: 'mode', label: 'Mode of Conveyance', type: 'select', options: ['Select Option', 'Sea', 'Air'], required: true },
    { name: 'countryOrigin', label: 'Country of Origin', type: 'select', options: ['Select Option', 'China', 'USA', 'India', 'Japan', 'Germany', 'UK', 'France', 'Italy', 'South Korea', 'Netherlands', 'Kenya', 'South Africa', 'UAE', 'Singapore', 'Malaysia', 'Australia', 'Brazil', 'Canada', 'Russia', 'Thailand', 'Indonesia', 'Vietnam', 'Mexico', 'Spain', 'Belgium', 'Turkey', 'Poland', 'Saudi Arabia', 'Egypt', 'Nigeria', 'Morocco', 'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia'], required: true },
    { name: 'portOrigin', label: 'Port/Airport of Origin', type: 'select', dependsOn: 'mode', required: true },
    { name: 'countryDest', label: 'Country of Destination', type: 'select', options: ['Select Option', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia', 'Somalia', 'South Sudan', 'Burundi', 'DR Congo', 'South Africa', 'Nigeria', 'Ghana', 'Egypt', 'Morocco', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'China', 'Japan', 'India', 'Singapore', 'UAE', 'Saudi Arabia', 'Australia', 'Brazil', 'Mexico', 'Russia', 'Turkey', 'South Korea', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam'], required: true },
    { name: 'portDest', label: 'Port/Airport of Destination', type: 'select', dependsOn: ['mode', 'countryDest'], required: true },
  ],
};

// Component for rendering form fields based on their type
const FormField = ({ field, form, setForm }) => {
  if (field.type === 'note') {
    return (
      <div className="quote-form-note" style={{ color: field.color || '#888' }}>
        {field.value}
        {field.noteHighlight && <span style={{ color: 'red', fontWeight: 600 }}> {field.noteHighlight}</span>}
      </div>
    );
  }
  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Get options for dependent fields
  const getFieldOptions = (field) => {
    if (!field.dependsOn) {
      return field.options || [];
    }
    
    // For port fields that depend on mode of transport
    if (field.name === 'portOrigin') {
      const mode = form.mode;
      const country = form.countryOrigin;
      
      if (!mode || mode === 'Select Option') {
        return ['Select Port/Airport (Choose mode first)'];
      }
      
      if (mode === 'Sea') {
        // Return seaports based on selected origin country
        if (!country || country === 'Select Option') {
          return ['Select Seaport (Choose country first)'];
        }
        
        // Return specific seaports for each country
        const seaportsByCountry = {
          'China': ['Select Seaport', 'Shanghai', 'Ningbo-Zhoushan', 'Shenzhen', 'Guangzhou', 'Qingdao', 'Tianjin', 'Dalian'],
          'USA': ['Select Seaport', 'Los Angeles', 'Long Beach', 'New York', 'Savannah', 'Seattle', 'Houston', 'Oakland'],
          'India': ['Select Seaport', 'Mumbai', 'Chennai', 'Kolkata', 'Kandla', 'Cochin', 'Visakhapatnam'],
          'Japan': ['Select Seaport', 'Tokyo', 'Yokohama', 'Nagoya', 'Osaka', 'Kobe'],
          'Germany': ['Select Seaport', 'Hamburg', 'Bremen', 'Wilhelmshaven', 'Rostock'],
          'UK': ['Select Seaport', 'Felixstowe', 'London Gateway', 'Southampton', 'Liverpool'],
          'Kenya': ['Select Seaport', 'Mombasa', 'Lamu', 'Kisumu'],
          'South Africa': ['Select Seaport', 'Durban', 'Cape Town', 'Port Elizabeth', 'Richards Bay'],
          'UAE': ['Select Seaport', 'Jebel Ali', 'Abu Dhabi', 'Sharjah', 'Fujairah'],
          'Singapore': ['Select Seaport', 'Singapore Port'],
          'Netherlands': ['Select Seaport', 'Rotterdam', 'Amsterdam'],
          'Belgium': ['Select Seaport', 'Antwerp', 'Zeebrugge'],
          'France': ['Select Seaport', 'Le Havre', 'Marseille', 'Dunkirk'],
          'Italy': ['Select Seaport', 'Genoa', 'Gioia Tauro', 'Naples', 'Trieste'],
          'Tanzania': ['Select Seaport', 'Dar es Salaam', 'Zanzibar', 'Tanga', 'Mtwara'],
          'Uganda': ['Select Seaport', 'Port Bell', 'Jinja'],
          'Rwanda': ['Select Seaport', 'Inland ports only'],
          'Ethiopia': ['Select Seaport', 'Uses Djibouti Port']
        };
        
        return seaportsByCountry[country] || ['Select Seaport', 'Major Seaport', 'Other Seaport'];
      } else if (mode === 'Air') {
        // Return airports based on selected origin country
        if (!country || country === 'Select Option') {
          return ['Select Airport (Choose country first)'];
        }
        
        // Return specific airports for each country
        const airportsByCountry = {
          'China': ['Select Airport', 'Beijing Capital', 'Shanghai Pudong', 'Guangzhou Baiyun', 'Chengdu Shuangliu', 'Shenzhen Bao\'an'],
          'USA': ['Select Airport', 'Atlanta', 'Chicago O\'Hare', 'Los Angeles', 'Dallas/Fort Worth', 'Denver', 'New York JFK'],
          'India': ['Select Airport', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata'],
          'Japan': ['Select Airport', 'Tokyo Haneda', 'Tokyo Narita', 'Osaka Kansai', 'Nagoya Centrair'],
          'Germany': ['Select Airport', 'Frankfurt', 'Munich', 'Berlin Brandenburg', 'Düsseldorf'],
          'UK': ['Select Airport', 'London Heathrow', 'London Gatwick', 'Manchester', 'Birmingham'],
          'Kenya': ['Select Airport', 'JKIA Nairobi', 'Moi International Mombasa', 'Eldoret International', 'Kisumu International'],
          'South Africa': ['Select Airport', 'OR Tambo Johannesburg', 'Cape Town International', 'King Shaka Durban'],
          'UAE': ['Select Airport', 'Dubai International', 'Abu Dhabi International', 'Sharjah International'],
          'Singapore': ['Select Airport', 'Singapore Changi'],
          'Netherlands': ['Select Airport', 'Amsterdam Schiphol'],
          'Tanzania': ['Select Airport', 'Julius Nyerere International', 'Kilimanjaro International', 'Abeid Amani Karume Zanzibar'],
          'Uganda': ['Select Airport', 'Entebbe International'],
          'Rwanda': ['Select Airport', 'Kigali International'],
          'Ethiopia': ['Select Airport', 'Addis Ababa Bole International']
        };
        
        return airportsByCountry[country] || ['Select Airport', 'Major Airport', 'Other Airport'];
      }
      return ['Select Port/Airport (Choose mode first)'];
    }
    
    // For destination ports/airports that depend on both mode and country
    if (field.name === 'portDest') {
      const mode = form.mode;
      const country = form.countryDest;
      
      if (!mode || mode === 'Select Option') {
        return ['Select Port/Airport (Choose mode first)'];
      }
      
      if (!country || country === 'Select Option') {
        return ['Select Port/Airport (Choose country first)'];
      }
      
      if (mode === 'Sea') {
        // Return seaports based on selected destination country
        const seaportsByCountry = {
          'Kenya': ['Select Seaport', 'Mombasa', 'Lamu', 'Kisumu'],
          'Tanzania': ['Select Seaport', 'Dar es Salaam', 'Zanzibar', 'Tanga', 'Mtwara'],
          'Uganda': ['Select Seaport', 'Port Bell', 'Jinja'],
          'Rwanda': ['Select Seaport', 'Inland ports only'],
          'Ethiopia': ['Select Seaport', 'Uses Djibouti Port'],
          'Somalia': ['Select Seaport', 'Mogadishu', 'Berbera', 'Kismayo'],
          'South Sudan': ['Select Seaport', 'Inland ports only'],
          'Burundi': ['Select Seaport', 'Inland ports only'],
          'DR Congo': ['Select Seaport', 'Matadi', 'Boma'],
          'South Africa': ['Select Seaport', 'Durban', 'Cape Town', 'Port Elizabeth', 'Richards Bay'],
          'Nigeria': ['Select Seaport', 'Lagos', 'Port Harcourt', 'Calabar'],
          'Ghana': ['Select Seaport', 'Tema', 'Takoradi'],
          'Egypt': ['Select Seaport', 'Alexandria', 'Port Said', 'Damietta'],
          'Morocco': ['Select Seaport', 'Casablanca', 'Tangier', 'Agadir'],
          'USA': ['Select Seaport', 'Los Angeles', 'Long Beach', 'New York', 'Savannah', 'Seattle', 'Houston', 'Oakland'],
          'Canada': ['Select Seaport', 'Vancouver', 'Montreal', 'Halifax', 'Toronto'],
          'UK': ['Select Seaport', 'Felixstowe', 'London Gateway', 'Southampton', 'Liverpool'],
          'Germany': ['Select Seaport', 'Hamburg', 'Bremen', 'Wilhelmshaven', 'Rostock'],
          'France': ['Select Seaport', 'Le Havre', 'Marseille', 'Dunkirk'],
          'Italy': ['Select Seaport', 'Genoa', 'Gioia Tauro', 'Naples', 'Trieste'],
          'Spain': ['Select Seaport', 'Valencia', 'Barcelona', 'Algeciras', 'Bilbao'],
          'Netherlands': ['Select Seaport', 'Rotterdam', 'Amsterdam'],
          'Belgium': ['Select Seaport', 'Antwerp', 'Zeebrugge'],
          'China': ['Select Seaport', 'Shanghai', 'Ningbo-Zhoushan', 'Shenzhen', 'Guangzhou', 'Qingdao', 'Tianjin', 'Dalian'],
          'Japan': ['Select Seaport', 'Tokyo', 'Yokohama', 'Nagoya', 'Osaka', 'Kobe'],
          'India': ['Select Seaport', 'Mumbai', 'Chennai', 'Kolkata', 'Kandla', 'Cochin', 'Visakhapatnam'],
          'Singapore': ['Select Seaport', 'Singapore Port'],
          'UAE': ['Select Seaport', 'Jebel Ali', 'Abu Dhabi', 'Sharjah', 'Fujairah'],
          'Saudi Arabia': ['Select Seaport', 'Jeddah', 'Dammam', 'Jubail'],
          'Australia': ['Select Seaport', 'Sydney', 'Melbourne', 'Brisbane', 'Fremantle'],
          'Brazil': ['Select Seaport', 'Santos', 'Rio de Janeiro', 'Paranagua'],
          'Mexico': ['Select Seaport', 'Manzanillo', 'Veracruz', 'Altamira'],
          'Russia': ['Select Seaport', 'St. Petersburg', 'Vladivostok', 'Novorossiysk'],
          'Turkey': ['Select Seaport', 'Istanbul', 'Mersin', 'Izmir'],
          'South Korea': ['Select Seaport', 'Busan', 'Incheon', 'Gwangyang'],
          'Malaysia': ['Select Seaport', 'Port Klang', 'Tanjung Pelepas', 'Penang'],
          'Indonesia': ['Select Seaport', 'Jakarta', 'Surabaya', 'Medan'],
          'Thailand': ['Select Seaport', 'Laem Chabang', 'Bangkok', 'Map Ta Phut'],
          'Vietnam': ['Select Seaport', 'Ho Chi Minh City', 'Haiphong', 'Da Nang']
        };
        
        return seaportsByCountry[country] || ['Select Seaport', 'Major Seaport', 'Other Seaport'];
      } else if (mode === 'Air') {
        // Return airports based on selected destination country
        const airportsByCountry = {
          'Kenya': ['Select Airport', 'JKIA Nairobi', 'Moi International Mombasa', 'Eldoret International', 'Kisumu International'],
          'Tanzania': ['Select Airport', 'Julius Nyerere International', 'Kilimanjaro International', 'Abeid Amani Karume Zanzibar'],
          'Uganda': ['Select Airport', 'Entebbe International'],
          'Rwanda': ['Select Airport', 'Kigali International'],
          'Ethiopia': ['Select Airport', 'Addis Ababa Bole International'],
          'Somalia': ['Select Airport', 'Mogadishu International', 'Hargeisa'],
          'South Sudan': ['Select Airport', 'Juba International'],
          'Burundi': ['Select Airport', 'Bujumbura International'],
          'DR Congo': ['Select Airport', 'Kinshasa International', 'Lubumbashi International'],
          'South Africa': ['Select Airport', 'OR Tambo Johannesburg', 'Cape Town International', 'King Shaka Durban'],
          'Nigeria': ['Select Airport', 'Murtala Muhammed Lagos', 'Nnamdi Azikiwe Abuja'],
          'Ghana': ['Select Airport', 'Kotoka International Accra'],
          'Egypt': ['Select Airport', 'Cairo International', 'Hurghada International'],
          'Morocco': ['Select Airport', 'Mohammed V Casablanca', 'Marrakesh Menara'],
          'USA': ['Select Airport', 'Atlanta', 'Chicago O\'Hare', 'Los Angeles', 'Dallas/Fort Worth', 'Denver', 'New York JFK'],
          'Canada': ['Select Airport', 'Toronto Pearson', 'Vancouver International', 'Montreal Trudeau'],
          'UK': ['Select Airport', 'London Heathrow', 'London Gatwick', 'Manchester', 'Birmingham'],
          'Germany': ['Select Airport', 'Frankfurt', 'Munich', 'Berlin Brandenburg', 'Düsseldorf'],
          'France': ['Select Airport', 'Paris CDG', 'Paris Orly', 'Nice Côte d\'Azur'],
          'Italy': ['Select Airport', 'Rome Fiumicino', 'Milan Malpensa', 'Venice Marco Polo'],
          'Spain': ['Select Airport', 'Madrid Barajas', 'Barcelona El Prat', 'Palma de Mallorca'],
          'Netherlands': ['Select Airport', 'Amsterdam Schiphol'],
          'Belgium': ['Select Airport', 'Brussels Airport', 'Brussels South Charleroi'],
          'China': ['Select Airport', 'Beijing Capital', 'Shanghai Pudong', 'Guangzhou Baiyun', 'Chengdu Shuangliu', 'Shenzhen Bao\'an'],
          'Japan': ['Select Airport', 'Tokyo Haneda', 'Tokyo Narita', 'Osaka Kansai', 'Nagoya Centrair'],
          'India': ['Select Airport', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata'],
          'Singapore': ['Select Airport', 'Singapore Changi'],
          'UAE': ['Select Airport', 'Dubai International', 'Abu Dhabi International', 'Sharjah International'],
          'Saudi Arabia': ['Select Airport', 'King Abdulaziz Jeddah', 'King Khalid Riyadh', 'King Fahd Dammam'],
          'Australia': ['Select Airport', 'Sydney Kingsford Smith', 'Melbourne Tullamarine', 'Brisbane International'],
          'Brazil': ['Select Airport', 'São Paulo Guarulhos', 'Rio de Janeiro Galeão'],
          'Mexico': ['Select Airport', 'Mexico City International', 'Cancún International'],
          'Russia': ['Select Airport', 'Moscow Sheremetyevo', 'Moscow Domodedovo', 'St. Petersburg Pulkovo'],
          'Turkey': ['Select Airport', 'Istanbul Airport', 'Istanbul Sabiha Gökçen', 'Antalya Airport'],
          'South Korea': ['Select Airport', 'Seoul Incheon', 'Seoul Gimpo', 'Busan Gimhae'],
          'Malaysia': ['Select Airport', 'Kuala Lumpur International', 'Kota Kinabalu International'],
          'Indonesia': ['Select Airport', 'Jakarta Soekarno-Hatta', 'Bali Ngurah Rai', 'Surabaya Juanda'],
          'Thailand': ['Select Airport', 'Bangkok Suvarnabhumi', 'Phuket International', 'Chiang Mai International'],
          'Vietnam': ['Select Airport', 'Ho Chi Minh Tan Son Nhat', 'Hanoi Noi Bai', 'Da Nang International']
        };
        
        return airportsByCountry[country] || ['Select Airport', 'Major Airport', 'Other Airport'];
      }
      return ['Select Port/Airport (Choose mode and country first)'];
    }
    
    return field.options || [];
  };
  
  // Check if field should be disabled
  const isFieldDisabled = (field) => {
    if (field.dependsOn) {
      if (typeof field.dependsOn === 'string') {
        return !form[field.dependsOn] || form[field.dependsOn] === 'Select Option';
      } else if (Array.isArray(field.dependsOn)) {
        return field.dependsOn.some(dep => !form[dep] || form[dep] === 'Select Option');
      }
    }
    return false;
  };
  
  return (
    <label>
      {field.label} {field.required && <span className="required">*</span>}
      
      {field.type === 'select' ? (
        <select 
          name={field.name} 
          value={form[field.name] || ''} 
          onChange={handleChange} 
          required={field.required}
          className="quote-form-select"
          disabled={isFieldDisabled(field)}
        >
          {getFieldOptions(field).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'date' ? (
        <DatePickerManager
          type={field.name === 'dob' ? 'birth' : 'policy'}
          form={form}
          setForm={setForm}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : (
        <input
          className="quote-form-input"
          name={field.name}
          type={field.type}
          value={form[field.name] || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      {field.note && (
        <div className="quote-form-field-note">
          {field.note}
        </div>
      )}
    </label>
  );
};

// Coverage Plan Component
const CoveragePlan = ({ plans, selectedPlan, onSelectPlan }) => {
  return (
    <div className="coverage-plans-container">
      <h2>Select Your Coverage Plan</h2>
      <p className="coverage-subtitle">Choose the coverage that best fits your needs</p>
      
      <div className="coverage-plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`coverage-plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            onClick={() => onSelectPlan(plan)}
          >
            <div className="coverage-plan-header">
              <h3>{plan.name}</h3>
              {selectedPlan?.id === plan.id && <div className="plan-selected-badge">Selected</div>}
            </div>
            
            <div className="coverage-plan-features">
              <h4>Features</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-check">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              className={`coverage-plan-select ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Receipt component
const Receipt = ({ formData, product, quoteAmount, selectedPlan, onClose, onDownload }) => {
  const today = new Date().toLocaleDateString();
  const receiptNumber = `CIC-${Math.floor(100000 + Math.random() * 900000)}`;
  const policyNumber = `POL-${Math.floor(1000000 + Math.random() * 9000000)}`;
  
  return (
    <div className="receipt-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2>Insurance Policy Receipt</h2>
          <button className="receipt-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="receipt-content">
          <div className="receipt-logo">
            <img src={require('../assets/cic_insurance.png')} alt="CIC Insurance Group" />
          </div>
          
          <div className="receipt-info">
            <p><strong>Receipt #:</strong> {receiptNumber}</p>
            <p><strong>Date:</strong> {today}</p>
            <p><strong>Policy #:</strong> {policyNumber}</p>
          </div>
          
          <div className="receipt-customer">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            {formData.idNumber && <p><strong>ID Number:</strong> {formData.idNumber}</p>}
          </div>
          
          <div className="receipt-product">
            <h3>Policy Details</h3>
            <p><strong>Product:</strong> {product.title}</p>
            {selectedPlan && (
              <div className="receipt-plan-details">
                <p><strong>Plan:</strong> {selectedPlan.name}</p>
                <p><strong>Coverage:</strong></p>
                <ul className="plan-features">
                  {selectedPlan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            <p><strong>Premium Amount:</strong> KES {quoteAmount.toLocaleString()}</p>
            <p><strong>Payment Status:</strong> <span className="purchase-success">PAID</span></p>
            <p><strong>Coverage Period:</strong> 12 months from {today}</p>
            
            {product.title === 'Marine Cargo Policy' && (
              <div className="receipt-cargo-details">
                <h4>Insured Cargo Details</h4>
                <p><strong>Goods Category:</strong> {formData.goodsCategory}</p>
                <p><strong>Goods Description:</strong> {formData.goodsDescription}</p>
                <p><strong>Value of Goods:</strong> KES {parseFloat(formData.goodsValue.replace(/[^0-9.]/g, '')).toLocaleString()}</p>
                <p><strong>Mode of Conveyance:</strong> {formData.mode}</p>
                <p><strong>Origin:</strong> {formData.countryOrigin} ({formData.portOrigin})</p>
                <p><strong>Destination:</strong> {formData.countryDest} ({formData.portDest})</p>
              </div>
            )}
          </div>
          
          <div className="receipt-footer">
            <p>Thank you for choosing CIC Insurance Group!</p>
            <p>Your policy is now active. A confirmation email has been sent to your registered email address with full policy documentation.</p>
            <p><strong>For support:</strong> callc@cic.co.ke or +254 703 099 120</p>
          </div>
        </div>
        
        <button className="receipt-download-btn" onClick={onDownload}>Download Receipt</button>
      </div>
    </div>
  );
};

export default function QuoteFormSummary() {
  const [form, setForm] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [planSelected, setPlanSelected] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [baseQuoteAmount, setBaseQuoteAmount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  
  useEffect(() => {
    if (!product) {
      // Add a message if navigating without product data and redirect
      if (process.env.NODE_ENV === 'development') {
        console.error('QuoteFormSummary accessed without product data');
      }
      // Redirect with a slight delay to ensure the message is visible
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [navigate, product]);
  
  // Adding a loading state check
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    if (product) {
      setIsLoading(false);
    }
  }, [product]);
  
  // Validate the form
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (field.required) {
        const value = form[field.name];
        
        if (!value || value === '' || 
            (field.type === 'select' && (value === `Select ${field.label}` || value.startsWith('Select ')))) {
          errors[field.name] = `${field.label} is required`;
          isValid = false;
        }
        
        // Validate email format
        if (field.type === 'email' && value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            errors[field.name] = 'Please enter a valid email address';
            isValid = false;
          }
        }
        
        // Validate phone number format
        if (field.name === 'phone' && value) {
          const phonePattern = /^[+]?[\d\s-]{10,15}$/;
          if (!phonePattern.test(value)) {
            errors[field.name] = 'Please enter a valid phone number';
            isValid = false;
          }
        }
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading form...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="error-container">
        <h2>Missing Product Information</h2>
        <p>Unable to generate a quote without product information.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="error-back-button"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  const fields = productFormFields[product.title] || [];
  const coveragePlans = productCoveragePlans[product.title] || [];

  const generateQuoteAmount = (product, formData) => {
    // This is a simple simulation - in a real app, you'd have actual pricing logic
    const baseAmounts = {
      'CIC Seniors Mediplan': 25000,
      'CIC Family Medisure': 35000,
      'Motor Commercial Insurance': 45000,
      'Student/Personal Accident Cover': 5000,
      'Private Motor Insurance': 30000,
      'Golfers / Sportsman Insurance': 15000,
      'Marine Cargo Policy': 50000
    };
    
    const base = baseAmounts[product.title] || 10000;
    
    // Add some variability based on form data
    let multiplier = 1.0;
    
    if (formData.vehicleValue) {
      const value = parseFloat(formData.vehicleValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(value)) {
        multiplier = 1 + (value / 5000000); // Adjust based on vehicle value
      }
    }
    
    // Count family members and adjust price
    let spouseCount = 0;
    let childCount = 0;
    
    // Count family members by checking family fields
    Object.keys(formData).forEach(key => {
      if (key.startsWith('family') && key.endsWith('Type')) {
        const id = key.replace('familyType', '');
        if (formData[key] === 'spouse') {
          spouseCount++;
        } else if (formData[key] === 'child') {
          childCount++;
        }
      }
    });
    
    // Add 50% per spouse
    if (spouseCount > 0) {
      multiplier += spouseCount * 0.5;
    }
    
    // Add 20% per child
    if (childCount > 0) {
      multiplier += childCount * 0.2;
    }
    
    if (formData.goodsValue) {
      const value = parseFloat(formData.goodsValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(value)) {
        multiplier = 1 + (value / 10000000); // Adjust based on goods value
      }
      
      // Adjust multiplier based on goods category for Marine Cargo Policy
      if (product.title === 'Marine Cargo Policy' && formData.goodsCategory) {
        const highRiskCategories = ['Electronics', 'Pharmaceuticals', 'Chemicals'];
        const mediumRiskCategories = ['Machinery', 'Automotive Parts', 'Consumer Goods'];
        
        if (highRiskCategories.includes(formData.goodsCategory)) {
          multiplier *= 1.5; // 50% premium for high-risk categories
        } else if (mediumRiskCategories.includes(formData.goodsCategory)) {
          multiplier *= 1.25; // 25% premium for medium-risk categories
        }
        
        // Add 10% premium for air transport as it's typically more expensive
        if (formData.mode === 'Air') {
          multiplier *= 1.1;
        }
      }
    }
    
    return Math.round(base * multiplier);
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.form-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Generate a quote amount as the base amount
    const baseAmount = generateQuoteAmount(product, form);
    setBaseQuoteAmount(baseAmount);
    
    // Set default plan to standard (middle option)
    if (coveragePlans.length >= 2) {
      const standardPlan = coveragePlans[1]; // Standard plan is usually the middle option
      setSelectedPlan(standardPlan);
      setQuoteAmount(Math.round(baseAmount * standardPlan.priceMultiplier));
    } else if (coveragePlans.length === 1) {
      setSelectedPlan(coveragePlans[0]);
      setQuoteAmount(Math.round(baseAmount * coveragePlans[0].priceMultiplier));
    } else {
      setQuoteAmount(baseAmount);
    }
    
    // Save quote to show plan selection
    setQuoteSaved(true);
    
    // Scroll to top to show the plans
    window.scrollTo(0, 0);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    
    // Recalculate the quote amount based on the selected plan
    const newQuoteAmount = Math.round(baseQuoteAmount * plan.priceMultiplier);
    setQuoteAmount(newQuoteAmount);
    
    // Mark plan as selected
    setPlanSelected(true);
    
    // Scroll up to show the selected plan
    window.scrollTo(0, 0);
  };

  const handleChangeSelection = () => {
    // Allow user to go back to plan selection
    setPlanSelected(false);
  };

  const handlePurchase = () => {
    // Show receipt when purchase button is clicked
    setShowReceipt(true);
  };

  const handleBack = () => {
    // First check if there's form data that might be lost
    if (Object.keys(form).length > 0 && !quoteSaved) {
      if (window.confirm('You have unsaved data. Are you sure you want to go back?')) {
        navigate(-1);
      }
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    
    // Navigate to dashboard after closing receipt
    navigate('/dashboard', { 
      state: { 
        productDetails: product,
        formData: form,
        quoteAmount: quoteAmount,
        selectedPlan: selectedPlan
      }
    });
  };

  const handleDownloadReceipt = () => {
    // Generate PDF content
    const receiptContent = document.querySelector('.receipt-content').innerHTML;
    const style = `
      <style>
        body { 
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          color: #333;
        }
        .receipt-logo { 
          text-align: center;
          margin-bottom: 30px;
        }
        .receipt-info { 
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
        }
        .receipt-customer, .receipt-product { 
          margin-bottom: 30px;
        }
        h1 {
          text-align: center;
          color: #800000;
          margin-bottom: 30px;
        }
        h3 { 
          color: #800000;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        h4 {
          margin: 15px 0 10px;
          color: #555;
        }
        .purchase-success { 
          background-color: #38761d;
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 13px;
        }
        .receipt-plan-details {
          margin: 15px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
          border-left: 3px solid #800000;
        }
        .plan-features { 
          margin: 10px 0 10px 20px;
          padding-left: 0;
        }
        .plan-features li { 
          margin-bottom: 8px;
          list-style-type: disc;
        }
        .receipt-footer { 
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #555;
        }
        .policy-notice {
          font-style: italic;
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }
        .receipt-cargo-details {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
      </style>
    `;
    
    // Create a new window for the PDF
    const receiptWindow = window.open('', '_blank');
    
    // Get current date formatted nicely
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    // Calculate expiry date (1 year from today)
    const expiryDate = new Date(today);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    receiptWindow.document.write(`
      <html>
        <head>
          <title>CIC Insurance - Policy Receipt</title>
          ${style}
        </head>
        <body>
          <div class="receipt-document">
            <h1>Insurance Policy Receipt</h1>
            ${receiptContent}
            <div class="policy-notice">
              <p>This receipt serves as proof of purchase. Please retain for your records.</p>
              <p>Your policy is effective from ${formattedDate} to ${formattedExpiryDate}. Full policy documentation has been sent to your registered email address.</p>
              <p>CIC Insurance Group Limited is regulated by the Insurance Regulatory Authority of Kenya.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    // Print and close the window after a slight delay to ensure it's rendered
    setTimeout(() => {
      receiptWindow.print();
    }, 800);
  };

  if (!fields.length) {
    return (
      <div className="quote-form-section">
        <button className="quote-form-back" onClick={handleBack}>&larr; Back</button>
        <h2 className="quote-form-title">Get Your Quote Now</h2>
        <div>No form available for this product.</div>
      </div>
    );
  }

  return (
    <div className="quote-form-container">
      <div className="quote-form-header">
        <button className="quote-form-back" onClick={handleBack}>&larr; Back</button>
        <h1 className="quote-form-title">Get Your {product.title} Quote</h1>
        <p className="quote-form-subtitle">Complete the form below to receive a personalized quote</p>
      </div>
      
      <div className="quote-form-layout">
        <div className="quote-form-main">
          {!quoteSaved ? (
            <form onSubmit={handleSubmit}>
              {fields.map((field, idx) => (
                <div key={field.name || idx} className={formErrors[field.name] ? 'quote-form-group error' : 'quote-form-group'}>
                  <FormField 
                    field={field} 
                    form={form}
                    setForm={setForm}
                  />
                  {formErrors[field.name] && (
                    <div className="form-error">{formErrors[field.name]}</div>
                  )}
                </div>
              ))}
              <button className="quote-form-submit" type="submit">Generate Quote</button>
            </form>
          ) : !planSelected ? (
            <div className="quote-saved-container">
              <h2 className="quote-saved-title">Available Coverage Plans</h2>
              <p className="quote-saved-message">
                Based on your information, we've prepared the following coverage options for {product.title}.
                Please select a plan that best fits your needs.
              </p>
              
              <div className="base-quote-info">
                <p>Base premium amount: <strong>KES {baseQuoteAmount.toLocaleString()}</strong></p>
                <p className="base-quote-note">Final amount will depend on the coverage plan you select.</p>
              </div>
              
              <CoveragePlan 
                plans={coveragePlans}
                selectedPlan={selectedPlan}
                onSelectPlan={handlePlanSelect}
              />
            </div>
          ) : (
            <div className="quote-selected-container">
              <h2 className="quote-saved-title">Your Plan is Selected!</h2>
              <div className="selected-plan-summary">
                <h3>{selectedPlan.name}</h3>
                <div className="quote-amount-display">
                  <span className="quote-amount-label">Total Premium:</span>
                  <span className="quote-amount-value">KES {quoteAmount.toLocaleString()}</span>
                </div>
                <div className="selected-plan-features">
                  <h4>Plan Features</h4>
                  <ul>
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-check">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="quote-actions">
                <button 
                  className="quote-change-plan" 
                  onClick={handleChangeSelection}
                >
                  Change Selection
                </button>
                <button 
                  className="quote-purchase-btn" 
                  onClick={handlePurchase}
                >
                  Purchase Now
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="quote-form-summary">
          <div className="quote-summary-card">
            <div className="quote-summary-title">Quoting For</div>
            <img src={product.img} alt={product.title} className="quote-summary-img" />
            <div className="quote-summary-name">{product.title}</div>
            <div className="quote-summary-desc-label">Product Description</div>
            <div className="quote-summary-desc">{product.desc}</div>
          </div>
        </div>
      </div>
      
      {showReceipt && (
        <Receipt 
          formData={form}
          product={product}
          quoteAmount={quoteAmount}
          selectedPlan={selectedPlan}
          onClose={handleCloseReceipt}
          onDownload={handleDownloadReceipt}
        />
      )}
    </div>
  );
} 