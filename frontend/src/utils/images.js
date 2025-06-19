import logo3 from '../assets/placeholderImg.png';  // adjust path as needed
/**
 * Get the full URL for the contractor's profile photo, or fallback.
 * @param {object} matched - The contractor data object.
 * @returns {string} - The full URL to the image or fallback image.
 */
export function getProfilePhotoUrl(matched) {
  if (matched.profile_photo) {
    return `http://localhost:5050/${matched.profile_photo}`;
  }
  return  logo3;
}

/**
 * Get the array of full URLs for contractor's past work photos.
 * @param {object} matched - The contractor data object.
 * @returns {string[]} - Array of image URLs (or empty array).
 */
export function getPastWorkPhotoUrls(matched) {
  if (Array.isArray(matched.past_work_photos)) {
    return matched.past_work_photos.map(photo => `http://localhost:5050/${photo}`);
  }
  return [];
}
