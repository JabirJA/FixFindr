import { useParams, useNavigate } from 'react-router-dom';
import './ContractorProfilePage.css';
import logo2 from '../../assets/man.png';
import logo from '../../assets/mechanic.png'
const contractors = [
  {
    firstName: 'John',
    lastName: 'Doe',
    image: logo2,
    rating: 4.5,
    intro: 'Experienced handyman with a wide range of skills.',
    experienceYears: 10,
    languages: 'English, Pidgin, Hausa',
    services: [
      { name: 'Plumbing', price: 10000 },
      { name: 'Electrical', price: 15000 },
    ],
    gallery: [
      logo,
      'https://via.placeholder.com/400x300?text=Work+1',
      'https://via.placeholder.com/400x300?text=Work+2',

    ],
    reviews: [
      { customer: 'Mary J.', comment: 'John fixed my sink perfectly. Highly recommend!', rating: 5 },
      { customer: 'Paul K.', comment: 'Great service and very professional.', rating: 4 },
    ],
    availability: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 2:00 PM',
      Sunday: 'Closed',
    },
    isAvailable: true,
    location: {
      address: '123 Main St, Abuja, Nigeria',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.123456789!2d7.49508!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a123456789%3A0xabcdef123456789!2s123%20Main%20St%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1610000000000!5m2!1sen!2sng',
    },
    phone: '+234 800 123 4567',
    email: 'john.doe@example.com',
  },
];

// StarRating component to show stars + numeric rating
const StarRatings = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <p className="rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star">
          &#9733;
        </span> // filled star
      ))}
      {halfStar && (
        <span className="star">
          &#9734;
        </span> /* half star shown as empty star for simplicity */
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star">
          &#9734;
        </span> // empty star
      ))}
      <span className="rating-number"> {rating}</span>
    </p>
  );
};

const ContractorProfilePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const matchedContractor = contractors.find(
    (c) => `${c.firstName}${c.lastName}`.toLowerCase() === name.toLowerCase()
  );

  if (!matchedContractor) return <div className="not-found">Contractor not found.</div>;

  const {
    firstName,
    lastName,
    image,
    rating,
    intro,
    experienceYears,
    languages,
    services,
    gallery,
    reviews,
    availability,
    isAvailable,
    location,
    phone,
  } = matchedContractor;

  const handleHireClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="contractor-profile-container">
      <div className="contractor-main-card">
        <img src={image} alt={`${firstName} ${lastName}`} className="contractorimage" />

        <div className="contractor-info">
          <h1 className="contractor-name">
            {firstName} {lastName}
          </h1>
          <p className="contractor-services-summary">{services.map((s) => s.name).join(', ')}</p>

          <StarRatings rating={rating} />

          <h2 className="availability-heading">
            <span className={isAvailable ? 'available' : 'unavailable'}>
              {isAvailable ? 'Available' : 'Unavailable'}
              <p className="distance-info">3 km away</p>
            </span>
          </h2>

          <button className="btn book-btn" onClick={handleHireClick}>
            Hire {firstName}
          </button>

          <button className="btn chat-btn">Chat with {firstName}</button>
        </div>
      </div>

      <section className="about-section">
        <h2>About This Contractor</h2>
        <p className="intro">{intro}</p>
        <p className="experience">
          <strong>Experience:</strong> {experienceYears} years
        </p>
        <p className="lang">
          <strong> Languages Spoken:</strong> {languages}
        </p>
      </section>

      <h2>Services Offered</h2>
      <ul className="services-list">
        {services.map((s, i) => (
          <li key={i}>
            <strong>{s.name}</strong> - ₦{s.price.toLocaleString()}
          </li>
        ))}
      </ul>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.map((r, i) => (
          <div className="review" key={i}>
            <p>
              <strong>{r.customer}</strong> <span className="review-rating">★ {r.rating}</span>
            </p>
            <p>{r.comment}</p>
          </div>
        ))}
      </section>

      <section className="gallery-section">
        <h2>Past Work</h2>
        <div className="gallery">
          {gallery.map((url, i) => (
            <img key={i} src={url} alt={`Work ${i + 1}`} />
          ))}
        </div>
      </section>

      <h2>Weekly Availability</h2>
      <div className="availability-center">
        <select className="availability-dropdown" aria-label="Select day to view availability">
          {Object.entries(availability).map(([day, hours], i) => (
            <option key={i} value={day}>
              {day}: {hours}
            </option>
          ))}
        </select>
      </div>

      <section className="map-section">
        <h2>Location</h2>
        <p>{location.address}</p>
        <iframe
          src={location.mapEmbedUrl}
          height="300"
          allowFullScreen=""
          loading="lazy"
          title="Contractor Location"
          className="map-iframe"
        ></iframe>
      </section>
    </div>
  );
};

export default ContractorProfilePage;
