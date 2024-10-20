class AddressesContainer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('class', 'customer-container');

    document.querySelectorAll('.show-form-btn').forEach((el) => {
      el.addEventListener('click', (event) => {
        const btnTextContent = event.target.dataset.btnlabel;
        const formElement = document.getElementById(event.target.dataset.formbtn);

        if (formElement.style.display === 'block') {
          formElement.style.display = 'none';
          event.target.textContent = btnTextContent;
        } else {
          formElement.style.display = 'block';
          event.target.textContent = 'cancel';
        }
      });
    });

    // set default value for country select
    const countrySelectElement = document.querySelectorAll('.customer-address-select');
    countrySelectElement.forEach((el) => {
      const elChildren = Object.keys(el);
      elChildren.forEach((select) => {
        if (el[select].value === el.dataset.country) {
          el[select].selected = 'selected';
        }
      });
    });
  }
}

customElements.define('addresses-container', AddressesContainer);
