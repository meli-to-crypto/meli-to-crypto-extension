import { RatesPair } from './models/crypto';
import { Currency } from './services/currency';
import { Meli } from './services/meli';

const meli = new Meli();
const currency = new Currency();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (msg.rate) {
    const rateCode: RatesPair = msg.rate;

    const priceInARS = meli.retrieveRatesAndCurrency(rateCode);

    const priceToPay = meli.retrievePriceToPay();
    const priceToPayElements = meli.changeDOMPricePayElement();
    // const priceDiscount = meli.retrieveDiscount();
    const codeRate = rateCode.split('/')[0];
    const decimals = currency.retrieveCurrencyDecimals(rateCode);

    meli.removeSymbolAndCents();

    changeElement(
      priceToPay,
      priceToPayElements,
      priceInARS,
      codeRate,
      decimals
    );
  } else {
    sendResponse('didn`t select a rate or error');
  }
});

function changeElement(
  priceToPay: any,
  priceToPayElements: any,
  priceInARS: any,
  rateCode: any,
  decimals: any
) {
  for (let i = 0; i < priceToPayElements.length; i++) {
    priceToPayElements[i].style.color = 'green';
    priceToPayElements[i].innerHTML = currency.convertPrice(
      priceToPay,
      priceInARS,
      rateCode,
      decimals
    );
  }
}
