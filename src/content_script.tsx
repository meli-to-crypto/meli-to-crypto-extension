import { JSDOM } from './jsdom';
import { Meli } from './meli';
import { Rates } from './rates';

const jsdom = new JSDOM();
const meli = new Meli();
const rates = new Rates();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  console.log('🚀 => msg', msg);
  console.log('🚀 => sender', sender);

  if (msg.rate) {
    // Change DOM for Price to pay element
    const priceToPayElements = jsdom.getElementByQuerySelectorAll(
      ':not(.andes-money-amount--previous) > .andes-money-amount__fraction'
    );

    const rate = await rates.retrieveRates();
    const { ask } = rates.retrieveCurrency(rate, msg.rate);

    const priceToPay = meli.retrievePriceToPay();
    // const priceDiscount = meli.retrieveDiscount();
    jsdom.removeSymbolAndCents();

    changeElement(priceToPay, priceToPayElements, ask, 'USDT', '.11');
  } else {
    sendResponse('error');
  }
});

function changeElement(
  originPrice: any,
  elements: any,
  ask: any,
  code: any,
  decimals: any
) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.color = 'green';
    elements[i].innerHTML = rates.convertPrice(
      originPrice,
      ask,
      code,
      decimals
    );
  }
}
