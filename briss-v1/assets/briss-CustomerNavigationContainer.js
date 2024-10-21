class CustomerNavigationContainer extends HTMLElement {
  constructor() {
    super();

    this.domElements = {
      // SELECTORS
      cartCardContainer: document.querySelector('.cart-card-container'),
      customerNavigationSearch: document.getElementById('customer-navigation__search'),
      customerNavigationAccount: document.getElementById('customer-navigation__account'),
      customerNavigationCart: document.getElementById('customer-navigation__cart'),
      customerNavigationCartTotal: document.getElementById('customer-navigation-cart-total'),
      cartProductQuantity: document.getElementById('cart-product__quantity'),
      // NODELIST
      cartProductCardAll: document.querySelectorAll('.cart-product-card'),
      // STRINGS
      cartProductCardBtnRefresh: '.cpc-btn__refresh',
      cartProductCardBtnRemove: '.cpc-btn__remove',
    };
  }
  closeCustomerNavigationModal(event, parentId, signal) {
    if (event.target.id === parentId.id || parentId.contains(event.target)) {
      return;
    }
    parentId.querySelector('.customer-navigation__content').style.display = 'none';

    signal.abort();
  }

  showCustomerNavigationModal(event, elementId) {
    if (event.target.id !== elementId) {
      return;
    }
    const removeCloseModalListener = new AbortController();

    const parentId = event.target;
    console.log(parentId);

    parentId.querySelector('.customer-navigation__content').style.display = 'block';
    document.addEventListener(
      'click',
      (event) => {
        this.closeCustomerNavigationModal(event, parentId, removeCloseModalListener);
      },
      { signal: removeCloseModalListener.signal }
    );
  }

  connectedCallback() {
    console.log('hello');
    this.setAttribute('class', 'customer-navigation');

    this.domElements.customerNavigationSearch.addEventListener('click', (e) => {
      this.showCustomerNavigationModal(e, 'customer-navigation__search');
    });
    this.domElements.customerNavigationAccount.addEventListener('click', (e) => {
      this.showCustomerNavigationModal(e, 'customer-navigation__account');
    });
    this.domElements.customerNavigationCart.addEventListener('click', (e) => {
      this.showCustomerNavigationModal(e, 'customer-navigation__cart');
    });
  }
}

customElements.define('customer-navigation-container', CustomerNavigationContainer);
