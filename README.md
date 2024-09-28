# SerialPort-GSM + Express Server

See https://github.com/zabsalahid/serialport-gsm   
Wraps some functionality of the serialport-gsm library in an express server for on-demand access to the GSM modem.   

Patches a minor bug in mentioned library regarding ussd handling.   

Adds a simple multiline handling implementation as the original library does not support it.
- Read multiline SMS messages
- Read all phonebook entries

## List of available routes
| Route                   | Description                                                                |
|-------------------------|----------------------------------------------------------------------------|
| `/check-sim-status`     | Gives the status of the SIM card                                           |
| `/read-sms/:id`         | Reads a specific SMS by ID                                                 |
| `/read-sms`             | Reads all SMS messages                                                     |
| `/check-sim-memory`     | Checks the SIM memory status                                               |
| `/network-signal`       | Checks the network signal strength                                         |
| `/modem-serial`         | Checks the modem serial number                                             |
| `/phonebook-storages`   | Checks the available phonebook storages                                    |
| `/phonebook-entries`    | Reads the phonebook entries                                                |
| `/send-ussd`            | Sends a USSD request.<br/>Example: `/send-ussd?code=%2A100%23` for `*100#` |
| `/cancel-ussd`          | Cancels the current USSD request                                           |


Additionally, adds access to a couple of modem events on the sever for further processing, e.g. logging or sending to sockets.

Also adds & serves a dummy web interface (WIP) based on webComponents ([showelace UI library](https://shoelace.style/)) that enables to build something more user-friendly.   
- Lists all SMS messages
- Renders messages content on button click

## Installation
```bash
npm install
```

## Usage
- Connect your GSM module (e.g. sim800c over USB)
- Go to `modem/modem.js` and adjust the serial port to the one your modem is connected to & the serial port settings (or keep the defaults)
- Optionally adjust the port the server listens to in `server.js`
- Start the server with the following command
```bash
npm start
```

## Debugging
To print every response line from the modem to the server console, uncomment the debug import in `server.js`

---
Props to the original author of the [serialport-gsm](https://github.com/zabsalahid/serialport-gsm) & [node-serialport](https://github.com/serialport/node-serialport) libraries + everyone involved in the chain of dependencies.