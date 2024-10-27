// config.js

// Define the base URL for the backend
const BaseUrl = 'https://0e20-2406-b400-d1-ea60-3cac-edfe-acc4-3d62.ngrok-free.app';

// Export the base URL so it can be used in other files
export default BaseUrl;

//-----//
// import BASE_URL from './config';

// // Example usage in an API call
// fetch(`${BASE_URL}/endpoint`, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));