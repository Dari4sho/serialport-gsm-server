const multiLineCommand = (modem, opts, callback) => {
  const { command, responseStart, responseEnd } = opts;

  const lines = [];

  const commandParser = modem.executeCommand(command,  (result, err) => callback(result, err));

  commandParser.logic = (dataLine) => {
    if (dataLine.startsWith(responseStart)) {
      // Get actual first line of message
      const arr = dataLine.split(responseStart);

      // Add the first line to the response
      lines.push(arr[1].trim());
    }
    // When the response-end hint/string is found, return the result
    else if (dataLine.includes(responseEnd)) {
      return {
        resultData: {
          status: 'success',
          request: 'executeCommand',
          data: { 'result': lines }
        },
        returnResult: true
      }
    } else if (dataLine.includes('ERROR') || dataLine.includes('COMMAND NOT SUPPORT')) {
      return {
        resultData: {
          status: 'ERROR',
          request: 'executeCommand',
          data: `Execute Command returned Error: ${dataLine}`
        },
        returnResult: true
      }
    } else {
      const line = dataLine.trim();

      // Do not add the command to the response
      if (line === command) {
        return;
      }

      // Do not add empty lines to the response
      if (line === '') {
        return;
      }

      // Do not add 'OK' to the response
      if (line === 'OK') {
        return;
      }

      // Message seems to not have finished yet. Add lines to the response
      lines.push(line);
    }
  };
};

export { multiLineCommand };