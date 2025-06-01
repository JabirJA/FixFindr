import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ContractorsList.css';
import logo from '../../assets/wom.png';
import logo2 from '../../assets/man.png';
import SERVICES from '../../pages/services';
import logo3 from '../../assets/mech2.png'

const contractors = [
  { name: 'Samuel Adeyemi', rating: 5.0, distance: 1.9, type: 'Plumber', image: logo2 },
  { name: 'Chukwuemeka Okafor', rating: 5.0, distance: 3.7, type: 'Electrician', image: logo2 },
  { name: 'Fatima Lawal', rating: 4.8, distance: 4.7, type: 'Mechanic', image: logo },
  { name: 'John Doe', rating: 4.0, distance: 10.0, type: 'Mechanic', image: logo2 },
  { name: 'Ibrahim Yusuf', rating: 4.6, distance: 5.0, type: 'AC Repair', image: logo2 },
  { name: 'Thunder', rating: 3.0, distance: 9.0, type: 'Handyman', image: logo3 },
  { name: 'Godwin', rating: 1.0, distance: 3.0, type: 'Carpenter', image: logo2 },
  { name: 'Slim Sim', rating: 4.6, distance: 4.6, type: 'Electrician', image: logo3 },
];

const StarRating = ({ rating }) => {
  const stars = Math.floor(rating);
  return (
    <div className="stars">
      {'★'.repeat(stars)}
      {'☆'.repeat(5 - stars)}
      <span className="ratingnumber">{rating}</span>
    </div>
  );
};

const ContractorsListPage = () => {
  const { serviceType } = useParams();

  const decodedType = serviceType
    ? decodeURIComponent(serviceType).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'All';

  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [typeFilter, setTypeFilter] = useState(decodedType);
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter and sort contractors
  const filteredContractors = contractors
    .filter(c =>
      c.rating >= minRating &&
      c.distance <= maxDistance &&
      (typeFilter === 'All' || c.type.toLowerCase() === typeFilter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContractors = filteredContractors.slice(startIndex, startIndex + itemsPerPage);

  // Handlers for next/previous buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Reset page to 1 when filters change (optional)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [minRating, maxDistance, typeFilter, sortBy]);

  return (
    <div className="contractors-page" data-theme="light">
      <header className="header">
        <h1>Find Contractors Near You</h1>
      </header>

      <div className="filters">
      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
  <option value="All">All Types</option>
  {SERVICES.map(service => (
    <option key={service} value={service}>{service}</option>
  ))}
</select>

        <select value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))}>
          <option value="0">All Ratings</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
          <option value="5.0">5.0 only</option>
        </select>

        <select value={maxDistance} onChange={e => setMaxDistance(parseFloat(e.target.value))}>
          <option value="10">Any Distance</option>
          <option value="5">Within 5 km</option>
          <option value="3">Within 3 km</option>
          <option value="2">Within 2 km</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      <div className="contractor-list">
        {paginatedContractors.length > 0 ? (
          paginatedContractors.map((contractor, index) => (
            <div key={index} className="contractor-card">
              <img src={contractor.image} alt={contractor.name} />
              <div className="info">
                <h2>
                  <Link to={`/contractor/${contractor.name.replace(/\s+/g, '').toLowerCase()}`}>
                    {contractor.name}
                  </Link>
                </h2>
                <p className="type">{contractor.type}</p>
                <StarRating rating={contractor.rating} />
                <p>{contractor.distance} km away</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No contractors found for “{typeFilter}”.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractorsListPage;
