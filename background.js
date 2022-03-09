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

  function retrieveUSDT(rates = []) {
    return rates.filter((rate) => rate.pairCode === 'USDT/ARS')[0];
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

  function changeElement(elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.color = 'green';
      elements[i].innerHTML =
        (elements[i].innerHTML.replace('.', '') / ask).toFixed(2) + ' USDT';
    }
  }

  // Main function
  const rates = await retrieveRates();
  const { ask } = retrieveUSDT(rates);
  removeElement('andes-money-amount__currency-symbol');
  changeElement(getElement('andes-money-amount__fraction'));
}

// Init Chrome extension
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: renderPage
  });
});
