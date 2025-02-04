import {
  BaseBenchmarkHelper,
  WINDOW__BENCHMARK_HELPER,
} from './BaseBenchmarkHelper';

class TestcaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Attach a shadow DOM to the element
  }

  // ConnectedCallback is called when the element is inserted into the DOM
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  private getHelper() {
    if ((window as any)[WINDOW__BENCHMARK_HELPER]) {
      return (window as any)[WINDOW__BENCHMARK_HELPER] as BaseBenchmarkHelper;
    }
  }

  // Render the HTML structure for the component
  private render() {
    this.shadowRoot!.innerHTML = `
        <style>
          button {
            margin: 10px;
            padding: 10px;
            cursor: pointer;
          }
        </style>
        <div>
          <button id="helper_init">Init</button>
          <button id="helper_renderData">renderData</button>          
          <button id="helper_scroll">scroll</button>
          <button id="helper_sort">sort</button>
          <button id="helper_filter">filter</button>
          <button id="helper_start_ws">start websocket</button>
          <button id="helper_stop_ws">stop websocket</button>

        </div>
      `;
  }

  // Add event listeners to the buttons
  private addEventListeners() {
    this.shadowRoot
      ?.querySelector('#helper_init')
      ?.addEventListener('click', () => this.getHelper()!.init());
    this.shadowRoot
      ?.querySelector('#helper_renderData')
      ?.addEventListener('click', () => this.getHelper()!.renderData());

    this.shadowRoot
      ?.querySelector('#helper_scroll')
      ?.addEventListener('click', () => this.getHelper()!.scroll());

    this.shadowRoot
      ?.querySelector('#helper_sort')
      ?.addEventListener('click', () => this.getHelper()!.sort());
    this.shadowRoot
      ?.querySelector('#helper_filter')
      ?.addEventListener('click', () => this.getHelper()!.filter());

    this.shadowRoot
      ?.querySelector('#helper_start_ws')
      ?.addEventListener('click', () => this.getHelper()!.startWebsocket());
    this.shadowRoot
      ?.querySelector('#helper_stop_ws')
      ?.addEventListener('click', () => this.getHelper()!.stopWebsocket());
  }
}

// Define the custom element
customElements.define('testcase-component', TestcaseComponent);
