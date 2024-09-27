import { modem } from './modem.js';
import { multiLineCommand } from "../utils/multiLineCommand.js";

// Function to check available phonebook storages
const getAvailableStorages = () => {
  return new Promise((resolve, reject) => {
    modem.executeCommand('AT+CPBS=?', (result, error) => {
      if (error) {
        console.error('Error checking available phonebook storages:', error);
        reject(error);
      } else {
        console.log('Available phonebook storages:', result);
        resolve(result);
      }
    });
  });
};

// Function to read phonebook entries
const readPhonebookEntries = (storage = 'SM') => {
  return new Promise((resolve, reject) => {
    // Set the storage location (e.g., SIM, ME)
    modem.executeCommand(`AT+CPBS="${storage}"`, async (result, error) => {
      if (error) {
        console.error(`Error setting phonebook storage ${storage}:`, error);
        reject(error);
      } else {
        // Read the phonebook entries from the specified storage
        multiLineCommand(modem, {
          command: 'AT+CPBR=1,100', // Read phonebook entries from 1 to 100
          eachLineStart: '+CPBR: ', // Prefix for each line of an entry
          responseEnd: 'OK', // Response termination keyword
        }, (entries, err) => {
          if (err) {
            console.error('Error getting Phonebook:', err);
            reject(err);
          } else {
            console.debug('Phonebook entries:', entries);
            resolve(entries);
          }
        });
      }
    });
  });
};

// Export the explicit phonebook functions
export {
  getAvailableStorages,
  readPhonebookEntries,
};
