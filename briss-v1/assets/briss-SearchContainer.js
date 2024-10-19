class SearchContainer extends HTMLElement {
  constructor() {
    super();

    this.domElements = {
      searchResultsContainer: document.querySelector('.search_results__container'),
      loader: document.getElementById('loader'),
      searchResultsCount: document.getElementById('search-results-count'),
      searchResultsTerm: document.getElementById('search-results-term'),
      searchInput: document.getElementById('search_input'),
    };

    this.searchResultCardHtml = (id, imgUrl, title, price, url) => {
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

    this.searchTimer;
  }

  updateResultsCount(count, searchTerm) {
    this.domElements.searchResultsCount.textContent = count;
    this.domElements.searchResultsTerm.textContent = searchTerm;
  }

  clearSearchResults(loading = false) {
    if (this.domElements.searchResultsContainer.firstChild) {
      while (this.domElements.searchResultsContainer.firstChild) {
        this.domElements.searchResultsContainer.removeChild(this.domElements.searchResultsContainer.lastChild);
      }
    }
    if (loading) {
      this.domElements.searchResultsContainer.insertAdjacentHTML(
        'beforeend',
        '<span id="loader" class="loader"></span>'
      );
    }
  }

  async searchRequest(query, productsObj) {
    try {
      const searchReq = await fetch(
        `${window.Shopify.routes.root}search/suggest.json?q=${query}&resources[type]=product&resources[options][fields]=title,product_type,variants.title`
      );
      const searchRes = await searchReq.json();
      const productsArr = searchRes.resources.results.products;

      this.clearSearchResults();

      this.updateResultsCount(productsArr.length, query);

      // console.log(productsObj)

      productsArr.forEach((el) => {
        const product = productsObj[el.id];
        this.domElements.searchResultsContainer.insertAdjacentHTML(
          'beforeend',
          this.searchResultCardHtml(product.id, product.imgUrl, product.title, product.price, product.url)
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  async searchHandler(query, productsObj) {
    clearTimeout(this.searchTimer);

    if (!query) {
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.clearSearchResults(true);
      this.searchRequest(query, productsObj);
    }, 1000);
  }

  async getAllProducts() {
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

      this.domElements.searchInput.addEventListener('input', (event) => {
        this.searchHandler(event.target.value, allProducts);
      });
    } catch (error) {
      console.error(error);
    }
  }

  connectedCallback() {
    // this.setAttribute('class', 'search');
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

    this.getAllProducts();
  }
}

customElements.define('search-container', SearchContainer);
