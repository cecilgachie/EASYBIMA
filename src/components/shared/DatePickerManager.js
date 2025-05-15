import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';

/**
 * DatePickerManager - Manages different date picker types and conditional fields
 * 
 * @param {Object} props
 * @param {string} props.type - Type of date picker ('policy' or 'birth')
 * @param {Object} props.form - Form data object
 * @param {Function} props.setForm - Function to update form data
 * @param {string} props.name - Base field name
 * @param {string} props.label - Label for the field
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether the field is required
 */
const DatePickerManager = ({
  type = 'policy',
  form,
  setForm,
  name,
  label,
  placeholder = 'Select date',
  required = false,
}) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  
  // Handle spouse and children selection changes
  useEffect(() => {
    if (form.spouse === 'No' && form.children === 'No') {
      // Remove family members when no spouse and no children
      const updatedForm = { ...form };
      // Clear all family members data
      Object.keys(updatedForm).forEach(key => {
        if (key.startsWith('family')) {
          delete updatedForm[key];
        }
      });
      setForm(updatedForm);
      setFamilyMembers([]);
    }
  }, [form.spouse, form.children, setForm, form]);
  
  // Handle add family member
  const handleAddFamilyMember = (type) => {
    const newId = familyMembers.length + 1;
    const newMember = {
      id: newId,
      type: type, // 'spouse' or 'child'
      fieldName: `family${newId}Dob`
    };
    setFamilyMembers([...familyMembers, newMember]);
  };
  
  // Handle remove family member
  const handleRemoveFamilyMember = (id) => {
    const updatedMembers = familyMembers.filter(member => member.id !== id);
    setFamilyMembers(updatedMembers);
    
    // Remove the corresponding field from form
    const updatedForm = { ...form };
    delete updatedForm[`family${id}Dob`];
    delete updatedForm[`family${id}Type`];
    delete updatedForm[`family${id}Relation`];
    setForm(updatedForm);
  };
  
  // Handle date change
  const handleDateChange = (date, fieldName) => {
    setForm(prev => ({ ...prev, [fieldName]: date }));
  };
  
  // Handle family member type change
  const handleMemberTypeChange = (id, value) => {
    setForm(prev => ({ ...prev, [`family${id}Type`]: value }));
  };
  
  // Handle family member relation change
  const handleRelationChange = (id, value) => {
    setForm(prev => ({ ...prev, [`family${id}Relation`]: value }));
  };
  
  return (
    <div className="date-picker-manager">
      {/* Main Date Field - Don't pass label here as it's already shown by FormField component */}
      <Calendar
        selectedDate={form[name]}
        onChange={(date) => handleDateChange(date, name)}
        placeholder={placeholder}
        required={required}
        name={name}
        // For policy dates: minimum date is today, for birth dates: maximum date is today
        minDate={type === 'policy' ? new Date() : undefined}
        maxDate={type === 'birth' ? new Date() : undefined}
        showSelectedValue={true}
        isDOB={type === 'birth'} // Set isDOB to true for birth dates
      />
      
      {/* Family Section (conditionally shown) */}
      {name === 'dob' && (form.spouse === 'Yes' || form.children === 'Yes') && (
        <div className="family-section">
          <h3 className="family-section-title">Family Members</h3>
          
          <div className="family-controls">
            {form.spouse === 'Yes' && (
              <button 
                type="button" 
                className="add-family-btn"
                onClick={() => handleAddFamilyMember('spouse')}
              >
                + Add Spouse
              </button>
            )}
            
            {form.children === 'Yes' && (
              <button 
                type="button" 
                className="add-family-btn"
                onClick={() => handleAddFamilyMember('child')}
              >
                + Add Child
              </button>
            )}
          </div>
          
          {familyMembers.map((member) => (
            <div key={member.id} className="family-member-row">
              <div className="family-member-type">
                <select
                  value={form[`family${member.id}Type`] || member.type}
                  onChange={(e) => handleMemberTypeChange(member.id, e.target.value)}
                  className="family-type-select"
                >
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                </select>
                
                {form[`family${member.id}Type`] === 'spouse' && (
                  <select
                    value={form[`family${member.id}Relation`] || ''}
                    onChange={(e) => handleRelationChange(member.id, e.target.value)}
                    className="family-relation-select"
                  >
                    <option value="">Select Relation</option>
                    <option value="Husband">Husband</option>
                    <option value="Wife">Wife</option>
                  </select>
                )}
                
                {form[`family${member.id}Type`] === 'child' && (
                  <select
                    value={form[`family${member.id}Relation`] || ''}
                    onChange={(e) => handleRelationChange(member.id, e.target.value)}
                    className="family-relation-select"
                  >
                    <option value="">Select Relation</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                )}
              </div>
              
              <Calendar
                selectedDate={form[member.fieldName]}
                onChange={(date) => handleDateChange(date, member.fieldName)}
                placeholder={`Select ${form[`family${member.id}Type`] || member.type}'s date of birth`}
                required={true}
                label={form[`family${member.id}Relation`] || `Family Member ${member.id}`}
                name={member.fieldName}
                maxDate={new Date()} // Birth date can't be in the future
                showSelectedValue={true}
                isDOB={true} // This is a DOB field
              />
              
              <button 
                type="button" 
                className="remove-family-btn"
                onClick={() => handleRemoveFamilyMember(member.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePickerManager; 