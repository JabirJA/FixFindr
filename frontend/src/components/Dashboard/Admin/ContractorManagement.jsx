import React, { useState, useEffect } from 'react';
import './ContractorManagement.css';
import { getProfilePhotoUrl, getPastWorkPhotoUrls } from '../../../utils/images';

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
        setSelectedContractor(null);
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
        <div
          className="cm-modal-overlay"
          onClick={() => setSelectedContractor(null)}
        >
           <div
            className="cm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ textAlign: 'center' }}>
              {selectedContractor.first_name} {selectedContractor.last_name}
            </h3>

            <table className="cm-details-table">
              <tbody>
                {/* Basic Info */}
                <tr>
                  <td><strong>Contractor ID:</strong></td>
                  <td>{selectedContractor.contractor_id}</td>
                </tr>
                <tr>
                  <td><strong>User ID:</strong></td>
                  <td>{selectedContractor.user_id}</td>
                </tr>
                <tr>
                  <td><strong>Service Type:</strong></td>
                  <td>{selectedContractor.service_type}</td>
                </tr>
                <tr>
                  <td><strong>Star Rating:</strong></td>
                  <td>{selectedContractor.star_rating ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Experience:</strong></td>
                  <td>{selectedContractor.experience} years</td>
                </tr>

                {/* Contact Info */}
                <tr>
                  <td><strong>Phone Number:</strong></td>
                  <td>{selectedContractor.phone_number}</td>
                </tr>
                <tr>
                  <td><strong>State:</strong></td>
                  <td>{selectedContractor.state}</td>
                </tr>
                <tr>
                  <td><strong>LGA:</strong></td>
                  <td>{selectedContractor.lga || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Area:</strong></td>
                  <td>{selectedContractor.area || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Residential Address:</strong></td>
                  <td>{selectedContractor.residential_address || 'N/A'}</td>
                </tr>

                {/* Personal Info */}
                <tr>
                  <td><strong>Age:</strong></td>
                  <td>{selectedContractor.age}</td>
                </tr>
                <tr>
                  <td><strong>NIN:</strong></td>
                  <td>{selectedContractor.nin || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>BVN:</strong></td>
                  <td>{selectedContractor.bvn || 'N/A'}</td>
                </tr>

                {/* Additional Info */}
                <tr>
                  <td><strong>Languages:</strong></td>
                  <td>{selectedContractor.languages && selectedContractor.languages.length > 0
                    ? selectedContractor.languages.join(', ')
                    : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Means of Transport:</strong></td>
                  <td>{selectedContractor.means_of_transport || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Bio:</strong></td>
                  <td>{selectedContractor.bio || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Created At:</strong></td>
                  <td>{selectedContractor.created_at}</td>
                </tr>
                <tr>
                  <td><strong>Trade Certificate:</strong></td>
                  <td>{selectedContractor.trade_certificate || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Reference Files:</strong></td>
                  <td>{selectedContractor.reference_files && selectedContractor.reference_files.length > 0
                    ? selectedContractor.reference_files.join(', ')
                    : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Vehicle Proof:</strong></td>
                  <td>{selectedContractor.vehicle_proof || 'N/A'}</td>
                </tr>
              </tbody>
            </table>

            {/* Leave images as-is */}
            <p><strong>Profile Photo:</strong></p>
            <img
              src={getProfilePhotoUrl(selectedContractor)}
              alt="Profile"
            />

            <p><strong>Government ID Photo:</strong></p>
            {selectedContractor.government_id_photo ? (
              <img
                src={`http://localhost:5050/${selectedContractor.government_id_photo}`}
                alt="Government ID"
              />
            ) : <p>N/A</p>}

            <p><strong>Past Work Photos:</strong></p>
            {getPastWorkPhotoUrls(selectedContractor).length > 0 ? (
              getPastWorkPhotoUrls(selectedContractor).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Work ${idx + 1}`}
                />
              ))
            ) : <p>N/A</p>}
        

             <p><strong>Trade Certificate:</strong> {selectedContractor.trade_certificate || 'N/A'}</p>

            <p><strong>Reference Files:</strong> {selectedContractor.reference_files && selectedContractor.reference_files.length > 0
              ? selectedContractor.reference_files.join(', ')
              : 'N/A'}
            </p>
            <p><strong>Vehicle Proof:</strong> {selectedContractor.vehicle_proof || 'N/A'}</p>

            <div className="cm-modal-actions" style={{ marginTop: '20px' }}>
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
