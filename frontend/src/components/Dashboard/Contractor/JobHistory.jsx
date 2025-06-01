import React, { useState } from 'react';
import './JobHistory.css';

const jobData = [
  {
    id: 'JOB-001',
    client: 'John Doe',
    date: '2024-12-15',
    earnings: 4500,
    rating: 4.8,
    comments: 'Excellent work, very punctual!',
  },
  {
    id: 'JOB-002',
    client: 'Maryam Ali',
    date: '2025-01-05',
    earnings: 3000,
    rating: 4.5,
    comments: 'Great communication.',
  },
  {
    id: 'JOB-003',
    client: 'Green Logistics Ltd',
    date: '2025-02-22',
    earnings: 7000,
    rating: 5.0,
    comments: 'Handled large shipment perfectly.',
  },
];

function JobHistory() {
  const [filter, setFilter] = useState('');

  const filteredJobs = jobData.filter((job) =>
    job.client.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="job-history-container">
      <h2>Job History</h2>
      <p>See completed jobs, earnings per job, and ratings breakdown.</p>

      <div className="table-wrapper">
        <table className="job-history-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Earnings (₦)</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.client}</td>
                <td>{job.date}</td>
                <td>{job.earnings.toLocaleString()}</td>
                <td>{job.rating.toFixed(1)}</td>
                <td>{job.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default JobHistory;
