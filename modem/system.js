import { modem as gsmModem } from './modem.js';

// Explicit function to get modem serial number
const getModemSerial = () => {
  return new Promise((resolve, reject) => {
    gsmModem.getModemSerial((result, err) => {
      if (err) {
        console.error(`Error retrieving Modem Serial - ${err}`);
        reject(err);
      } else {
        console.log(`Modem Serial: ${JSON.stringify(result)}`);
        resolve(result);
      }
    });
  });
};

// Export the explicit modem serial function
export {
  getModemSerial,
};
