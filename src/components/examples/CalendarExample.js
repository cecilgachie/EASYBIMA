import React, { useState } from 'react';
import Calendar, { DateRangeCalendar, MonthPicker, YearPicker } from '../shared/Calendar';
import './CalendarExample.css';

const CalendarExample = () => {
  // State for single date picker
  const [selectedDate, setSelectedDate] = useState(null);
  
  // State for date range picker
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // State for month picker
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // State for year picker
  const [selectedYear, setSelectedYear] = useState(null);
  
  // State for theme toggle
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`calendar-example ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="calendar-example__header">
        <h1>Modern Calendar Components</h1>
        <button 
          className="theme-toggle-button" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M16 12C16 14.209 14.209 16 12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88302 19.5345 5.67425 18.3258C4.46548 17.117 3.62596 15.589 3.25393 13.9205C2.8819 12.252 2.99274 10.5121 3.57348 8.9043C4.15423 7.29651 5.18085 5.88737 6.53324 4.84175C7.88562 3.79614 9.50782 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85853 7.68141C9.98322 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      
      <div className="calendar-example__section">
        <h2>Single Date Picker</h2>
        <div className="calendar-example__demo">
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            label="Select a date"
            placeholder="Choose a date"
            showSelectedValue={true}
            theme={darkMode ? 'dark' : 'light'}
            required
          />
        </div>
      </div>
      
      <div className="calendar-example__section">
        <h2>Date Range Picker</h2>
        <div className="calendar-example__demo">
          <DateRangeCalendar
            startDate={startDate}
            endDate={endDate}
            onChangeStart={setStartDate}
            onChangeEnd={setEndDate}
            startLabel="Start Date"
            endLabel="End Date"
            showSelectedRange={true}
            theme={darkMode ? 'dark' : 'light'}
            required
          />
        </div>
      </div>
      
      <div className="calendar-example__section">
        <h2>Month Picker</h2>
        <div className="calendar-example__demo">
          <MonthPicker
            selectedDate={selectedMonth}
            onChange={setSelectedMonth}
            label="Select a month"
            showSelectedValue={true}
            theme={darkMode ? 'dark' : 'light'}
          />
        </div>
      </div>
      
      <div className="calendar-example__section">
        <h2>Year Picker</h2>
        <div className="calendar-example__demo">
          <YearPicker
            selectedDate={selectedYear}
            onChange={setSelectedYear}
            label="Select a year"
            showSelectedValue={true}
            theme={darkMode ? 'dark' : 'light'}
          />
        </div>
      </div>
      
      <div className="calendar-example__section">
        <h2>Inline Calendar</h2>
        <div className="calendar-example__demo">
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            inline={true}
            theme={darkMode ? 'dark' : 'light'}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarExample;
