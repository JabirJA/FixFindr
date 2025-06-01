import React from 'react';
import './CAnalytics.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const CAnalytics = ({
  jobData = [],
  upcomingJobs = [2],
  completedJobsCount = 5,
  earnings = { total: 50000 },
  reviewsCount = 3,
  averageRating = 4.4,
}) => {
  const monthEarnings = jobData.reduce((acc, job) => {
    const date = new Date(job.date);
    if (isNaN(date)) return acc; // Skip invalid dates

    const month = date.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    const existing = acc.find((entry) => entry.month === month);
    if (existing) {
      existing.earnings += job.earnings || 0;
    } else {
      acc.push({ month, earnings: job.earnings || 0 });
    }
    return acc;
  }, []);

  const totalCompleted =
    upcomingJobs.filter((job) => job.completed).length + completedJobsCount;

  return (
    <section className="performance-summary">
      <h2>Performance Summary</h2>

      <div className="summary-items">
        <div className="summary-item">
          <strong>{totalCompleted}</strong>
          <span>Jobs Completed</span>
        </div>

        <div className="summary-item">
          <strong>₦{earnings.total.toLocaleString()}</strong>
          <span>Total Earnings</span>
        </div>

        <div className="summary-item">
          <strong>{reviewsCount}</strong>
          <span>Reviews</span>
        </div>
        <div className="summary-item rating">
  <strong>{averageRating.toFixed(1)}</strong>
  <div className="stars" aria-label={`Average Rating: ${averageRating.toFixed(1)} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < Math.round(averageRating) ? 'star filled' : 'star'}
        role="img"
        aria-label={i < Math.round(averageRating) ? 'Filled star' : 'Empty star'}
      >
        ★
      </span>
    ))}
  </div>
  <span className="rating-label">Average Rating</span>
</div>

      </div>

      <h3 className="chart-heading">Monthly Earnings Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthEarnings}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="month" stroke="var(--text-color)" />
          <YAxis stroke="var(--text-color)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              color: 'var(--text-color)',
            }}
          />
          <Bar dataKey="earnings" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CAnalytics;
