import { modem } from './modem.js'; // Assuming modem is exported from modem.js

// Function to initialize the debugging listener for all modem messages
const initializeDebugListener = () => {
  modem.addListener({
    match: (newpart) => {
      // Log all messages received from the modem
      console.debug('RAW:', newpart);
      return null;
    },
    process: () => void 0,
  });
};

// Initialize the debugging listener immediately upon module load
initializeDebugListener();

export {
  initializeDebugListener,
};
