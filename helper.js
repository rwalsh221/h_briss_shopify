// const product = {{ product | json }}

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
