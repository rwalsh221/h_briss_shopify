// init needed for shopify theme editor as js breaks when changes made
// iffe needed for js files to create scope to prevent variable clash.
(() => {
  const init = () => {
    // Prevents form submiting when enter pressed causing page reload
    window.addEventListener(
      'keydown',
      function (e) {
        if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
          if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            e.preventDefault();

            return false;
          }
        }
      },
      true
    );

    // GLOBAL VARS
    let searchTimer;
    const domStrings = {
      searchResultsContainer: document.querySelector('.search_results__container'),
      loader: document.getElementById('loader'),
      searchResultsCount: document.getElementById('search-results-count'),
      searchResultsTerm: document.getElementById('search-results-term'),
    };

    const searchResultCardHtml = (id, imgUrl, title, price, url) => {
      return `<div id="srcard--#${id}" class="search_results__card">
                    <div class="search_results__card--img">
                        <img class="srcard--img" src="${imgUrl}" width="200" height="200"/>
                    </div>
                    <div class="search_results__card--content">
                        <div class="search_results__card--title"><p class="srcard--title">${title}</p></div>
                        <div class="search_results__card--price">
                            <p class="srcard--price">${price}</p>
                        </div>
                        <div class="search_results__card--more">
                            <a class="srcard--url" href="${url}">More Information</a>
                        </div>
                    </div>
                </div>`;
    };

    const updateResultsCount = (count, searchTerm) => {
      domStrings.searchResultsCount.textContent = count;
      domStrings.searchResultsTerm.textContent = searchTerm;
    };

    const clearSearchResults = (loading = false) => {
      if (domStrings.searchResultsContainer.firstChild) {
        while (domStrings.searchResultsContainer.firstChild) {
          domStrings.searchResultsContainer.removeChild(domStrings.searchResultsContainer.lastChild);
        }
      }
      if (loading) {
        domStrings.searchResultsContainer.insertAdjacentHTML('beforeend', '<span id="loader" class="loader"></span>');
      }
    };

    const searchRequest = async (query, productsObj) => {
      try {
        const searchReq = await fetch(
          `${window.Shopify.routes.root}search/suggest.json?q=${query}&resources[type]=product&resources[options][fields]=title,product_type,variants.title`
        );
        const searchRes = await searchReq.json();
        const productsArr = searchRes.resources.results.products;

        clearSearchResults();

        updateResultsCount(productsArr.length, query);

        // console.log(productsObj)

        productsArr.forEach((el) => {
          const product = productsObj[el.id];
          domStrings.searchResultsContainer.insertAdjacentHTML(
            'beforeend',
            searchResultCardHtml(product.id, product.imgUrl, product.title, product.price, product.url)
          );
        });
      } catch (error) {
        console.error(error);
      }
    };

    const searchHandler = async (query, productsObj) => {
      console.log(query);
      clearTimeout(searchTimer);

      if (!query) {
        console.log('no query');
        return;
      }

      searchTimer = setTimeout(() => {
        clearSearchResults(true);
        searchRequest(query, productsObj);
      }, 1000);
    };

    const getAllProducts = async () => {
      const allProducts = {};

      try {
        const htmlReq = await fetch(`${window.Shopify.routes.root}search?q=*&type=product`);
        const htmlRes = await htmlReq.text();

        const parser = new DOMParser();
        const html = parser.parseFromString(htmlRes, 'text/html');

        const searchResultsCards = html.querySelectorAll('.search_results__card');

        searchResultsCards.forEach((el) => {
          allProducts[el.id.split('#')[1]] = {
            id: el.id.split('#')[1],
            title: el.querySelector('.srcard--title').textContent,
            price: el.querySelector('.srcard--price').textContent,
            imgUrl: el.querySelector('.srcard--img').src,
            url: el.querySelector('.srcard--url').href,
          };
        });

        document.getElementById('search_input').addEventListener('input', (event) => {
          searchHandler(event.target.value, allProducts);
        });
      } catch (error) {
        console.error(error);
      }
    };

    getAllProducts();
  };

  // needed for shopify theme editor as js breaks when changes made
  document.addEventListener('shopify:section:load', () => {
    init();
  });

  init();
})();
