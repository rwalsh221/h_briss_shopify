class CollectionNavigation extends HTMLElement {
  constructor() {
    super();

    this.hasAllRequiredChildNodes = true;

    this.domElements = {
      cnLinkContainer: this.querySelector('#cn__link-container'),
      cnBtnContainerBack: this.querySelector('#collection-nav__btn-container__back'),
      cnBtnContainerFwd: this.querySelector('#collection-nav__btn-container__fwd'),
      cnBtnBack: this.querySelector('#cn-btn__back'),
      cnBtnFwd: this.querySelector('#cn-btn__fwd'),
    };

    this.cssClass = {
      cssCollectionNav: 'collection-nav',
      cssShadowLeft: 'collection-nav__btn-shadow--l',
      cssShadowRight: 'collection-nav__btn-shadow--r',
    };
  }

  checkAllRequiredChildNodes() {
    Object.keys(this.domElements).forEach((el) => {
      if (this.domElements[el] === null) {
        this.hasAllRequiredChildNodes = false;
      }
    });
  }

  init() {
    if (this.domElements.cnLinkContainer.offsetWidth < this.domElements.cnLinkContainer.scrollWidth) {
      this.domElements.cnBtnContainerFwd.classList.add(this.cssClass.cssShadowLeft);
      this.domElements.cnBtnBack.style.display = 'flex';
      this.domElements.cnBtnFwd.style.display = 'flex';
    }

    const scrollCollectionNavBack = () => {
      // GET MAX SCROLL
      const collectionNavMaxScroll =
        this.domElements.cnLinkContainer.scrollWidth - this.domElements.cnLinkContainer.offsetWidth;

      this.domElements.cnLinkContainer.scrollLeft -= 20;
      const currScrollPos = this.domElements.cnLinkContainer.scrollLeft;

      if (currScrollPos === 0) {
        this.domElements.cnBtnContainerBack.classList.remove(this.cssClass.cssShadowRight);
        return;
      }

      if (currScrollPos === collectionNavMaxScroll - 20) {
        this.domElements.cnBtnContainerFwd.classList.add(this.cssClass.cssShadowLeft);
      }
    };

    const scrollCollectionNavFwd = () => {
      // GET MAX SCROLL
      const collectionNavMaxScroll =
        this.domElements.cnLinkContainer.scrollWidth - this.domElements.cnLinkContainer.offsetWidth;
      this.domElements.cnLinkContainer.scrollLeft += 20;
      const currScrollPos = this.domElements.cnLinkContainer.scrollLeft;

      if (currScrollPos === 20) {
        this.domElements.cnBtnContainerBack.classList.add(this.cssClass.cssShadowRight);
        return;
      }

      if (currScrollPos === collectionNavMaxScroll) {
        this.domElements.cnBtnContainerFwd.classList.remove(this.cssClass.cssShadowLeft);
      }
    };

    this.domElements.cnBtnFwd.addEventListener('click', scrollCollectionNavFwd);
    this.domElements.cnBtnBack.addEventListener('click', scrollCollectionNavBack);
  }

  childNodeMissing() {
    while (this.lastChild) {
      this.removeChild(this.lastChild);
    }

    const messageContainer = document.createElement('div');

    const message = document.createElement('p');

    message.textContent = 'Custom Element Error - Required ChildNode Missing';
    messageContainer.classList.add('custom_element_error');
    messageContainer.appendChild(message);
    this.appendChild(messageContainer);
  }

  connectedCallback() {
    this.setAttribute('class', this.cssClass.cssCollectionNav);

    this.checkAllRequiredChildNodes();

    if (this.hasAllRequiredChildNodes) {
      this.init();
    } else {
      this.childNodeMissing();
    }
  }
}

customElements.define('collection-navigation', CollectionNavigation);
