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

## Installation
```bash
npm install
```

## Usage
```bash
npm start
```

Props to the original author of the serialport-gsm & serialport libraries + everyone involved in the chain of dependencies.