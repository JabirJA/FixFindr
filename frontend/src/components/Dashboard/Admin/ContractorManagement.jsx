import React, { useState, useEffect } from 'react';
import './ContractorManagement.css';

function ContractorManagement() {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch('http://localhost:5050/contractors');
      if (!res.ok) throw new Error('Failed to fetch contractors');
      const data = await res.json();
      setContractors(data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Could not load contractors');
    }
  };

  const handleVerify = async (id, verified) => {
    try {
      const res = await fetch(`http://localhost:5050/contractors/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Contractor updated');
        setContractors(prev =>
          prev.map(c => c.contractor_id === id ? { ...c, verified } : c)
        );
        setSelectedContractor(prev => prev ? { ...prev, verified } : prev);
      } else {
        alert(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Verify error:', err);
      alert('Server error verifying contractor');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this contractor?')) return;
    try {
      const res = await fetch(`http://localhost:5050/contractors/${id}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        alert('Contractor removed successfully');
        setContractors(prev => prev.filter(c => c.contractor_id !== id));
        setSelectedContractor(null); // Optional: reset selection if applicable
      } else {
        const data = await res.json();
        alert(data.error || data.message || 'Removal failed');
      }
    } catch (err) {
      console.error('Remove error:', err);
      alert('Server error removing contractor');
    }
  };
  

  const filteredContractors = contractors.filter(c => {
    if (filterStatus === 'All') return true;
    return filterStatus === 'Verified' ? c.verified : !c.verified;
  });

  return (
    <div className="cm-container">
      <h2>Contractor Management</h2>

      <div className="cm-filter-bar">
        <label>Filter by status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Verified">Verified</option>
          <option value="Unverified">Unverified</option>
        </select>
      </div>

      <table className="cm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContractors.map(c => (
            <tr key={c.contractor_id}>
              <td>
                <button
                  className="cm-link-button"
                  onClick={() => setSelectedContractor(c)}
                >
                  {c.first_name} {c.last_name}
                </button>
              </td>
              <td>{c.phone_number}</td>
              <td>
                <span className={`cm-status ${c.verified ? 'approved' : 'pending'}`}>
                  {c.verified ? 'Verified' : 'Unverified'}
                </span>
              </td>
              <td>
                <button onClick={() => setSelectedContractor(c)}>Manage</button>
              </td>
            </tr>
          ))}
          {filteredContractors.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No contractors found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedContractor && (
        <div className="cm-modal-overlay" onClick={() => setSelectedContractor(null)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Manage {selectedContractor.first_name} {selectedContractor.last_name}</h3>
            
            <p><strong>Email:</strong> {selectedContractor.email}</p>
            <p><strong>Phone:</strong> {selectedContractor.phone_number}</p>
            <p><strong>Transport:</strong> {selectedContractor.means_of_transport}</p>
            <p><strong>Address:</strong> {selectedContractor.residential_address}</p>
            <p><strong>State:</strong> {selectedContractor.state}</p>
            <p><strong>LGA:</strong> {selectedContractor.lga}</p>
            <p><strong>Verified:</strong> {selectedContractor.verified ? 'Yes' : 'No'}</p>

            <div className="cm-modal-actions">
              {!selectedContractor.verified && (
                <button
                  className="cm-approve"
                  onClick={() => handleVerify(selectedContractor.contractor_id, true)}
                >
                  Verify Contractor
                </button>
              )}
              {selectedContractor.verified && (
                <button
                  className="cm-decline"
                  onClick={() => handleVerify(selectedContractor.contractor_id, false)}
                >
                  Unverify Contractor
                </button>
              )}
              <button
                className="cm-remove"
                onClick={() => handleRemove(selectedContractor.contractor_id)}
              >
                Remove Contractor
              </button>
            </div>

            <button className="cm-close-btn" onClick={() => setSelectedContractor(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorManagement;
