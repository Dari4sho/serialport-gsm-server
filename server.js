import express from 'express';
import { initializeModem, closeModem } from './modem/modem.js';
import { readAllSms, readSmsById } from './modem/sms.js';
import { cancelUssdSession, sendUssdCommand, ussdEmitter } from './modem/ussd.js';
import { checkSimStatus } from './modem/sim.js';
import { incomingCallEmitter } from "./modem/call.js";
import { checkSimMemory, memoryEmitter } from "./modem/memory.js";
import { getNetworkSignal } from "./modem/network.js";
import { getModemSerial } from "./modem/system.js";
import { getAvailableStorages, readPhonebookEntries } from "./modem/phonebook.js";
// import './modem/debug.js';

const app = express();
const port = 3010;
let server;

// Initialize the modem when the server starts
initializeModem((err) => {
  if (err) {
    console.error('Modem initialization failed:', err);
    process.exit(1);
  }

  // Start the Express server
  server = app.listen(port, () => {
    console.log(`Modem control API listening at http://localhost:${ port }`);
  });
});

// Endpoint to check SIM status
app.get('/check-sim-status', async (req, res) => {
  try {
    const resp = await checkSimStatus();
    res.json({
      status: 'success',
      simStatus: resp,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to read an SMS by its ID
app.get('/read-sms/:id', async (req, res) => {
  try {
    const smsId = parseInt(req.params.id, 10);
    const sms = await readSmsById(smsId);
    if (sms) {
      res.json({
        status: 'success',
        message: sms,
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: `No SMS found with ID ${ smsId }`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to read all SMS as JSON
app.get('/read-sms', async (req, res) => {
  try {
    const allSms = await readAllSms();
    res.json({
      status: 'success',
      messages: allSms,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to explicitly check SIM memory
app.get('/check-sim-memory', async (req, res) => {
  try {
    const simMemoryStatus = await checkSimMemory();
    res.json({
      status: 'success',
      simMemoryStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to get network signal strength
app.get('/network-signal', async (req, res) => {
  try {
    const signalStrength = await getNetworkSignal();
    res.json({
      status: 'success',
      signalStrength,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to get modem serial number
app.get('/modem-serial', async (req, res) => {
  try {
    const serialNumber = await getModemSerial();
    res.json({
      status: 'success',
      serialNumber,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to get available phonebook storages
app.get('/phonebook-storages', async (req, res) => {
  try {
    const storages = await getAvailableStorages();
    res.json({
      status: 'success',
      storages,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to read phonebook entries
app.get('/phonebook-entries', async (req, res) => {
  const storage = req.query.storage || 'SM'; // Default to 'SM' if not specified
  try {
    const entries = await readPhonebookEntries(storage);
    res.json({
      status: 'success',
      entries,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to send a USSD command.
// Example: http://localhost:3010/send-ussd?code=%2A100%23 - where %2A is * and %23 is # so the code is *100#
app.get('/send-ussd', async (req, res) => {
  const code = req.query.code; // USSD code from query parameter (e.g., *100#)
  if (!code) {
    return res.status(400).json({ status: 'error', message: 'USSD code is required' });
  }
  try {
    const ussdResponse = await sendUssdCommand(code);
    res.json({
      status: 'success',
      response: ussdResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Endpoint to cancel a USSD session
app.get('/cancel-ussd', async (req, res) => {
  try {
    const cancelResponse = await cancelUssdSession();
    res.json({
      status: 'success',
      response: cancelResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Listen for new USSD events
ussdEmitter.on('new-ussd', (data) => {
  console.log('Received USSD message:', data);
  // ...
});

// Listen for memory full events
memoryEmitter.on('memory-full', (data) => {
  console.log('Memory is full:', data);
  // ...
});

// Listen to 'new-call' events
incomingCallEmitter.on('new-call', (call) => {
  console.log('New call received:', call);
  // Add any logic you want to handle the call, e.g. send an SMS to notify someone - or to log it - or to forward it
  // to a socket connection, etc.
});

// Listen to 'new-call' events
incomingCallEmitter.on('call-ended', () => {
  console.log('Call ended!');
  // ...
});

// Function to gracefully shut down the modem and server
const gracefulShutdown = () => {
  console.log('\nGracefully shutting down...');

  // Close the modem connection
  closeModem(() => {
    // Close the server
    if (server) {
      server.close(() => {
        console.log('Express server closed');
        process.exit(0);
      });
    }
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
