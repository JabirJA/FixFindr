import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#D72631'];

const Analytics = ({profileToken}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5050/admin${profileToken}/stats`); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="analytics">Loading analytics...</div>;
  }

  if (error) {
    return <div className="analytics error">{error}</div>;
  }

  return (
    <div className="analytics">
      <h2>Dashboard Analytics</h2>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="card">
          <h3>Active Contractors</h3>
          <p>{stats.activeContractors}</p>
        </div>
        <div className="card">
          <h3>Monthly Revenue</h3>
          <p>₦{stats.monthlyRevenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Average Star Rating</h3>
          <p>{stats.averageStarRating} ★</p>
        </div>
        <div className="card">
          <h3>Daily Active Users</h3>
          <p>{stats.dailyActiveUsers}</p>
        </div>
        <div className="card">
          <h3>Average Booking Value</h3>
          <p>₦{stats.averageBookingValue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Booking Cancellation Rate</h3>
          <p>{(stats.bookingCancellationRate * 100).toFixed(1)}%</p>
        </div>
        <div className="card">
          <h3>Repeat Booking Rate</h3>
          <p>{(stats.repeatBookingRate * 100).toFixed(1)}%</p>
        </div>
        <div className="card">
          <h3>Average Fulfillment Time</h3>
          <p>{stats.averageFulfillmentTime} hours</p>
        </div>
        <div className="card">
          <h3>Referral Rate</h3>
          <p>{(stats.referralRate * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Bookings per Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.bookingDataPerDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container multi-chart-row">
        <div className="pie-chart-wrapper">
          <h3>Booking Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.bookingStatusBreakdown}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {stats.bookingStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart-wrapper">
          <h3>New vs Returning Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.newVsReturningUsers}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {stats.newVsReturningUsers.map((entry, index) => (
                  <Cell key={`cell-newreturning-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h3>Revenue by Service Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.revenueByService}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Top Cancelled Services</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stats.topCancelledServices}
              dataKey="count"
              nameKey="service"
              outerRadius={80}
              label
            >
              {stats.topCancelledServices.map((entry, index) => (
                <Cell key={`cell-cancel-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Peak Booking Times</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.peakBookingTimes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="contractor-performance">
        <h3>Contractor Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Bookings</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {stats.contractorPerformance.map((contractor, idx) => (
              <tr key={idx}>
                <td>{contractor.name}</td>
                <td>{contractor.bookings}</td>
                <td>{contractor.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="revenue-section">
        <h3>Revenue Overview</h3>
        <div className="revenue-summary">
          <div className="card total-revenue">
            <h4>Total Revenue</h4>
            <p>₦{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="card monthly-revenue">
            <h4>Monthly Revenue</h4>
            <p>₦{stats.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="card daily-revenue">
            <h4>Daily Revenue</h4>
            <p>₦{stats.dailyRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="revenueCard">
          <h4>Revenue Streams Breakdown</h4>
          <table>
            <thead>
              <tr>
                <th>Revenue Stream</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Onboarding Fee</td>
                <td>₦{stats.incomeStreams.onboardingFee.toLocaleString()} per contractor</td>
              </tr>
              <tr>
                <td>Platform Maintenance Fee</td>
                <td>₦{stats.incomeStreams.recurringRevenue.platformFee.toLocaleString()}/month</td>
              </tr>
              <tr>
                <td>Average Booking Fee</td>
                <td>₦{stats.incomeStreams.recurringRevenue.bookingFees.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Contractor Subscription</td>
                <td>₦{stats.incomeStreams.recurringRevenue.subscriptionPlans.toLocaleString()}/month</td>
              </tr>
              <tr>
                <td>Sponsored Listings</td>
                <td>₦{stats.incomeStreams.recurringRevenue.sponsoredListings.toLocaleString()}/week</td>
              </tr>
              <tr>
                <td>Premium Matchmaking</td>
                <td>₦{stats.incomeStreams.recurringRevenue.premiumMatchmaking.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-container">
        <h3>Monthly Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
