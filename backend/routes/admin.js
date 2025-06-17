const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:profileToken/stats', async (req, res) => {
  try {
    // Get total contractors
    const contractorRes = await pool.query('SELECT COUNT(*) FROM contractors');
    
    // Get active contractors (verified = true)
    const activeContractorRes = await pool.query('SELECT COUNT(*) FROM contractors WHERE verified = true');

    // Get total bookings
    const bookingRes = await pool.query('SELECT COUNT(*) FROM bookings');

    // Get completed, pending, cancelled bookings
    const statusRes = await pool.query(`
      SELECT status, COUNT(*) FROM bookings
      GROUP BY status
    `);

    // Get revenue by service
    const serviceRevenueRes = await pool.query(`
      SELECT service_type, SUM(total_amount) AS revenue
      FROM bookings
      WHERE status = 'Completed'
      GROUP BY service_type
    `);

    // Monthly revenue
    const monthlyRes = await pool.query(`
      SELECT TO_CHAR(created_at, 'Month') AS month, SUM(total_amount) AS revenue
      FROM bookings
      WHERE status = 'Completed'
      GROUP BY TO_CHAR(created_at, 'Month'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `);

    // Daily bookings (last 7 days)
    const dailyRes = await pool.query(`
      SELECT TO_CHAR(created_at, 'Day') AS day, COUNT(*) AS bookings
      FROM bookings
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
      ORDER BY EXTRACT(DOW FROM created_at)
    `);

    // Prepare data
    const bookingStatusBreakdown = statusRes.rows.map(row => ({
      name: row.status,
      value: parseInt(row.count, 10),
    }));

    const revenueByService = serviceRevenueRes.rows.map(row => ({
      service: row.service_type,
      revenue: parseFloat(row.revenue),
    }));

    const monthlyData = monthlyRes.rows.map(row => ({
      month: row.month.trim(),
      revenue: parseFloat(row.revenue),
    }));

    const bookingDataPerDay = dailyRes.rows.map(row => ({
      day: row.day.trim(),
      bookings: parseInt(row.bookings, 10),
    }));

    const mockIncomeStreams = {
      onboardingFee: parseInt(activeContractorRes.rows[0].count, 10) * 30000,
      recurringRevenue: {
        platformFee: 5000,
        bookingFees: 5000,
        subscriptionPlans: 5000,
        sponsoredListings: 10000,
        premiumMatchmaking: 3000,
      }
    };

    const totalRevenue = revenueByService.reduce((acc, curr) => acc + curr.revenue, 0);

    res.json({
      totalBookings: parseInt(bookingRes.rows[0].count, 10),
      activeContractors: parseInt(activeContractorRes.rows[0].count, 10),
      monthlyRevenue: monthlyData[monthlyData.length - 1]?.revenue || 0,
      dailyRevenue: 1500,  // Replace with actual daily revenue if needed
      totalRevenue,
      revenueByService,
      bookingDataPerDay,
      monthlyData,
      bookingStatusBreakdown,
      incomeStreams: mockIncomeStreams,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
