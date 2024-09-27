import { EventEmitter } from 'events';
import { modem } from './modem.js';

// Create an event emitter for call events
const incomingCallEmitter = new EventEmitter();

// Function to set up the event listeners for incoming calls
const initializeCallListeners = () => {
  // Listener for incoming calls
  modem.on('onNewIncomingCall', (call) => {
    console.log('Incoming call:', call);

    // Emit the 'new-call' event with the call data
    incomingCallEmitter.emit('new-call', call);
  });

  // Add listener for when the caller hangs up (NO CARRIER)
  modem.addListener({
    match: (res) => res === 'NO CARRIER',
    process: () => {
      console.log('Caller has hung up');

      // Emit a 'call-ended' event to notify listeners
      incomingCallEmitter.emit('call-ended');
    },
  });
};

// Automatically initialize the listeners when this module is imported
initializeCallListeners();

// Export the event emitter for other modules to listen to call events
export {
  incomingCallEmitter,
};
