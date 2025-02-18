class ProductContainer extends HTMLElement {
  constructor() {
    console.log('construct product container');
    super();

    this.domElements = {
      addToCart: document.getElementById('add-to-cart'),
      subtotal: document.getElementById('subtotal'),
      quantity: document.getElementById('quantity'),
      quantityAvaliable: document.getElementById('quantity-avaliable'),
      quantityIncrease: document.getElementById('quantity-increase'),
      quantityDecrease: document.getElementById('quantity-decrease'),
      priceContainer: document.getElementById('price-container'),
      productId: document.getElementById('product-id'),
      productOption: document.getElementById('product-option'),
    };

    console.log(this.domElements);
    console.log(this.dataset);
    this.productVariantQuantity = JSON.parse(this.dataset.variantQuantity);
    console.log(this.productVariantQuantity);
    this.productData = JSON.parse(this.dataset.product);
    console.log(this.productData);
  }

  test() {
    console.log('testststststststs');
  }

  updateSubtotal(quantity) {
    const variantPrice = this.domElements.addToCart.dataset.price;

    const subtotal = variantPrice * quantity;

    // convert to pounds pence
    let penceToPounds = subtotal / 100;
    penceToPounds = penceToPounds.toString();

    if (penceToPounds.indexOf('.') === penceToPounds.length - 2) {
      penceToPounds = `${penceToPounds}0`;
    }
    if (!penceToPounds.includes('.')) {
      penceToPounds = `${penceToPounds}.00`;
    }

    this.domElements.subtotal.textContent = `£${penceToPounds}`;
  }

  increaseQuantity(event) {
    event.preventDefault();
    console.log(this.domElements);

    if (parseInt(this.domElements.quantity.value) >= parseInt(this.domElements.quantity.max)) {
      return;
    }
    this.domElements.quantity.value = +this.domElements.quantity.value + 1;
    this.updateSubtotal(this.domElements.quantity.value);
  }

  // increaseQuantity()

  decreaseQuantity(event) {
    event.preventDefault();
    console.log('dec');
    console.log(this.domElements);

    if (this.domElements.quantity.value === this.domElements.quantity.min) {
      return;
    }
    this.domElements.quantity.value = +this.domElements.quantity.value - 1;
    this.updateSubtotal(this.domElements.quantity.value);
  }

  setVariantUnavailable() {
    document.querySelectorAll('.radio-container').forEach((el) => {
      el.classList.remove('disabled');
    });

    const selectedRadio = document.querySelectorAll('.product-option input[type="radio"]:checked');
    console.log('this', selectedRadio);
    const unavailableVariants = [];
    console.log(selectedRadio[0].value);
    console.log(this.productData.variants);
    console.log('una', unavailableVariants);

    this.productData.options.forEach((option) => {
      console.log(option);
    });

    this.productData.variants.forEach((el) => {
      if (el.option1 === selectedRadio[0].value && el.available === false) {
        unavailableVariants.push(el);
      }
    });

    unavailableVariants.forEach((el) => {
      document.getElementById(`radio-container-${el.option2}`).classList.add('disabled');
    });
  }

  async updateVariantPrice(matchedVariantId) {
    const url = new URLParse(window.location.href, true);
    url.query.variant = matchedVariantId;
    const newUrl = url.toString();
    window.history.replaceState(null, null, newUrl);

    try {
      const htmlReq = await fetch(newUrl);
      const htmlRes = await htmlReq.text();
      const parser = new DOMParser();
      const html = parser.parseFromString(htmlRes, 'text/html');

      while (
        this.domElements.priceContainer.lastChild &&
        this.domElements.priceContainer.lastChild.id !== 'price-container-heading'
      ) {
        this.domElements.priceContainer.removeChild(this.domElements.priceContainer.lastChild);
      }

      const newPriceContent = html.querySelectorAll('.price');

      newPriceContent.forEach((el) => {
        this.domElements.priceContainer.insertAdjacentElement('beforeend', el);
      });
    } catch (error) {
      console.log(error);
    }
  }

  disableAddToCart(matchedVariantAvaliable) {
    if (matchedVariantAvaliable === false) {
      this.domElements.addToCart.disabled = true;
      this.domElements.addToCart.value = 'unavaliable';
    } else {
      this.domElements.addToCart.disabled = false;
      this.domElements.addToCart.value = 'add to cart';
    }
  }

  setVariantQuantity(matchedVariantId) {
    const variantQuantity = this.productVariantQuantity[this.productVariantQuantity.indexOf(matchedVariantId) + 1];
    this.domElements.quantity.max = variantQuantity;

    if (variantQuantity > 9) {
      this.domElements.quantityAvaliable.textContent = '10+';
    } else {
      this.domElements.quantityAvaliable.textContent = variantQuantity;
    }

    if (variantQuantity > 0) {
      this.domElements.quantity.value = 1;
      this.updateSubtotal(1);
    } else {
      this.domElements.quantity.value = 0;
      this.domElements.subtotal.textContent = '£0.00';
    }
  }

  async onVariantChange() {
    // find selected options
    const selectedOptions = [];

    document
      .querySelectorAll('.product-option input[type="radio"]:checked')
      .forEach((radio) => selectedOptions.push(radio.value));

    // find matched variant
    const matchedVariant = this.productData.variants.find((variant) => {
      let pass = true;

      for (let i = 0; i < selectedOptions.length; i++) {
        if (selectedOptions.indexOf(variant.options[i]) === -1) {
          pass = false;
          break;
        }
      }
      return pass;
    });

    // Change product form variant id for add to cart
    this.domElements.productId.value = matchedVariant.id;

    await this.updateVariantPrice(matchedVariant.id);

    this.setVariantUnavailable();

    this.setVariantQuantity(matchedVariant.id);

    this.disableAddToCart(matchedVariant.available);
  }

  connectedCallback() {
    console.log('this.connectedCallback');
    console.log(this.domElements);
    console.log(this.productData);

    // if (this.productData == null || this.variantQuantitys === null) {
    //   console.log('retunr');
    //   return;
    // }

    console.log('hello');
    document.querySelectorAll('.product-option input[type="radio"]').forEach((radio) =>
      radio.addEventListener('change', async () => {
        this.onVariantChange();
      })
    );

    // EVENT LISTENERS
    this.domElements.quantityIncrease.addEventListener('click', this.increaseQuantity.bind(this));
    this.domElements.quantityDecrease.addEventListener('click', this.decreaseQuantity.bind(this));

    // INIT
    this.setVariantUnavailable();
  }
}

customElements.define('product-container', ProductContainer);
