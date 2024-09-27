import { modem as gsmModem } from './modem.js';

// Explicit function to get network signal strength
const getNetworkSignal = () => {
  return new Promise((resolve, reject) => {
    gsmModem.getNetworkSignal((result, err) => {
      if (err) {
        console.error(`Error retrieving Signal Strength - ${err}`);
        reject(err);
      } else {
        console.log(`Signal Strength: ${JSON.stringify(result)}`);
        resolve(result);
      }
    });
  });
};

// Export the explicit network signal function
export {
  getNetworkSignal,
};
