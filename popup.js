let pairCode = document.getElementById('pairCode');

function getDecimals(pairCode) {
  switch (pairCode) {
    case 'USDT/ARS':
      return 2;
    case 'BTC/ARS':
      return 5;
    case 'ETH/ARS':
      return 4;
    default:
      return 2;
  }
}

pairCode.addEventListener('change', async (event) => {
  let pairCode = event.target.value;
  chrome.storage.sync.set({ pairCode });
  let code = pairCode.split('/')[0];
  chrome.storage.sync.set({ code });
  let decimals = getDecimals(pairCode);
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

  function getElement(elementName) {
    return document.getElementsByClassName(elementName);
  }

  function removeElement(elementName) {
    const element = getElement(elementName);
    for (let i = 0; i < element.length; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
  }

  function changeElement(elements, ask, code) {
    chrome.storage.sync.get('decimals', ({ decimals }) => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = 'green';
        elements[i].innerHTML =
          (elements[i].innerHTML.replace('.', '') / ask).toFixed(decimals) +
          ` ${code}`;
      }
    });
  }

  // Main function
  const rates = await retrieveRates();
  chrome.storage.sync.get('pairCode', ({ pairCode }) => {
    const { ask } = retrieveCurrency(rates, pairCode);
    removeElement('andes-money-amount__currency-symbol');
    chrome.storage.sync.get('code', ({ code }) => {
      changeElement(getElement('andes-money-amount__fraction'), ask, code);
      removeElement(
        'andes-money-amount__cents andes-money-amount__cents--superscript-18'
      );
    });
  });
}
