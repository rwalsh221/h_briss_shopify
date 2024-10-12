// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {
    const DOMStrings = {
      cnLinkContainer: document.getElementById('cn__link-container'),
      cnBtnContainerBack: document.getElementById('collection-nav__btn-container__back'),
      cnBtnContainerFwd: document.getElementById('collection-nav__btn-container__fwd'),
      cnBtnBack: document.getElementById('cn-btn__back'),
      cnBtnFwd: document.getElementById('cn-btn__fwd'),
      cssShadowLeft: 'collection-nav__btn-shadow--l',
      cssShadowRight: 'collection-nav__btn-shadow--r',
    };
    console.log(DOMStrings);

    if (DOMStrings.cnLinkContainer.offsetWidth < DOMStrings.cnLinkContainer.scrollWidth) {
      DOMStrings.cnBtnContainerFwd.classList.add(DOMStrings.cssShadowLeft);
      DOMStrings.cnBtnBack.style.display = 'flex';
      DOMStrings.cnBtnFwd.style.display = 'flex';
    }

    const scrollCollectionNavBack = () => {
      // GET MAX SCROLL
      const collectionNavMaxScroll = DOMStrings.cnLinkContainer.scrollWidth - DOMStrings.cnLinkContainer.offsetWidth;

      DOMStrings.cnLinkContainer.scrollLeft -= 20;
      const currScrollPos = DOMStrings.cnLinkContainer.scrollLeft;

      if (currScrollPos === 0) {
        DOMStrings.cnBtnContainerBack.classList.remove(DOMStrings.cssShadowRight);
        return;
      }

      if (currScrollPos === collectionNavMaxScroll - 20) {
        DOMStrings.cnBtnContainerFwd.classList.add(DOMStrings.cssShadowLeft);
      }
    };

    const scrollCollectionNavFwd = () => {
      // GET MAX SCROLL
      const collectionNavMaxScroll = DOMStrings.cnLinkContainer.scrollWidth - DOMStrings.cnLinkContainer.offsetWidth;
      DOMStrings.cnLinkContainer.scrollLeft += 20;
      const currScrollPos = DOMStrings.cnLinkContainer.scrollLeft;

      if (currScrollPos === 20) {
        DOMStrings.cnBtnContainerBack.classList.add(DOMStrings.cssShadowRight);
        return;
      }

      if (currScrollPos === collectionNavMaxScroll) {
        DOMStrings.cnBtnContainerFwd.classList.remove(DOMStrings.cssShadowLeft);
      }
    };

    DOMStrings.cnBtnFwd.addEventListener('click', scrollCollectionNavFwd);
    DOMStrings.cnBtnBack.addEventListener('click', scrollCollectionNavBack);
  };

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener('shopify:section:load', () => {
    init();
  });

  init();
})();
