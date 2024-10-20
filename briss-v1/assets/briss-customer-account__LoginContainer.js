class LoginContainer extends HTMLElement {
  constructor() {
    super();

    this.domElements = {
      loginForm: document.getElementById('login'),
      recoverForm: document.getElementById('recover'),
    };
  }

  displayForm(currentUrl) {
    const formId = currentUrl.split('#')[1];

    switch (formId) {
      case 'login':
        this.domElements.loginForm.style.display = 'block';
        this.domElements.recoverForm.style.display = 'none';
        break;
      case 'recover':
        this.domElements.recoverForm.style.display = 'block';
        this.domElements.loginForm.style.display = 'none';
        break;
      default:
        this.domElements.loginForm.style.display = 'block';
        this.domElements.recoverForm.style.display = 'none';
        break;
    }
  }

  connectedCallback() {
    this.setAttribute('class', 'customer-container');

    this.displayForm(window.location.href);

    window.addEventListener('hashchange', () => {
      this.displayForm(window.location.href);
    });
  }
}

customElements.define('login-container', LoginContainer);
