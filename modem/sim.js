import { modem } from './modem.js';

// Function to check SIM status
const checkSimStatus = () => {
  return new Promise((resolve, reject) => {
    modem.executeCommand('AT+CPIN?', (result, error) => {
      if (error) {
        console.error('Error checking SIM status:', error);
        reject(error); // Reject the promise with the error
      } else {
        console.log('SIM status:', result);
        resolve(result); // Resolve the promise with the result
      }
    });
  });
};

// Export SIM-related functions
export {
  checkSimStatus,
};
