import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ContractorsList.css';
import logo from '../../assets/wom.png';
import logo3 from '../../assets/mech2.png';
import placeholder from '../../assets/placeholderImg.png';
import SERVICES from '../../pages/services';
import { getDistanceFromLatLonInKm, fetchCoordinates } from '../../utils/location';
import { getProfilePhotoUrl} from '../../utils/images';
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

  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(45);
  const [typeFilter, setTypeFilter] = useState(decodedType);
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await fetch('http://localhost:5050/contractors');
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        if (!navigator.geolocation) {
          console.warn("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const enrichedPromises = data
            .filter(c => c.verified)
            .map(async (c) => {
              const name = `${c.first_name || ''} ${c.last_name || ''}`.trim();
              const image = c.profile_photo || (
                c.service_type === 'Mechanic' ? logo3 :
                (c.first_name && c.first_name.endsWith('a') ? logo : placeholder)
              );

              let contractorLat = c.location?.latitude;
              let contractorLon = c.location?.longitude;

              if (!contractorLat || !contractorLon) {
                const locationStr = `${c.area}, ${c.lga}, ${c.state}, Nigeria`;
                try {
                  const coords = await fetchCoordinates(locationStr);
                  contractorLat = coords.lat;
                  contractorLon = coords.lng;
                } catch (err) {
                  console.warn(`Could not geocode ${name}`, err);
                }
              }

              let distance = null;
              if (contractorLat && contractorLon) {
                distance = getDistanceFromLatLonInKm(userLat, userLon, contractorLat, contractorLon);
              }

              return {
                ...c,
                name: name || 'Unnamed Contractor',
                image: getProfilePhotoUrl(c),
                type: c.service_type || 'Unknown',
                rating: c.star_rating || 0,
                distance: distance ? distance.toFixed(2) : null
              };
            });

          const enriched = await Promise.all(enrichedPromises);
          setContractors(enriched);

        }, (err) => {
          console.error("Geolocation error:", err);
        });

      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const filteredContractors = contractors
    .filter(c =>
      c.rating >= minRating &&
      (c.distance === null || c.distance <= maxDistance) &&
      (typeFilter === 'All' || c.type.toLowerCase() === typeFilter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'distance') return (a.distance || Infinity) - (b.distance || Infinity);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContractors = filteredContractors.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [minRating, maxDistance, typeFilter, sortBy]);

  return (
    <div className="contractors-page" data-theme="light">
      <header className="header">
        <h1>Find Verified Contractors Near You</h1>
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
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
          <option value="5.0">5.0 only</option>
        </select>

        <select value={maxDistance} onChange={e => setMaxDistance(parseFloat(e.target.value))}>
          <option value="45">Any Distance</option>
          <option value="20">Within 20 km</option>
          <option value="10">Within 10 km</option>
          <option value="5">Within 5 km</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      <div className="contractor-list">
        {loading ? (
          <p>Loading contractors...</p>
        ) : paginatedContractors.length > 0 ? (
          paginatedContractors.map((contractor, index) => (
            <div key={index} className="contractor-card">
              <img src={contractor.image} alt={contractor.name || 'Contractor'} />
              <div className="info">
                <h2>
                  <Link to={`/contractor/${(contractor.name || 'contractor').replace(/\s+/g, '').toLowerCase()}`}>
                    {contractor.name || 'Unnamed Contractor'}
                  </Link>
                </h2>
                <p className="type">{contractor.type || 'Unknown Type'}</p>
                <StarRating rating={contractor.rating || 0} />
                <p>{contractor.distance ? `${contractor.distance} km away` : 'Distance unknown'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No verified contractors found for “{typeFilter}”.</p>
        )}
      </div>

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