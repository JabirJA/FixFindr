import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ContractorProfilePage.css';
import { getProfilePhotoUrl, getPastWorkPhotoUrls } from '../../utils/images';
import { formatRelativeTime } from '../../utils/dateutils';
import axios from 'axios';
import { getDistanceFromLatLonInKm, fetchCoordinates } from '../../utils/location';

const StarRatings = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <p className="rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star">&#9733;</span>
      ))}
      {halfStar && <span className="star">&#9734;</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star">&#9734;</span>
      ))}
      <span className="rating-number"> {rating}</span>
    </p>
  );
};

const ContractorProfilePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [available, setAvailability] = useState([]);
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const res = await fetch('http://localhost:5050/contractors');
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        const matched = data.find(c =>
          `${c.first_name}${c.last_name}`.toLowerCase() === name.toLowerCase()
        );

        if (matched) {
          const enriched = {
            ...matched,
            name: `${matched.first_name} ${matched.last_name}`,
            profilePhotoUrl: getProfilePhotoUrl(matched),
            pastWorkPhotoUrls: getPastWorkPhotoUrls(matched),
            rating: matched.star_rating || 0,
            services: matched.services || [],
            gallery: matched.gallery || [],
            reviews: matched.reviews || [],
            availability: matched.availability || false,
            languages: matched.languages || 'English',
            experience: matched.experience || 0,
            phone: matched.phone || 'N/A',
            email: matched.email || 'N/A'
          };

          setContractor(enriched);
        } else {
          setContractor(null);
        }

      } catch (error) {
        console.error('❌ Error fetching contractor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [name]);

  useEffect(() => {
    if (!contractor?.contractor_id) return;

    axios.get(`http://localhost:5050/contractors/availability/${contractor.contractor_id}`)
      .then(res => setAvailability(res.data))
      .catch(err => console.error('Error fetching availability:', err));
  }, [contractor]);

  useEffect(() => {
    const computeDistance = async () => {
      if (!contractor) return;

      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        try {
          let contractorLat = contractor.location?.latitude;
          let contractorLon = contractor.location?.longitude;
          if (!contractorLat || !contractorLon) {
            const locationStr = `${contractor.area}, ${contractor.lga}, ${contractor.state}, Nigeria`;
            const coords = await fetchCoordinates(locationStr);
            contractorLat = coords.lat;
            contractorLon = coords.lng;
          
            // Build a fresh contractor object
            const enrichedContractor = {
              ...contractor,
              location: {
                ...contractor.location,
                latitude: contractorLat,
                longitude: contractorLon
              },
              latitude: contractorLat,
              longitude: contractorLon,
            };
          
            setContractor(enrichedContractor);
          }
          

          if (contractorLat && contractorLon) {
            const dist = getDistanceFromLatLonInKm(
              userLat,
              userLon,
              contractorLat,
              contractorLon
            );
            setDistance(dist.toFixed(2));
          }
        } catch (err) {
          console.error("Error computing distance:", err);
        }
      }, (error) => {
        console.error("Error getting user location:", error);
      });
    };

    computeDistance();
  }, [contractor]);

  if (loading) return <p>Loading contractor profile...</p>;
  if (!contractor) return <div className="not-found">Contractor not found.</div>;

  const {
    first_name,
    last_name,
    rating,
    bio,
    experience,
    languages,
    services,
    gallery,
    reviews,
    availability,
    pastWorkPhotoUrls
  } = contractor;

  const handleHireClick = () => {
    navigate('/checkout', { state: { contractor } });
  };
  

  return (
    <div className="contractor-profile-container">
      <div className="contractor-main-card">
        <img className="contractorimage" src={contractor.profilePhotoUrl} alt="Profile Photo" />
        <div className="contractor-info">
          <h1 className="contractor-name">{first_name} {last_name}</h1>
          {contractor.service_type && (
            <h3 className="contractor-service-type">{contractor.service_type}</h3>
          )}
          <StarRatings rating={rating} />
          <h2 className="availability-heading">
            <span className={availability ? 'available' : 'unavailable'}>
              {availability ? 'Available' : 'Unavailable'}
            </span>
            <p className="distance-info">
              {distance ? `${distance} km away` : 'Distance unknown'}
            </p>
          </h2>

          <button className="btn book-btn" onClick={handleHireClick}>
            Hire {first_name}
          </button>
          <button className="btn chat-btn">Chat with {first_name}</button>
        </div>
      </div>

      {!availability && (
        <p className="unavailable-note">
          {first_name} is currently unavailable for immediate bookings. You can still schedule a future appointment.
        </p>
      )}

      <section className="about-section">
        <h2>About This Contractor</h2>
        <p className="intro">{bio || 'No intro provided.'}</p>
        <p className="experience"><strong>Experience:</strong> {experience} years</p>
        <p className="lang"><strong>Languages Spoken:</strong> {languages}</p>
      </section>

      <h2>Services Offered</h2>
      <ul className="services-list">
        {services.length > 0 ? (
          services.map((s, i) => (
            <li key={i}><strong>{s.name}</strong> - ₦{s.price?.toLocaleString() || 'N/A'}</li>
          ))
        ) : (
          <li>No services listed.</li>
        )}
      </ul>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div className="review" key={i}>
              <p><strong>{r.customer}</strong> <span className="review-rating">★ {r.rating}</span></p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>

      <section className="gallery-section">
        <h2>Past Work</h2>
        <div className="gallery img">
          {pastWorkPhotoUrls && pastWorkPhotoUrls.length > 0 ? (
            pastWorkPhotoUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`Past Work ${idx + 1}`} />
            ))
          ) : gallery && gallery.length > 0 ? (
            gallery.map((url, i) => (
              <img key={i} src={url} alt={`Work ${i + 1}`} />
            ))
          ) : (
            <p>No gallery images.</p>
          )}
        </div>
      </section>

      <h2>Weekly Availability</h2>
      <div className="availability-center">
        <select className="availability-dropdown">
          {available.length > 0 ? (
            available.map((slot, i) => {
              const label = formatRelativeTime(slot.day, slot.hour);
              if (!label) return null;
              return (
                <option key={i} value={`${slot.day}-${slot.hour}`}>
                  {label}
                </option>
              );
            })
          ) : (
            <option disabled>No availability slots</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default ContractorProfilePage;
