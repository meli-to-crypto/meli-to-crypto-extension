import { RatesPair } from './models/crypto';
import { Meli } from './services/meli';

const meli = new Meli();

async function retrieveRatesAndChangePage(rateCode: RatesPair) {
  const priceInARS = await meli.getRatesAndCurrency(rateCode);
  const pricingElements = meli.getPricingElements();
  const codeRate = meli.splitRateCode(rateCode);
  const decimals = meli.getCurrencyDecimal(rateCode);
  meli.changePricePage(pricingElements, priceInARS, codeRate, decimals);
}

(async function firstLoadOnPage() {
  const rateCode: RatesPair = RatesPair.USDT_ARS;
  await retrieveRatesAndChangePage(rateCode);
})();

// Listen on rates change
chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (!msg.rate) {
    sendResponse('didn`t select a rate or error');
  }
  await retrieveRatesAndChangePage(msg.rate);
});
