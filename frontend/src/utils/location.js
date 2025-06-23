// Share current location using Geolocation API
export const handleShareLocation = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Lat:", pos.coords.latitude, "Lng:", pos.coords.longitude);
        alert(`Location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        callback({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        alert("Error getting location: " + err.message);
      }
    );
  } else {
    alert("Geolocation not supported");
  }
};

// Haversine formula: compute distance in km between two coordinates
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Validate Nigerian phone number
export const isValidPhone = (phone) => /^(070|080|081|090|091)\d{8}$/.test(phone);

// Geocode helper using OpenCage API
export const fetchCoordinates = async (locationStr) => {
  const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;

  if (!apiKey) {
    console.error("Missing OpenCage API key in environment variables.");
    throw new Error("No API key provided");
  }
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationStr)}&key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length > 0) {
      return {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng
      };
    }
    throw new Error('No results found for location');
  } catch (err) {
    console.error('Geocoding error:', err);
    throw err;
  }
};
