// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {};

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener('shopify:section:load', () => {
    init();
  });

  init();
})();

// USES LIQUID JSON
