import React, { useState, useEffect } from 'react';
import './Availability.css';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6am to 10pm

const AvailabilityPage = ({ contractor }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [availability, setAvailability] = useState(() =>
    Object.fromEntries(daysOfWeek.map(day => [day, new Set()]))
  );
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [toast, setToast] = useState('');
  const [upcoming, setUpcoming] = useState(null);

  const contractorId = contractor?.user_id;

  useEffect(() => {
    if (!contractorId) return;

    setIsAvailable(contractor.availability);

    const fetchSlots = async () => {
      const res = await fetch(`http://localhost:5050/contractors/get-availability-slots/${contractorId}`);
      const data = await res.json();
      const newAvailability = Object.fromEntries(daysOfWeek.map(day => [day, new Set()]));

      data.forEach(({ day, hour }) => {
        const shortDay = daysOfWeek[fullDayNames.indexOf(day)];
        newAvailability[shortDay].add(hour);
      });

      setAvailability(newAvailability);
      calculateNextSlot(data);
    };

    fetchSlots();
  }, [contractorId]);

  const toggleAvailability = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    await fetch('http://localhost:5050/contractors/update-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: contractorId, availability: newStatus }),
    });
  };

  const addAvailability = async () => {
    if (!isAvailable) return alert('You must mark yourself as available first');
    if (endHour <= startHour) return alert('End time must be after start time');

    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      slots.push({ day: fullDayNames[daysOfWeek.indexOf(selectedDay)], hour: h });
    }

    await fetch('http://localhost:5050/contractors/save-availability-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: contractorId, slots }),
    });

    setAvailability(prev => {
      const newSet = new Set(prev[selectedDay]);
      slots.forEach(s => newSet.add(s.hour));
      return { ...prev, [selectedDay]: newSet };
    });

    calculateNextSlot([...slots.map(s => ({ ...s }))]);
  };

  const toggleSlot = async (day, hour) => {
    if (!isAvailable) return;

    const fullDay = fullDayNames[daysOfWeek.indexOf(day)];
    const slotExists = availability[day].has(hour);

    const url = slotExists
      ? 'http://localhost:5050/contractors/delete-availability-slot'
      : 'http://localhost:5050/contractors/save-availability-slots';

    const method = 'POST';
    const payload = slotExists
      ? { user_id: contractorId, day: fullDay, hour }
      : { user_id: contractorId, slots: [{ day: fullDay, hour }] };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setAvailability(prev => {
      const newSet = new Set(prev[day]);
      slotExists ? newSet.delete(hour) : newSet.add(hour);
      return { ...prev, [day]: newSet };
    });

    calculateNextSlot([{ day: fullDay, hour }]);
  };

  const isSlotAvailable = (day, hour) => availability[day].has(hour);

  const calculateNextSlot = (slots) => {
    const now = new Date();
    let next = null;
    let minDiff = Infinity;

    for (let { day, hour } of slots) {
      const slotDate = new Date(now);
      const targetDay = fullDayNames.indexOf(day);
      const daysUntil = (targetDay - now.getDay() + 7) % 7;
      slotDate.setDate(now.getDate() + daysUntil);
      slotDate.setHours(hour, 0, 0, 0);

      const diff = slotDate - now;
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        next = slotDate;
      }
    }

    if (next) {
      setUpcoming(next.toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true }));
    }
  };

  // Check every 30s if we should flip availability
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = fullDayNames[now.getDay()];
      const shortDay = daysOfWeek[now.getDay()];
      const currentHour = now.getHours();

      if (availability[shortDay]?.has(currentHour)) {
        if (!isAvailable) {
          setIsAvailable(true);
          showToast(`Auto-switched to Available for ${currentDay} ${currentHour}:00`);
          toggleAvailability(); // sync backend
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [availability, isAvailable]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="availability-container">
      {toast && <div className="toast">{toast}</div>}

      <div className="toggle-bar">
        <button className={`toggle-btn ${isAvailable ? 'available' : 'unavailable'}`} onClick={toggleAvailability}>
          {isAvailable ? 'Status: Available' : 'Status: Unavailable'}
        </button>
      </div>

      <div className="availability-form">
        <h3>Set Availability</h3>

        <label>
          Select Day:
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{fullDayNames[daysOfWeek.indexOf(day)]}</option>
            ))}
          </select>
        </label>

        <div className="time-select">
          <label>From:
            <select value={startHour} onChange={e => setStartHour(Number(e.target.value))}>
              {hours.map(h => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </label>
          <label>To:
            <select value={endHour} onChange={e => setEndHour(Number(e.target.value))}>
              {hours.map(h => <option key={h} value={h + 1}>{h + 1}:00</option>)}
            </select>
          </label>
        </div>

        <button className="apply-btn" onClick={addAvailability} disabled={!isAvailable}>
          Add Availability
        </button>
      </div>

      {upcoming && (
        <div className="upcoming-banner">
          Next Available Slot: <strong>{upcoming}</strong>
        </div>
      )}

      <div className="calendar-grid">
        <div className="header-row">
          <div></div>
          {daysOfWeek.map(day => <div key={day}>{day}</div>)}
        </div>

        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="hour-label">{hour}:00</div>
            {daysOfWeek.map(day => (
              <div
                key={day + hour}
                className={`time-slot ${isSlotAvailable(day, hour) ? 'selected' : ''}`}
                onClick={() => toggleSlot(day, hour)}
                style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityPage;
