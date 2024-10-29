class CustomerNavigationCart extends HTMLElement {
  constructor() {
    super();

    this.domElements = {
      // SELECTORS
      // cartCardContainer: document.querySelector('.cart-card-container'),
      customerNavigationCart: document.getElementById('customer-navigation-cart'),
      customerNavigationCartTotal: document.getElementById('customer-navigation-cart-total'),
      cartProductQuantity: document.getElementById('cart-product__quantity'),
      // NODE LIST
      cartProductCardAll: document.querySelectorAll('.cart-product-card'),
      // STRINGS
      cartProductCardBtnRefresh: '.cpc-btn__refresh',
      cartProductCardBtnRemove: '.cpc-btn__remove',
    };
  }

  showSpinner(parentElement) {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.lastChild);
    }
    parentElement.insertAdjacentHTML('beforeend', '<span class="loader"></span>');
  }

  getProductCardId(event) {
    let parentElement = event.target;

    while (true) {
      if (parentElement.classList.contains('cart-product-card')) {
        console.log('sjsjjsjss');
        break;
      }
      parentElement = parentElement.parentNode;
    }

    return parentElement.id;
  }
  async updateCartPrice(productId = null) {
    this.showSpinner(this.domElements.customerNavigationCartTotal);
    if (productId) {
      this.showSpinner(document.getElementById(`cpc-total-price-#${productId}`));
    }

    const url = new URLParse(window.location.href, true);

    const newUrl = url.toString();

    try {
      // REQUEST HTML WITH UPDATED CART
      const getPriceReq = await fetch(newUrl);
      const getPriceRes = await getPriceReq.text();
      const parser = new DOMParser();
      const html = parser.parseFromString(getPriceRes, 'text/html');

      // UPDATE TOTAL CART PRICE

      const newCartTotal = html.getElementById('customer-navigation-cart-total').textContent;
      this.domElements.customerNavigationCartTotal.textContent = newCartTotal;

      if (productId) {
        const newProductTotal = html.getElementById(`cpc-total-price-#${productId}`).textContent;
        document.getElementById(`cpc-total-price-#${productId}`).textContent = newProductTotal;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductQuantity(event) {
    const parentProductCardId = this.getProductCardId(event);
    const parentProductCard = document.getElementById(parentProductCardId);

    const quantityInputEl = parentProductCard.querySelector('.cart-product__quantity');

    if (!quantityInputEl.value) {
      return;
    }

    try {
      const productId = parentProductCard.dataset.pid;

      const updates = {
        [productId]: quantityInputEl.value,
      };

      const updateProductQuantityReq = await fetch(`${window.Shopify.routes.root}cart/update.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      await updateProductQuantityReq.json();
      await this.updateCartPrice(productId);
    } catch (error) {
      console.error(error.message);
    }
  }

  async removeProductFromCart(event) {
    const parentProductCardId = this.getProductCardId(event);
    const parentProductCard = document.getElementById(parentProductCardId);

    try {
      const productId = parentProductCard.dataset.pid;

      const updates = {
        [productId]: 0,
      };

      const removeProductReq = await fetch(`${window.Shopify.routes.root}cart/update.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      await removeProductReq.json();
      await this.updateCartPrice();
      parentProductCard.remove();
    } catch (error) {
      console.error(error);
    }
  }

  connectedCallback() {
    document
      .querySelectorAll(this.domElements.cartProductCardBtnRefresh)
      .forEach((el) => el.addEventListener('click', (e) => this.updateProductQuantity(e)));
    document
      .querySelectorAll(this.domElements.cartProductCardBtnRemove)
      .forEach((el) => el.addEventListener('click', (e) => this.removeProductFromCart(e)));
  }
}

customElements.define('customer-navigation-cart', CustomerNavigationCart);
