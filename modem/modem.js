import gsm from 'serialport-gsm';

// Create modem instance
const modem = gsm.Modem();
const serialPort = 'COM6'; // Replace with your actual serial port
const options = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  rtscts: false,
  xon: false,
  xoff: false,
  xany: false,
  autoDeleteOnReceive: false,
  enableConcatenation: true,
  incomingCallIndication: true,
  incomingSMSIndication: true,
};

// Open modem connection
const initializeModem = (callback) => {
  modem.open(serialPort, options, (err) => {
    if (err) {
      console.error('Failed to open serial port:', err);
      callback(err);
    } else {
      console.log('Modem connected successfully!');
      callback(null);
    }
  });
};

// Function to close the modem connection
const closeModem = (callback) => {
  modem.close(() => {
    console.log('Modem connection closed');
    callback();
  });
};

// Export the modem and initialization functions
export {
  modem,
  initializeModem,
  closeModem,
};
