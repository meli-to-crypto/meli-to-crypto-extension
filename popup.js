let pairCode = document.getElementById('pairCode');

const DECIMALS = {
  'USDT/ARS': 2,
  'ETH/ARS': 4,
  'BTC/ARS': 5
}

pairCode.addEventListener('change', async (event) => {
  let pairCode = event.target.value ?? 2;
  chrome.storage.sync.set({ pairCode });
  let code = pairCode.split('/')[0];
  chrome.storage.sync.set({ code });
  let decimals = DECIMALS[pairCode]
  chrome.storage.sync.set({ decimals });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: renderPage
  });
});

async function renderPage() {
  async function retrieveRates() {
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    };
    return await fetchURL('https://api.belo.app/public/price', options);
  }

  async function fetchURL(url = '', options = {}) {
    const response = await fetch(url, options);
    return response.json();
  }

  function retrieveCurrency(rates = [], pairCode) {
    return rates.filter((rate) => rate.pairCode === pairCode)[0];
  }

  function getElementByClassName(elementName) {
    return document.getElementsByClassName(elementName);
  }

  function getElementByQuerySelector(elementName) {
    return document.querySelectorAll(elementName);
  }

  function removeElement(elementName) {
    const element = getElementByQuerySelector(elementName);
    for (let i = 0; i < element.length; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
  }

  function changeElement(originPrice, elements, ask, code) {
    chrome.storage.sync.get('decimals', ({ decimals }) => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = 'green';
        elements[i].innerHTML = convertPrice(originPrice, ask, code, decimals);
      }
    });
  }

  function convertPrice(originCoin, newCoin, coin, decimals) {
    return `${(originCoin / newCoin).toFixed(decimals)} ${coin}`;
  }

  function removeSymbolAndCents() {
    // Pesos symbol
    removeElement('.andes-money-amount__currency-symbol');
    // Small cents
    removeElement('.andes-money-amount__cents');
  }

  // Main function
  const rates = await retrieveRates();
  const priceToPay =
    JSON.parse(document.querySelector('[type="application/ld+json"]')?.text)
      .offers?.price || 0;

  // Discount
  const originalPrice =
    +document
      .querySelector('.andes-money-amount--previous .andes-visually-hidden')
      ?.textContent?.match(/(\d+)\s+pesos/)?.[1] || 0;

  chrome.storage.sync.get('pairCode', ({ pairCode }) => {
    const { ask } = retrieveCurrency(rates, pairCode);

    removeSymbolAndCents();

    chrome.storage.sync.get('code', ({ code }) => {
      // Change DOM for Price to pay element
      const priceToPayElements = getElementByQuerySelector(
        ':not(.andes-money-amount--previous) > .andes-money-amount__fraction'
      );
      changeElement(priceToPay, priceToPayElements, ask, code);

      // Change DOM for Discount Element
      if (originalPrice !== 0)
        changeElement(
          originalPrice,
          getElementByQuerySelector(
            '.andes-money-amount--previous .andes-money-amount__fraction'
          ),
          ask,
          code
        );
    });
  });
}
