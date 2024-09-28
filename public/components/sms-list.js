import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.17.1/cdn/components/card/card.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.17.1/cdn/components/button/button.js';

class SmsList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        #sms-list-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      
        sl-card {
          display: flex;
          margin: 10px 0;
          padding: 15px;
        }

        .sms-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sms-content {
          flex-grow: 1;
          margin-right: 10px;
        }
      </style>
      <div id="sms-list-container"></div>
    `;
  }

  connectedCallback() {
    // Fetch messages from the server
    this.fetchMessages();
  }

  fetchMessages() {
    fetch('/read-sms') // Replace with your backend endpoint for SMS list
      .then(response => response.json())
      .then(data => {
        const messages = parseSmsArray(data.messages.data.result);
        this.renderMessages(messages);
      })
      .catch(err => {
        this.shadow.innerHTML = `<p>Error fetching messages: ${err}</p>`;
      });
  }

  renderMessages(messages) {
    const container = this.shadow.querySelector('#sms-list-container');
    container.innerHTML = '';

    // Render each message as an <sl-card>
    messages.forEach(message => {
      const card = document.createElement('sl-card');
      card.innerHTML = `
        <div class="sms-item">
          <div class="sms-content">
            <strong>${message.index}</strong><br>
            ...
          </div>
          <sl-button variant="primary" size="small" data-id="${message.index}">View</sl-button>
        </div>
      `;
      container.appendChild(card);

      // Add event listener for the 'View' button
      card.querySelector('sl-button').addEventListener('click', (e) => {
        const messageId = e.target.getAttribute('data-id');
        this.viewMessage(messageId);
      });
    });
  }

  viewMessage(id) {
    fetch(`/read-sms/${id}`) // Adjust endpoint as per your backend API
      .then(response => response.text())
      .then(data => {
        document.querySelector('#output').textContent = `Message: ${data}`;
      })
      .catch(err => {
        document.querySelector('#output').textContent = 'Error: ' + err;
      });
  }
}

customElements.define('sms-list', SmsList);

// Function to parse the SMS array
function parseSmsArray(smsArray) {
  const messages = [];
  for (let i = 0; i < smsArray.length; i += 2) {
    const header = smsArray[i]; // Line starting with +CMGL
    const body = smsArray[i + 1]; // PDU body

    // Extract the index from the header
    const indexMatch = header.match(/\+CMGL:\s*(\d+)/);
    const index = indexMatch ? indexMatch[1] : '';

    messages.push({
      index,
      pduBody: body
    });
  }
  return messages;
}
