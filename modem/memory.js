import { EventEmitter } from 'events';
import { modem } from './modem.js';

// Create an event emitter for memory events
const memoryEmitter = new EventEmitter();

// Function to initialize memory event listeners
const initializeMemoryListeners = () => {
  // Listener for memory full event
  modem.on('onMemoryFull', (data) => {
    console.log(`Event Memory Full: ` + JSON.stringify(data));
    memoryEmitter.emit('memory-full', data);
  });
};

// Automatically initialize memory listeners when the module is imported
initializeMemoryListeners();

// Explicit function to check SIM memory status
const checkSimMemory = () => {
  return new Promise((resolve, reject) => {
    modem.checkSimMemory((result, err) => {
      if (err) {
        console.log(`Failed to get SimMemory ${err}`);
        reject(err);
      } else {
        console.log(`Sim Memory Result: ${JSON.stringify(result)}`);
        resolve(result);
      }
    });
  });
};

// Export the event emitter and the explicit memory check function
export {
  memoryEmitter,
  checkSimMemory,
};
