// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {
    const DOMStrings = {
      root: document.documentElement,
      documentBody: document.body,
      navDrawerBtnShow: document.getElementById('nav-bar-btn-show'),
      navDrawerContainerShow: document.getElementById('nav-drawer-container__show'),
      navDrawer: document.getElementById('nav-drawer'),
      navDrawerHide: 'nav-drawer-hide',
      navDrawerShow: 'nav-drawer-show',
    };

    const changeNavDrawerBtnShowContent = (element, html) => {
      while (element.firstChild) {
        element.removeChild(element.lastChild);
      }
      element.insertAdjacentHTML('beforeend', html);
    };

    const showNavDrawer = () => {
      const navDrawerBtnOpenHtml = `<span id="nav-drawer__open" class="nav-bar__btn--open">
            <span></span>
            <span></span>
            <span></span>
          </span>`;

      const navDrawerBtnCloseHtml = `<span id="nav-drawer__close" class="nav-bar__btn--close">
            <span></span>
            <span></span>
          </span>`;

      // SET CSS VARIABLE FOR HEIGHT OF NAV DRAWER
      const navDrawerShowBottom = DOMStrings.navDrawerContainerShow.getBoundingClientRect().bottom;
      DOMStrings.root.style.setProperty('--nav-drawer-offset', `${navDrawerShowBottom}px`);

      // First opening after page load
      if (DOMStrings.navDrawer.classList.length === 1) {
        DOMStrings.navDrawer.classList.add(DOMStrings.navDrawerShow);
        DOMStrings.documentBody.style.overflow = 'hidden';
        changeNavDrawerBtnShowContent(DOMStrings.navDrawerBtnShow, navDrawerBtnCloseHtml);
        return;
      }

      // All other openings
      if (DOMStrings.navDrawer.classList.contains(DOMStrings.navDrawerHide)) {
        DOMStrings.navDrawer.classList.remove(DOMStrings.navDrawerHide);
        DOMStrings.navDrawer.classList.add(DOMStrings.navDrawerShow);
        changeNavDrawerBtnShowContent(DOMStrings.navDrawerBtnShow, navDrawerBtnCloseHtml);
        DOMStrings.documentBody.style.overflow = 'hidden';
      } else {
        DOMStrings.navDrawer.classList.add(DOMStrings.navDrawerHide);
        DOMStrings.navDrawer.classList.remove(DOMStrings.navDrawerShow);
        changeNavDrawerBtnShowContent(DOMStrings.navDrawerBtnShow, navDrawerBtnOpenHtml);
        DOMStrings.documentBody.style.overflow = 'scroll';
      }
    };

    DOMStrings.navDrawerBtnShow.addEventListener('click', showNavDrawer);
  };

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener('shopify:section:load', () => {
    init();
  });

  init();
})();
