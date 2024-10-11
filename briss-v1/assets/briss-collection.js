// needed for shopify theme editor as js breaks when changes made
const init = () => {
  const domStrings = {
    cnLinkContainer: document.getElementById('cn__link-container'),
    cnBtnContainerBack: document.getElementById('collection-nav__btn-container__back'),
    cnBtnContainerFwd: document.getElementById('collection-nav__btn-container__fwd'),
    cnBtnBack: document.getElementById('cn-btn__back'),
    cnBtnFwd: document.getElementById('cn-btn__fwd'),
    cssShadowLeft: 'collection-nav__btn-shadow--l',
    cssShadowRight: 'collection-nav__btn-shadow--r',
  };

  if (domStrings.cnLinkContainer.offsetWidth < domStrings.cnLinkContainer.scrollWidth) {
    domStrings.cnBtnContainerFwd.classList.add(domStrings.cssShadowLeft);
    domStrings.cnBtnBack.style.display = 'flex';
    domStrings.cnBtnFwd.style.display = 'flex';
  }

  const scrollCollectionNavBack = () => {
    // GET MAX SCROLL
    const collectionNavMaxScroll = domStrings.cnLinkContainer.scrollWidth - domStrings.cnLinkContainer.offsetWidth;

    domStrings.cnLinkContainer.scrollLeft -= 20;
    const currScrollPos = domStrings.cnLinkContainer.scrollLeft;

    if (currScrollPos === 0) {
      domStrings.cnBtnContainerBack.classList.remove(domStrings.cssShadowRight);
      return;
    }

    if (currScrollPos === collectionNavMaxScroll - 20) {
      domStrings.cnBtnContainerFwd.classList.add(domStrings.cssShadowLeft);
    }
  };

  const scrollCollectionNavFwd = () => {
    // GET MAX SCROLL
    const collectionNavMaxScroll = domStrings.cnLinkContainer.scrollWidth - domStrings.cnLinkContainer.offsetWidth;
    domStrings.cnLinkContainer.scrollLeft += 20;
    const currScrollPos = domStrings.cnLinkContainer.scrollLeft;

    if (currScrollPos === 20) {
      domStrings.cnBtnContainerBack.classList.add(domStrings.cssShadowRight);
      return;
    }

    if (currScrollPos === collectionNavMaxScroll) {
      domStrings.cnBtnContainerFwd.classList.remove(domStrings.cssShadowLeft);
    }
  };

  domStrings.cnBtnFwd.addEventListener('click', scrollCollectionNavFwd);
  domStrings.cnBtnBack.addEventListener('click', scrollCollectionNavBack);
};

init();
// needed for shopify theme editor as js breaks when changes made
document.addEventListener('shopify:section:load', () => {
  init();
});
