import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.17.1/cdn/components/button/button.js';

class RunCommandButton extends HTMLElement {
  // Define the attributes to observe
  static get observedAttributes() {
    return ['command-id']; // Specify the attributes to observe
  }

  // Observe attribute changes and respond
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'command-id' && oldValue !== newValue) {
      console.log(`Command ID changed to: ${newValue}`);
      // You can take additional actions if needed
    }
  }

  constructor() {
    super();

    // Create a Shadow DOM
    this.shadow = this.attachShadow({ mode: 'open' });

    // Create a button element with a slot
    this.shadow.innerHTML = `
      <sl-button id="btn">
        <slot>Run Command</slot>
      </sl-button>
    `;
  }

  // connectedCallback() is called when the element is added to the DOM
  connectedCallback() {
    // Set up the event listener for the button click
    this.shadow.querySelector('#btn').addEventListener('click', () => {
      // Fetch using the command-id attribute, if available
      const commandId = this.getAttribute('command-id') || '9';
      fetch(`/read-sms/${commandId}`)
        .then(response => response.text())
        .then(data => {
          document.querySelector('#output').textContent = data;
        })
        .catch(err => {
          document.querySelector('#output').textContent = 'Error: ' + err;
        });
    });
  }
}

customElements.define('run-command-button', RunCommandButton);
