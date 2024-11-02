// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {
    const eventHandler = (event) => {
      // check it does anything
      console.log('EVEVEVVE EVENTHANDLER');
      closeCustomerNavigationModal(event, parentId);
    };

    const closeCustomerNavigationModal = (event, parentId, signal) => {
      if (event.target.id === parentId.id || parentId.contains(event.target)) {
        return;
      }
      parentId.querySelector('.customer-navigation__content').style.display = 'none';

      signal.abort();
    };

    const showCustomerNavigationModal = (event, elementId) => {
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
          closeCustomerNavigationModal(event, parentId, removeCloseModalListener);
        },
        { signal: removeCloseModalListener.signal }
      );
    };

    document.getElementById('customer-navigation__search').addEventListener('click', (e) => {
      showCustomerNavigationModal(e, 'customer-navigation__search');
    });
    document.getElementById('customer-navigation__account').addEventListener('click', (e) => {
      showCustomerNavigationModal(e, 'customer-navigation__account');
    });
    document.getElementById('customer-navigation__cart').addEventListener('click', (e) => {
      showCustomerNavigationModal(e, 'customer-navigation__cart');
    });

    // CART API

    const DOMStrings = {
      // SELECTORS
      cartCardContainer: document.querySelector('.cart-card-container'),
      customerNavigationCart: document.getElementById('customer-navigation-cart'),
      customerNavigationCartTotal: document.getElementById('customer-navigation-cart-total'),
      cartProductCardAll: document.querySelectorAll('.cart-product-card'),
      cartProductQuantity: document.getElementById('cart-product__quantity'),
      // STRINGS
      cartProductCardBtnRefresh: '.cpc-btn__refresh',
      cartProductCardBtnRemove: '.cpc-btn__remove',
    };

    const showSpinner = (parentElement) => {
      while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.lastChild);
      }
      parentElement.insertAdjacentHTML('beforeend', '<span class="loader"></span>');
    };

    const getProductCardId = (event) => {
      let parentElement = event.target;

      while (true) {
        if (parentElement.classList.contains('cart-product-card')) {
          console.log('sjsjjsjss');
          break;
        }
        parentElement = parentElement.parentNode;
      }

      return parentElement.id;
    };

    const updateCartPrice = async (productId = null) => {
      showSpinner(DOMStrings.customerNavigationCartTotal);
      if (productId) {
        showSpinner(document.getElementById(`cpc-total-price-#${productId}`));
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
        DOMStrings.customerNavigationCartTotal.textContent = newCartTotal;

        if (productId) {
          const newProductTotal = html.getElementById(`cpc-total-price-#${productId}`).textContent;
          document.getElementById(`cpc-total-price-#${productId}`).textContent = newProductTotal;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const updateProductQuantity = async (event) => {
      const parentProductCardId = getProductCardId(event);
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

        const updateProductQuantityRes = await updateProductQuantityReq.json();

        await updateCartPrice(productId);
      } catch (error) {
        console.error(error.message);
      }
    };

    const removeProductFromCart = async (event) => {
      const parentProductCardId = getProductCardId(event);
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

        const removeProductRes = await removeProductReq.json();
        await updateCartPrice();
        parentProductCard.remove();
      } catch (error) {
        console.error(error);
      }
    };

    document
      .querySelectorAll(DOMStrings.cartProductCardBtnRefresh)
      .forEach((el) => el.addEventListener('click', (e) => updateProductQuantity(e)));
    document
      .querySelectorAll(DOMStrings.cartProductCardBtnRemove)
      .forEach((el) => el.addEventListener('click', (e) => removeProductFromCart(e)));
  };

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener('shopify:section:load', () => {
    init();
  });

  init();
})();
