import { Currency } from './services/currency';
import { JSDOM } from './services/jsdom';
import { Meli } from './services/meli';

const jsdom = new JSDOM();
const meli = new Meli();
const currency = new Currency();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (msg.rate) {
    const rateCode = msg.rate;
    // Change DOM for Price to pay element
    const priceToPayElements = jsdom.getElementByQuerySelectorAll(
      ':not(.andes-money-amount--previous) > .andes-money-amount__fraction'
    );

    const rates = await currency.retrieveRates();
    const { ask } = currency.retrieveCurrency(rates, rateCode);
    const priceToPay = meli.retrievePriceToPay();
    // const priceDiscount = meli.retrieveDiscount();
    const codeRate = rateCode.split('/')[0];
    const decimals = currency.retrieveCurrencyDecimals(rateCode);
    console.log('🚀 => decimals', decimals);

    jsdom.removeSymbolAndCents();

    changeElement(priceToPay, priceToPayElements, ask, codeRate, decimals);
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
    elements[i].innerHTML = currency.convertPrice(
      originPrice,
      ask,
      code,
      decimals
    );
  }
}
