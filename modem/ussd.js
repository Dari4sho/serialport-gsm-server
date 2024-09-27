import { EventEmitter } from 'events';
import { modem } from './modem.js';
import { multiLineCommand } from "../utils/multiLineCommand.js"; // Assuming modem is exported from modem.js

// Create an event emitter for USSD events
const ussdEmitter = new EventEmitter();

// Function to send a USSD command and get the response
const sendUssdCommand = (code) => {
  return new Promise((resolve, reject) => {
    multiLineCommand(modem, {
      command: `AT+CUSD=1,"${ code }"`,
      responseStart: '+CUSD: 1,"',
      responseEnd: '", 1',
    }, (result, err) => {
      if (err) {
        console.error('Error executing USSD:', err);
        reject(err);
      } else {
        console.debug('USSD Response:', result);
        resolve(result);
      }
    });
  });
};

// Function to cancel a USSD session
const cancelUssdSession = () => {
  return new Promise((resolve, reject) => {
    console.log('Cancelling USSD session...');
    modem.executeCommand('AT+CUSD=2', (result, error) => {
      if (error) {
        console.error('Error cancelling USSD session:', error);
        reject(error);
      } else {
        console.log('USSD session cancelled:', result);
        resolve(result);
      }
    });
  });
};

// Initialize listener for incoming USSD messages
const initializeUssdListener = () => {
  modem.on('onNewIncomingUSSD', (data) => {
    console.log('Incoming USSD:', data);
    // Emit a 'new-ussd' event with the data
    ussdEmitter.emit('new-ussd', data);
  });
};
initializeUssdListener();

// Export the explicit USSD functions and the event emitter
export {
  sendUssdCommand,
  cancelUssdSession,
  ussdEmitter,
};
