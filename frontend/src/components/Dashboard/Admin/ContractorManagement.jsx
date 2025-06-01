import React, { useState } from 'react';
import './ContractorManagement.css';

const contractorsMock = [
  {
    id: 1,
    name: 'John Doe',
    phone: '08012345678',
    email: 'john@example.com',
    status: 'Pending',
    transport: 'Car',
    experience: '5 years',
    nin: '12345678901',
    bvn: '12345678901',
    address: '123 Main Street',
    state: 'Lagos',
    lga: 'Ikeja',
    documents: {
      id: 'https://via.placeholder.com/150?text=ID',
      photo: 'https://via.placeholder.com/150?text=Photo',
      tradeCertificate: 'https://via.placeholder.com/150?text=Trade+Cert',
      references: null,
      vehicleProof: 'https://via.placeholder.com/150?text=Vehicle',
      workSamples: [
        'https://via.placeholder.com/100?text=Work1',
        'https://via.placeholder.com/100?text=Work2',
      ],
    },
  },
  {
    id: 2,
    name: 'Mary Jane',
    phone: '08098765432',
    email: 'mary@example.com',
    status: 'Approved',
    transport: 'Motorcycle',
    experience: '2 years',
    nin: '23456789012',
    bvn: '23456789012',
    address: '456 Another Street',
    state: 'Abuja',
    lga: 'Gwagwalada',
    documents: {
      id: 'https://via.placeholder.com/150?text=ID',
      photo: 'https://via.placeholder.com/150?text=Photo',
      tradeCertificate: null,
      references: null,
      vehicleProof: null,
      workSamples: [],
    },
  },
];

function ContractorManagement() {
  const [contractors, setContractors] = useState(contractorsMock);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalType, setModalType] = useState(null); // 'management' or 'details'

  const handleAction = (id, action) => {
    setContractors(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: action === 'approve' ? 'Approved' : 'Declined' } : c
      )
    );
    setSelectedContractor(null);
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this contractor?')) {
      setContractors(prev => prev.filter(c => c.id !== id));
      setSelectedContractor(null);
    }
  };

  const filteredContractors =
    filterStatus === 'All'
      ? contractors
      : contractors.filter(c => c.status === filterStatus);

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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      <table className="cm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContractors.map((c) => (
            <tr key={c.id}>
              <td>
                <button
                  className="cm-link-button"
                  onClick={() => {
                    setSelectedContractor(c);
                    setModalType('management');
                  }}
                >
                  {c.name}
                </button>
              </td>
              <td>{c.phone}</td>
              <td>
  <span className={`cm-status ${c.status.toLowerCase()}`}>{c.status}</span>
</td>

              <td>
                <button
                  onClick={() => {
                    setSelectedContractor(c);
                    setModalType('details');
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedContractor && (
        <div className="cm-modal-overlay" onClick={() => setSelectedContractor(null)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedContractor.name}'s {modalType === 'details' ? 'Details' : 'Management'}</h3>

            {modalType === 'details' && (
              <>
                <p><strong>Email:</strong> {selectedContractor.email}</p>
                <p><strong>Phone:</strong> {selectedContractor.phone}</p>
                <p><strong>Experience:</strong> {selectedContractor.experience}</p>
                <p><strong>NIN:</strong> {selectedContractor.nin}</p>
                <p><strong>BVN:</strong> {selectedContractor.bvn}</p>
                <p><strong>Transport:</strong> {selectedContractor.transport}</p>
                <p><strong>Address:</strong> {selectedContractor.address}</p>
                <p><strong>State:</strong> {selectedContractor.state}</p>
                <p><strong>LGA:</strong> {selectedContractor.lga}</p>

                <div className="cm-docs">
                  <h4>Documents</h4>
                  {Object.entries(selectedContractor.documents).map(([key, val]) =>
                    key === 'workSamples' ? (
                      <div key={key}>
                        <strong>Work Samples:</strong>
                        <div className="cm-samples">
                          {val && val.length > 0 ? val.map((img, idx) => (
                            <img src={img} alt={`Work ${idx}`} key={idx} />
                          )) : <p>No samples</p>}
                        </div>
                      </div>
                    ) : val ? (
                      <div key={key}>
                        <strong>{key}:</strong>
                        <img src={val} alt={key} />
                      </div>
                    ) : null
                  )}
                </div>

                {selectedContractor.status === 'Pending' && (
                  <div className="cm-modal-actions">
                    <button className="cm-approve" onClick={() => handleAction(selectedContractor.id, 'approve')}>
                      Approve
                    </button>
                    <button className="cm-decline" onClick={() => handleAction(selectedContractor.id, 'decline')}>
                      Decline
                    </button>
                  </div>
                )}
              </>
            )}

            {modalType === 'management' && (
              <div className="cm-modal-actions">
                <button className="cm-analytics" onClick={() => alert('Analytics coming soon.')}>
                  View Analytics
                </button>
                <button className="cm-remove" onClick={() => handleRemove(selectedContractor.id)}>
                  Ban Contractor
                </button>
                <button className="cm-remove" onClick={() => handleRemove(selectedContractor.id)}>
                  Suspend Contractor
                </button>
    
              </div>
            )}

            <button className="cm-close-btn" onClick={() => setSelectedContractor(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorManagement;
