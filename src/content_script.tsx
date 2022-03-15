

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  console.log('🚀 => msg', msg);
  console.log('🚀 => sender', sender);
  console.log('🚀 => sendResponse', sendResponse);
  //   const foo = await retrieveRates();
  // console.log('🚀 => foo', foo);

  if (msg.color) {
    console.log('Receive color = ' + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse('Change color to ' + msg.color);
  } else {
    sendResponse('Color message is none.');
  }
});

function changePriceOnMeli() {
  // const priceToPay =
  //   JSON.parse(document.querySelector('[type="application/ld+json"]')?.text)
  //     .offers?.price || 0;
  // // Discount
  // const originalPrice =
  //   +document
  //     .querySelector('.andes-money-amount--previous .andes-visually-hidden')
  //     ?.textContent?.match(/(\d+)\s+pesos/)?.[1] || 0;
}

function retrieveCurrency(rates: Array<any>, pairCode: any) {
  return rates.filter((rate) => rate.pairCode === pairCode)[0];
}

function getElementByClassName(elementName: string) {
  return document.getElementsByClassName(elementName);
}

function getElementByQuerySelector(elementName: any) {
  return document.querySelectorAll(elementName);
}

function removeElement(elementName: any) {
  const element = getElementByQuerySelector(elementName);
  for (let i = 0; i < element.length; i++) {
    element[i].parentNode.removeChild(element[i]);
  }
}

function changeElement(
  originPrice: any,
  elements: string | any[],
  ask: any,
  code: any
) {
  chrome.storage.sync.get('decimals', ({ decimals }) => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.color = 'green';
      elements[i].innerHTML = convertPrice(originPrice, ask, code, decimals);
    }
  });
}

function convertPrice(
  originCoin: number,
  newCoin: number,
  coin: any,
  decimals: number | undefined
) {
  return `${(originCoin / newCoin).toFixed(decimals)} ${coin}`;
}

function removeSymbolAndCents() {
  // Pesos symbol
  removeElement('.andes-money-amount__currency-symbol');
  // Small cents
  removeElement('.andes-money-amount__cents');
}
