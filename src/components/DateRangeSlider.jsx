import { useState, useEffect } from 'react';
import './DateRangeSlider.css';

function DateRangeSlider({ dateRange, availableDateRange, onDateRangeChange }) {
  const [startDate, setStartDate] = useState(dateRange.start);
  const [endDate, setEndDate] = useState(dateRange.end);

  useEffect(() => {
    setStartDate(dateRange.start);
    setEndDate(dateRange.end);
  }, [dateRange]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate <= endDate) {
      onDateRangeChange({ start: newStartDate, end: endDate });
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (startDate <= newEndDate) {
      onDateRangeChange({ start: startDate, end: newEndDate });
    }
  };

  const handlePresetRange = (months) => {
    const end = new Date(availableDateRange.max);
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    setStartDate(startStr);
    setEndDate(endStr);
    onDateRangeChange({ start: startStr, end: endStr });
  };

  const handleResetRange = () => {
    setStartDate(availableDateRange.min);
    setEndDate(availableDateRange.max);
    onDateRangeChange({ 
      start: availableDateRange.min, 
      end: availableDateRange.max 
    });
  };

  return (
    <div className="date-range-slider">
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">開始日:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            min={availableDateRange.min}
            max={availableDateRange.max}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="end-date">終了日:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={availableDateRange.min}
            max={availableDateRange.max}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <div className="date-presets">
        <button onClick={() => handlePresetRange(1)} className="preset-btn">
          直近1ヶ月
        </button>
        <button onClick={() => handlePresetRange(3)} className="preset-btn">
          直近3ヶ月
        </button>
        <button onClick={() => handlePresetRange(6)} className="preset-btn">
          直近6ヶ月
        </button>
        <button onClick={() => handlePresetRange(12)} className="preset-btn">
          直近1年
        </button>
        <button onClick={handleResetRange} className="preset-btn reset">
          全期間
        </button>
      </div>
    </div>
  );
}

export default DateRangeSlider;
