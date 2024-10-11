document.querySelectorAll('.show-form-btn').forEach((el) => {
  el.addEventListener('click', (event) => {
    const btnTextContent = event.target.dataset.btnlabel;
    console.log(btnTextContent);
    const formElement = document.getElementById(event.target.dataset.formbtn);
    console.log(event.target.dataset);
    console.log(formElement.style);

    if (formElement.style.display === 'block') {
      formElement.style.display = 'none';
      event.target.textContent = btnTextContent;
    } else {
      formElement.style.display = 'block';
      event.target.textContent = 'cancel';
    }
    // formElement.style.display='none'
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
