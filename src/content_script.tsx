import { RatesPair } from './models/crypto';
import { ChromeExtension } from './services/chrome-extension';
import { Meli } from './services/meli';

const meli = new Meli();
const chromeExtension = new ChromeExtension();

async function retrieveRatesAndChangePage(rateCode: RatesPair) {
  console.log('🚀 => retrieveRatesAndChangePage => rateCode', rateCode);
  const priceInARS = await meli.getRatesAndCurrency(rateCode);
  const pricingElements = meli.getPricingElements();
  const codeRate = meli.splitRateCode(rateCode);
  const decimals = meli.getCurrencyDecimal(rateCode);
  meli.changePricePage(pricingElements, priceInARS, codeRate, decimals);
}

(async function firstLoadOnPage() {
  let storage = await chromeExtension.getStorage('favourite-rate');
  console.log('🚀 => firstLoadOnPage => storage', storage);

  if (!storage.length) {
    console.log('pasooo');
    await chromeExtension.setStorage('favourite-rate', RatesPair.USDT_ARS);
    storage = await chromeExtension.getStorage('favourite-rate');
  }

  const ratePair: RatesPair = String(storage['favourite-rate']) as RatesPair;

  await retrieveRatesAndChangePage(ratePair);
})();

// Listen on rates change
chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (!msg.rate) {
    sendResponse(`didn't select a rate or error`);
  }
  await retrieveRatesAndChangePage(msg.rate);
});
