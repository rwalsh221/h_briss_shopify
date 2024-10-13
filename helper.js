// const product = {{ product | json }}

// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {};

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener("shopify:section:load", () => {
    init();
  });

  init();
})();

document
  .querySelectorAll('.product-option input[type="radio"]')
  .forEach((radio) =>
    radio.addEventListener("change", () => {
      const selectedOptions = [];

      document
        .querySelectorAll('.product-option input[type="radio"]:checked')
        .forEach((radio) => selectedOptions.push(radio.value));

      const matchedVariant = product.variants.find((variant) => {
        let pass = true;

        for (let i = 0; i < selectedOptions.length; i++) {
          if (selectedOptions.indexOf(variant.options[i]) === -1) {
            pass = false;
            break;
          }
        }
      });

      return pass;
    })
  );

const product = [];

const setVariantUnavaliable = () => {
  const selectedRadio = document.querySelectorAll(
    '.product-option input[type="radio"]:checked'
  );

  console.log(selectedRadio);

  const unavailableVariants = [];

  product.variants.forEach((el) => {
    if (el.option1 === selectedRadio[0].value && el.avaliable === false) {
      unavailableVariants.push(el);
    }
  });

  un.forEach((el) => {
    document.querySelector(`radio-container-${el.option2}`).classList.add =
      "disabled";
  });

  console.log(unavailableVariants);
};

const selectedOptions = [];

const disableAddToCart = () => {
  if (selectedOptions[1].classList.contains("disabled")) {
    document.querySelector("#add-to-cart").disabled = true;
  } else {
    document.querySelector("#add-to-cart").disabled = false;
  }
};

const increaseQuantity = () => {
  const quantityInput = document.getElementById("quantity");

  quantityInput.value = "hello";
};

// if (quantityInput.value === '0') {
//   return;
// }

const variantQuantity =
  variantQuantityArray[variantQuantityArray.indexOf(matchedVariant.id) + 1];

const updateSubtotal = (quantity) => {
  const variantPrice = document.getElementById("add-to-cart").dataset.price;

  const subtotal = variantPrice * quantity;

  // convert to pounds pence
  let penceToPounds = subtotal / 100;
  penceToPounds = penceToPounds.toString();

  if (penceToPounds.indexOf(".") === penceToPounds.length - 2) {
    penceToPounds = `${penceToPounds}0`;
  }
  if (!penceToPounds.includes(".")) {
    penceToPounds = `${penceToPounds}.00`;
  }

  document.getElementById("subtotal").textContent = `£${penceToPounds}`;
};

const showCustomerNavigationModal = (event, elementId) => {
  event.target.style.display = "block";
};

const closeCustomerNavigationModal = (event, elementId) => {
  if (event.target.id !== element.id) {
    element.querySelector(".customer-navigation__content").style.display =
      "none";
  }
};

const removePopUp = () => {
  document.addEventListener("click", () => {
    document.querySelector(".customer-navigation__content").style.display =
      "none";

    document.removeEventListener("click", () => {
      document.querySelector(".customer-navigation__content").style.display =
        "none";
    });
  });
};

//
//
//
//
//
//
//

const updateVariantPrice = async (matchedVariantId) => {
  // change url
  const url = new URLParse(window.location.href, true);
  url.query.variant = matchedVariantId;
  const newUrl = url.toString();
  window.history.replaceState(null, null, newUrl);

  // UPDATE VARIANT PRICE {% endcomment %}
  try {
    const htmlReq = await fetch(newUrl);
    const htmlRes = await htmlReq.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(htmlRes, "text/html");
    const priceContainer = document.getElementById("price-container");

    while (
      priceContainer.lastChild &&
      priceContainer.lastChild.id !== "price-container-heading"
    ) {
      priceContainer.removeChild(priceContainer.lastChild);
    }

    const newPriceContent = html.querySelectorAll(".price");

    newPriceContent.forEach((el) => {
      priceContainer.insertAdjacentElement("beforeend", el);
    });
  } catch (error) {
    console.log(error);
  }
};

const disableAddToCart = (matchedVariantAvaliable) => {
  if (matchedVariant.available === false) {
    document.querySelector("#add-to-cart").disabled = true;
    document.querySelector("#add-to-cart").value = "unavaliable";
  } else {
    document.querySelector("#add-to-cart").disabled = false;
    document.querySelector("#add-to-cart").value = "add to cart";
  }
};

const setVariantQuantity = () => {
  const variantQuantity =
    variantQuantitys[variantQuantitys.indexOf(matchedVariant.id) + 1];
  document.getElementById("quantity").max = variantQuantity;

  if (variantQuantity > 9) {
    document.getElementById("quantity-avaliable").textContent = "10+";
  } else {
    document.getElementById("quantity-avaliable").textContent = variantQuantity;
  }

  if (variantQuantity > 0) {
    document.getElementById("quantity").value = 1;
    updateSubtotal(1);
  } else {
    document.getElementById("quantity").value = 0;
    document.getElementById("subtotal").textContent = "£0.00";
  }
};

const onVariantChange = async () => {
  // find selected options
  const selectedOptions = [];

  document
    .querySelectorAll('.product-option input[type="radio"]:checked')
    .forEach((radio) => selectedOptions.push(radio.value));

  // find matched variant
  const matchedVariant = product.variants.find((variant) => {
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
  document.querySelector("#product-id").value = matchedVariant.id;

  await updateVariantPrice(matchedVariant.id);

  setVariantUnavailable();

  setVariantQuantity();

  disableAddToCart(matchedVariant.available);
};

document
  .querySelectorAll('.product-option input[type="radio"]')
  .forEach((radio) =>
    radio.addEventListener("change", async () => {
      onVariantChange();
    })
  );
