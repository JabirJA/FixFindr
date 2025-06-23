// src/utils/dateUtils.js

export function formatRelativeJobDate(date) {
  const now = new Date();
  const jobDate = new Date(date);

  const isToday = jobDate.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = jobDate.toDateString() === tomorrow.toDateString();

  const timeDiff = (jobDate - now) / 1000;

  if (Math.abs(timeDiff) < 60) {
    return "Now";
  } else if (isToday) {
    return "Today";
  } else if (isTomorrow) {
    return "Tomorrow";
  } else {
    return jobDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

export function formatRelativeTime(day, hour) {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = dayNames.indexOf(day);
  if (targetDayIndex === -1) return null;

  const todayIndex = today.getDay();
  let dayDiff = (targetDayIndex - todayIndex + 7) % 7;
  if (dayDiff === 0) dayDiff = 7; // Skip today or change to 0 if today is allowed

  if (dayDiff > 3) return null; // Limit to next 3 days

  let prefix = '';
  if (dayDiff === 1) {
    prefix = 'Tomorrow';
  } else {
    prefix = `In ${dayDiff} days`;
  }

  const hr = parseInt(hour, 10);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  const displayHour = ((hr + 11) % 12 + 1);

  return `${prefix} ${displayHour}:00 ${ampm}`;
}
