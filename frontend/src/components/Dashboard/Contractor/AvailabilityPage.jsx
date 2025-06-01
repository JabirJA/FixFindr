import React, { useState, useEffect } from 'react';
import './Availability.css';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6am to 10pm

const AvailabilityPage = () => {
  const getTodayDay = () => {
    const today = new Date().getDay(); // Sunday = 0
    return daysOfWeek[(today + 6) % 7]; // Shift so Monday = 0
  };

  const todayAbbrev = getTodayDay();

  const [isAvailable, setIsAvailable] = useState(true);
  const [availability, setAvailability] = useState(() => {
    const initial = {};
    daysOfWeek.forEach(day => {
      initial[day] = new Set();
    });
    return initial;
  });
  const [bookedSlots, setBookedSlots] = useState({
    Mon: {10: 'Ibrahim Musa'},
    Wed: {13: 'Aisha Bello'},
  });
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);

  const toggleAvailability = () => {
    const currentDay = getTodayDay();

    setAvailability(prev => {
      const newAvail = { ...prev };
      const daySet = new Set(newAvail[currentDay]);
      if (isAvailable) {
        daySet.clear();
      }
      newAvail[currentDay] = daySet;
      return newAvail;
    });

    setIsAvailable(!isAvailable);
  };

  const addAvailability = () => {
    if (endHour <= startHour) {
      alert('End time must be after start time');
      return;
    }
    setAvailability(prev => {
      const newAvail = { ...prev };
      const daySet = new Set(newAvail[selectedDay]);
      for (let h = startHour; h < endHour; h++) {
        if (!bookedSlots[selectedDay] || !bookedSlots[selectedDay][h]) {
          daySet.add(h);
        }
      }
      newAvail[selectedDay] = daySet;
      return newAvail;
    });
  };

  const isBooked = (day, hour) => {
    return bookedSlots[day] && bookedSlots[day][hour];
  };

  const isSlotAvailable = (day, hour) => {
    if (!isAvailable && day === todayAbbrev) return false;
    return availability[day].has(hour) && !isBooked(day, hour);
  };

  const toggleSlot = (day, hour) => {
    if (isBooked(day, hour)) return;
    setAvailability(prev => {
      const newAvail = { ...prev };
      const daySet = new Set(newAvail[day]);
      if (daySet.has(hour)) {
        daySet.delete(hour);
      } else {
        daySet.add(hour);
      }
      newAvail[day] = daySet;
      return newAvail;
    });
  };

  return (
    <div className="availability-container">
      <div className="toggle-bar">
        <button
          className={`toggle-btn ${isAvailable ? 'available' : 'unavailable'}`}
          onClick={toggleAvailability}
        >
          {isAvailable ? 'Status: Available' : 'Status: Unavailable'}
        </button>
      </div>

      <div className="availability-form">
        <h3>Set Availability</h3>

        <label>
          Select Day:
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            {daysOfWeek.map(day => (
              <option key={day} value={day}>
                {fullDayNames[daysOfWeek.indexOf(day)]}
              </option>
            ))}
          </select>
        </label>

        <div className="time-select">
          <label>
            From:
            <select
              value={startHour}
              onChange={e => setStartHour(Number(e.target.value))}
              style={{ marginLeft: 5 }}
            >
              {hours.map(h => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>

          <label>
            To:
            <select
              value={endHour}
              onChange={e => setEndHour(Number(e.target.value))}
              style={{ marginLeft: 5 }}
            >
              {hours.map(h => (
                <option key={h} value={h + 1}>
                  {h + 1}:00
                </option>
              ))}
            </select>
          </label>
        </div>

        <button className="apply-btn" onClick={addAvailability} disabled={!isAvailable}>
          Add Availability
        </button>
      </div>

      <div className="calendar-grid">
        <div className="header-row">
          <div></div>
          {daysOfWeek.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="hour-label">{hour}:00</div>
            {daysOfWeek.map(day => {
              const bookedName = isBooked(day, hour);
              return (
                <div
                  key={day + hour}
                  className={`time-slot ${
                    bookedName
                      ? 'booked'
                      : isSlotAvailable(day, hour)
                      ? 'selected'
                      : ''
                  }`}
                  title={bookedName ? `Booked by ${bookedName}` : ''}
                  onClick={() => {
                    if ((isAvailable || day !== todayAbbrev) && !bookedName) toggleSlot(day, hour);
                  }}
                  style={{ cursor: (isAvailable || day !== todayAbbrev) && !bookedName ? 'pointer' : 'not-allowed' }}
                >
                  {bookedName ? bookedName : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityPage;
