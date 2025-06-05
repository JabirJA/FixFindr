// utils/functions.js

/**
 * Handles user sign-out:
 * - Clears authentication-related localStorage items
 * - Dispatches an 'authChange' event to notify other tabs/components
 * - Navigates to the homepage
 * 
 * @param {Function} navigate - The react-router-dom navigate function
 */
export const handleSignOut = (navigate) => {
    // Clear auth info from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
  
    // Dispatch a custom event to notify listeners on this tab (and others)
    window.dispatchEvent(new Event('authChange'));
  
    // Redirect to home page
    navigate('/');
  };
  