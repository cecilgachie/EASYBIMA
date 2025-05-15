import React, { useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

// Modern Calendar Icon Component
const CalendarIcon = ({ variant = 'default' }) => {
  const iconClasses = `calendar-icon ${variant === 'filled' ? 'calendar-icon--filled' : ''}`;

  return (
    <svg
      className={iconClasses}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      {variant === 'filled' && (
        <>
          <circle cx="8" cy="14" r="1" fill="currentColor" />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
          <circle cx="16" cy="14" r="1" fill="currentColor" />
          <circle cx="8" cy="18" r="1" fill="currentColor" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
        </>
      )}
    </svg>
  );
};

// Modern Header for the calendar popup
const CalendarHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, changeYear, changeMonth }) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const [showSelector, setShowSelector] = useState(false);
  const [selectorType, setSelectorType] = useState('none'); // 'none', 'month', or 'year'
  const selectorRef = useRef(null);

  // Close selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowSelector(false);
      }
    };

    if (showSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSelector]);

  // Generate a range of years (current year ± 50 years)
  const generateYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSelectorToggle = (type) => {
    if (selectorType === type && showSelector) {
      setShowSelector(false);
    } else {
      setSelectorType(type);
      setShowSelector(true);
    }
  };

  const selectYear = (selectedYear) => {
    changeYear(selectedYear);
    setShowSelector(false);
  };

  const selectMonth = (selectedMonth) => {
    changeMonth(selectedMonth);
    setShowSelector(false);
  };

  // Scroll to current year when year selector opens
  useEffect(() => {
    if (showSelector && selectorType === 'year' && selectorRef.current) {
      const selectedElement = selectorRef.current.querySelector('.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [showSelector, selectorType]);

  return (
    <div className="modern-datepicker-header">
      <button
        className="modern-datepicker-header__nav-button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        aria-label="Previous Month"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="modern-datepicker-header__selectors" ref={selectorRef}>
        <button
          type="button"
          className="modern-datepicker-header__selector-button"
          onClick={() => handleSelectorToggle('month')}
          aria-label="Select month"
          aria-expanded={showSelector && selectorType === 'month'}
        >
          <span>{months[month]}</span>
          <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          type="button"
          className="modern-datepicker-header__selector-button"
          onClick={() => handleSelectorToggle('year')}
          aria-label="Select year"
          aria-expanded={showSelector && selectorType === 'year'}
        >
          <span>{year}</span>
          <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {showSelector && selectorType === 'month' && (
          <div className="modern-datepicker-header__selector-dropdown month-selector">
            <div className="modern-datepicker-header__selector-grid">
              {months.map((monthName, index) => (
                <button
                  key={monthName}
                  type="button"
                  className={`modern-datepicker-header__selector-item ${index === month ? 'selected' : ''}`}
                  onClick={() => selectMonth(index)}
                >
                  {monthName.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSelector && selectorType === 'year' && (
          <div className="modern-datepicker-header__selector-dropdown year-selector">
            <div className="modern-datepicker-header__selector-scroll">
              {generateYearOptions().map((yearOption) => (
                <button
                  key={yearOption}
                  type="button"
                  className={`modern-datepicker-header__selector-item ${yearOption === year ? 'selected' : ''}`}
                  onClick={() => selectYear(yearOption)}
                >
                  {yearOption}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className="modern-datepicker-header__nav-button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        aria-label="Next Month"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

/**
 * Modern Reusable Calendar Component
 *
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onChange - Function to call when date changes
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {boolean} props.required - Whether the field is required
 * @param {Object} props.customProps - Additional props to pass to DatePicker
 * @param {string} props.label - Label for the calendar field
 * @param {string} props.name - Name for the form field
 * @param {boolean} props.showTimeSelect - Whether to show time selection
 * @param {Date} props.minDate - Minimum selectable date
 * @param {Date} props.maxDate - Maximum selectable date
 * @param {boolean} props.showSelectedValue - Whether to show the selected value below the calendar
 * @param {boolean} props.isDOB - Whether the calendar is for date of birth
 * @param {string} props.theme - Theme for the calendar ('light' or 'dark')
 * @param {boolean} props.inline - Whether to display the calendar inline
 * @param {boolean} props.highlightToday - Whether to highlight today's date
 */
const Calendar = ({
  selectedDate,
  onChange,
  placeholder = 'Select date',
  required = false,
  customProps = {},
  label,
  name,
  showTimeSelect = false,
  minDate,
  maxDate,
  showSelectedValue = false,
  isDOB = false,
  theme = 'light',
  inline = false,
  highlightToday = true,
}) => {
  const [isOpen, setIsOpen] = useState(inline);
  const [isFocused, setIsFocused] = useState(false);
  const calendarRef = useRef(null);

  // Handle date change
  const handleChange = (date) => {
    onChange(date);
    if (!inline) {
      setIsOpen(false);
    }
  };

  // Handle input click
  const handleInputClick = () => {
    if (!inline) {
      setIsOpen(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleInputBlur = () => {
    setIsFocused(false);
  };

  // Handle year change
  const handleYearChange = (year) => {
    if (!selectedDate) {
      // If no date is selected, create a new date with the selected year
      const newDate = new Date();
      newDate.setFullYear(year);
      onChange(newDate);
    } else {
      // Update the year of the existing selected date
      const newDate = new Date(selectedDate);
      newDate.setFullYear(year);
      onChange(newDate);
    }
  };

  // Handle month change
  const handleMonthChange = (month) => {
    if (!selectedDate) {
      // If no date is selected, create a new date with the selected month
      const newDate = new Date();
      newDate.setMonth(month);
      onChange(newDate);
    } else {
      // Update the month of the existing selected date
      const newDate = new Date(selectedDate);
      newDate.setMonth(month);
      onChange(newDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';

    try {
      return showTimeSelect
        ? date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Create a custom header renderer that provides the changeYear and changeMonth functions
  const renderCustomCalendarHeader = (props) => {
    return (
      <CalendarHeader
        {...props}
        changeYear={handleYearChange}
        changeMonth={handleMonthChange}
      />
    );
  };

  // Determine container classes based on props
  const containerClasses = [
    'modern-calendar-field',
    label ? 'with-label' : '',
    isDOB ? 'dob-calendar' : '',
    theme === 'dark' ? 'theme-dark' : 'theme-light',
    inline ? 'inline-calendar' : '',
    isFocused ? 'is-focused' : ''
  ].filter(Boolean).join(' ');

  // Determine input container classes
  const inputContainerClasses = [
    'modern-date-picker-container',
    isDOB ? 'dob-picker-container' : '',
    isOpen ? 'is-open' : '',
    isFocused ? 'is-focused' : ''
  ].filter(Boolean).join(' ');

  // Determine popper classes
  const popperClasses = [
    isDOB ? 'dob-calendar-popper' : '',
    `theme-${theme}`,
    'modern-calendar-popper'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={calendarRef}>
      {label && (
        <label htmlFor={name} className="modern-calendar-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className={inputContainerClasses}>
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          className="modern-calendar-input"
          placeholderText={placeholder}
          dateFormat={showTimeSelect ? "MMMM d, yyyy h:mm aa" : "MMMM d, yyyy"}
          required={required}
          todayButton={highlightToday ? "Today" : undefined}
          showPopperArrow={false}
          popperPlacement="bottom-start"
          showTimeSelect={showTimeSelect}
          timeIntervals={15}
          minDate={minDate}
          maxDate={maxDate}
          onInputClick={handleInputClick}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          id={name}
          name={name}
          renderCustomHeader={renderCustomCalendarHeader}
          popperClassName={popperClasses}
          calendarClassName={`modern-calendar ${theme === 'dark' ? 'theme-dark' : ''}`}
          inline={inline}
          {...customProps}
        />

        {!inline && (
          <div className="modern-calendar-icon-wrapper">
            <CalendarIcon variant={selectedDate ? 'filled' : 'default'} />
          </div>
        )}
      </div>

      {showSelectedValue && selectedDate && !inline && (
        <div className="modern-selected-date">
          <div className="modern-selected-date__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="modern-selected-date__content">
            <span className="modern-selected-date__label">Selected Date:</span>
            <span className="modern-selected-date__value">{formatDate(selectedDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern Date Range Calendar Component
 *
 * @param {Object} props - Component props
 * @param {Date} props.startDate - Start date
 * @param {Date} props.endDate - End date
 * @param {Function} props.onChangeStart - Function to call when start date changes
 * @param {Function} props.onChangeEnd - Function to call when end date changes
 * @param {string} props.startLabel - Label for start date
 * @param {string} props.endLabel - Label for end date
 * @param {boolean} props.required - Whether the fields are required
 * @param {boolean} props.showSelectedRange - Whether to show selected range summary
 * @param {boolean} props.isStartDOB - Whether the start date is for date of birth
 * @param {boolean} props.isEndDOB - Whether the end date is for date of birth
 * @param {string} props.theme - Theme for the calendar ('light' or 'dark')
 * @param {boolean} props.compact - Whether to display the calendars in compact mode
 * @param {string} props.layout - Layout of the calendars ('horizontal' or 'vertical')
 */
export const DateRangeCalendar = ({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  required = false,
  showSelectedRange = false,
  isStartDOB = false,
  isEndDOB = false,
  theme = 'light',
  compact = false,
  layout = 'horizontal',
}) => {
  // Automatically update end date if it's before start date
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      onChangeEnd(startDate);
    }
  }, [startDate, endDate, onChangeEnd]);

  // Format date range for display
  const formatDateRange = () => {
    if (!startDate || !endDate) return '';

    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const start = startDate.toLocaleDateString('en-US', options);
      const end = endDate.toLocaleDateString('en-US', options);

      // Calculate the difference in days
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return `${start} to ${end} (${diffDays} day${diffDays !== 1 ? 's' : ''})`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Invalid date range';
    }
  };

  // Calculate duration between dates
  const calculateDuration = () => {
    if (!startDate || !endDate) return null;

    try {
      // Calculate the difference in days
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate months and years if applicable
      const months = Math.floor(diffDays / 30);
      const years = Math.floor(diffDays / 365);

      if (years > 0) {
        const remainingMonths = Math.floor((diffDays % 365) / 30);
        return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
      } else if (months > 0) {
        const remainingDays = diffDays % 30;
        return `${months} month${months !== 1 ? 's' : ''}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}` : ''}`;
      } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
      return null;
    }
  };

  // Determine container classes based on props
  const containerClasses = [
    'modern-date-range-calendar',
    layout === 'vertical' ? 'layout-vertical' : 'layout-horizontal',
    compact ? 'compact' : '',
    theme === 'dark' ? 'theme-dark' : 'theme-light'
  ].filter(Boolean).join(' ');

  // Determine range summary classes
  const rangeSummaryClasses = [
    'modern-date-range-summary',
    theme === 'dark' ? 'theme-dark' : 'theme-light'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="modern-date-range-inputs">
        <Calendar
          selectedDate={startDate}
          onChange={onChangeStart}
          placeholder="Select start date"
          required={required}
          label={startLabel}
          name="startDate"
          maxDate={endDate}
          isDOB={isStartDOB}
          theme={theme}
        />

        <div className="modern-date-range-separator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <Calendar
          selectedDate={endDate}
          onChange={onChangeEnd}
          placeholder="Select end date"
          required={required}
          label={endLabel}
          name="endDate"
          minDate={startDate}
          isDOB={isEndDOB}
          theme={theme}
        />
      </div>

      {showSelectedRange && startDate && endDate && (
        <div className={rangeSummaryClasses}>
          <div className="modern-date-range-summary__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8H21" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="modern-date-range-summary__content">
            <div className="modern-date-range-summary__dates">
              <span className="modern-date-range-summary__label">Date Range:</span>
              <span className="modern-date-range-summary__value">{formatDateRange()}</span>
            </div>
            <div className="modern-date-range-summary__duration">
              <span className="modern-date-range-summary__label">Duration:</span>
              <span className="modern-date-range-summary__value">{calculateDuration()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modern Month Picker Component
 *
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onChange - Function to call when date changes
 * @param {string} props.label - Label for the field
 * @param {boolean} props.showSelectedValue - Whether to show the selected month below
 * @param {boolean} props.isDOB - Whether the calendar is for date of birth
 * @param {string} props.theme - Theme for the calendar ('light' or 'dark')
 * @param {boolean} props.inline - Whether to display the calendar inline
 * @param {boolean} props.required - Whether the field is required
 */
export const MonthPicker = ({
  selectedDate,
  onChange,
  label = 'Select Month',
  showSelectedValue = false,
  isDOB = false,
  theme = 'light',
  inline = false,
  required = false,
}) => {
  // Format month for display
  const formatMonth = (date) => {
    if (!date) return '';

    try {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.error('Error formatting month:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className={`modern-month-picker ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Calendar
        selectedDate={selectedDate}
        onChange={onChange}
        placeholder="Select month"
        label={label}
        name="monthPicker"
        showSelectedValue={showSelectedValue}
        isDOB={isDOB}
        theme={theme}
        inline={inline}
        required={required}
        customProps={{
          showMonthYearPicker: true,
          dateFormat: "MMMM yyyy",
          showFullMonthYearPicker: true
        }}
      />

      {showSelectedValue && selectedDate && !inline && (
        <div className="modern-selected-month">
          <div className="modern-selected-month__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8H21" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="modern-selected-month__content">
            <span className="modern-selected-month__label">Selected Month:</span>
            <span className="modern-selected-month__value">{formatMonth(selectedDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Year Picker Component
 *
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onChange - Function to call when date changes
 * @param {string} props.label - Label for the field
 * @param {boolean} props.showSelectedValue - Whether to show the selected year below
 * @param {string} props.theme - Theme for the calendar ('light' or 'dark')
 * @param {boolean} props.required - Whether the field is required
 */
export const YearPicker = ({
  selectedDate,
  onChange,
  label = 'Select Year',
  showSelectedValue = false,
  theme = 'light',
  required = false,
}) => {
  // Format year for display
  const formatYear = (date) => {
    if (!date) return '';

    try {
      return date.getFullYear().toString();
    } catch (error) {
      console.error('Error formatting year:', error);
      return 'Invalid year';
    }
  };

  return (
    <div className={`modern-year-picker ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Calendar
        selectedDate={selectedDate}
        onChange={onChange}
        placeholder="Select year"
        label={label}
        name="yearPicker"
        showSelectedValue={showSelectedValue}
        theme={theme}
        required={required}
        customProps={{
          showYearPicker: true,
          dateFormat: "yyyy",
          showFullMonthYearPicker: false
        }}
      />

      {showSelectedValue && selectedDate && (
        <div className="modern-selected-year">
          <div className="modern-selected-year__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8H21" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="modern-selected-year__content">
            <span className="modern-selected-year__label">Selected Year:</span>
            <span className="modern-selected-year__value">{formatYear(selectedDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;