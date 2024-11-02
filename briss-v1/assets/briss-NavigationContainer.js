class NavigationContainer extends HTMLElement {
  constructor() {
    super();

    this.domElements = {
      root: document.documentElement,
      documentBody: document.body,
      navDrawerBtnShow: document.getElementById('nav-bar-btn-show'),
      navDrawerContainerShow: document.getElementById('nav-drawer-container__show'),
      navDrawer: document.getElementById('nav-drawer'),
      navDrawerHide: 'nav-drawer-hide',
      navDrawerShow: 'nav-drawer-show',
    };

    this.htmlTemplates = {
      navDrawerBtnOpenHtml: `<span id="nav-drawer__open" class="nav-bar__btn--open">
            <span></span>
            <span></span>
            <span></span>
          </span>`,
      navDrawerBtnCloseHtml: `<span id="nav-drawer__close" class="nav-bar__btn--close">
            <span></span>
            <span></span>
          </span>`,
    };
  }

  changeNavDrawerBtnShowContent(element, html) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
    element.insertAdjacentHTML('beforeend', html);
  }

  showNavDrawer() {
    // SET CSS VARIABLE FOR HEIGHT OF NAV DRAWER
    console.log(this);
    console.log(this.domElements.navDrawerContainerShow);
    const navDrawerShowBottom = this.domElements.navDrawerContainerShow.getBoundingClientRect().bottom;
    this.domElements.root.style.setProperty('--nav-drawer-offset', `${navDrawerShowBottom}px`);

    // First opening after page load
    if (this.domElements.navDrawer.classList.length === 1) {
      this.domElements.navDrawer.classList.add(this.domElements.navDrawerShow);
      this.domElements.documentBody.style.overflow = 'hidden';
      this.changeNavDrawerBtnShowContent(this.domElements.navDrawerBtnShow, navDrawerBtnCloseHtml);
      return;
    }

    // All other openings
    if (this.domElements.navDrawer.classList.contains(this.domElements.navDrawerHide)) {
      this.domElements.navDrawer.classList.remove(this.domElements.navDrawerHide);
      this.domElements.navDrawer.classList.add(this.domElements.navDrawerShow);
      this.changeNavDrawerBtnShowContent(this.domElements.navDrawerBtnShow, this.htmlTemplates.navDrawerBtnCloseHtml);
      this.domElements.documentBody.style.overflow = 'hidden';
    } else {
      this.domElements.navDrawer.classList.add(this.domElements.navDrawerHide);
      this.domElements.navDrawer.classList.remove(this.domElements.navDrawerShow);
      this.changeNavDrawerBtnShowContent(this.domElements.navDrawerBtnShow, this.htmlTemplates.navDrawerBtnOpenHtml);
      this.domElements.documentBody.style.overflow = 'scroll';
    }
  }

  connectedCallback() {
    console.log(this.domElements.navDrawerContainerShow.getBoundingClientRect().bottom);
    this.domElements.navDrawerBtnShow.addEventListener('click', this.showNavDrawer.bind(this));
  }
}

customElements.define('navigation-container', NavigationContainer);
