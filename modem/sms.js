import { modem } from './modem.js';
import { multiLineCommand } from "../utils/multiLineCommand.js";

// Function to read an SMS by ID
const readSmsById = (id) => {
  return new Promise((resolve, reject) => {
    modem.readSMSById(id, (result, error) => {
      if (error) {
        console.error(`Error reading SMS by ID ${id}:`, error);
        reject(error);
      } else {
        if (!Array.isArray(result.data) || !result.data.length) {
          console.log(`No SMS found with ID ${id}`);
          resolve(null);
        } else {
          console.log(`SMS by ID ${id}:`, result.data[0].message);
          resolve(result.data[0]);
        }
      }
    });
  });
};

// Function to read all stored SMS messages
const readAllSms = () => {
  return new Promise((resolve, reject) => {
    // Use the multiLineCommand to read all SMS messages
    multiLineCommand(modem, {
      command: 'AT+CMGL=4', // Command to list all SMS messages
      eachLineStart: '+CMGL: ', // Prefix for each line of an SMS message
      responseEnd: 'OK', // Response termination keyword
    }, (result, error) => {
      if (error) {
        console.error('Error reading all SMS:', error);
        reject(error);
      } else {
        console.log('All SMS:', result);
        resolve(result); // Return the complete result containing all SMS data
      }
    });
  });
};

// Export SMS-related functions
export {
  readSmsById,
  readAllSms
};
