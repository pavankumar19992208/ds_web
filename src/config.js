// config.js

// Define the base URL for the backend
const BaseUrl = 'http://ec2-3-110-55-252.ap-south-1.compute.amazonaws.com:8002';
// const BaseUrl = 'http://localhost:8000';

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