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
  