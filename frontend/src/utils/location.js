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
  
  export const isValidPhone = (phone) => /^(070|080|081|090|091)\d{8}$/.test(phone);
