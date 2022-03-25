import { RatesPair } from './models/crypto';
import { ChromeExtension } from './services/chrome-extension';
import { Meli } from './services/meli';

const meli = new Meli();
const chromeExtension = new ChromeExtension();

async function retrieveRatesAndChangePage(rateCode: RatesPair) {
  const priceInARS = await meli.getRatesAndCurrency(rateCode);
  const pricingElements = meli.getPricingElements();
  const codeRate = meli.splitRateCode(rateCode);
  const decimals = meli.getCurrencyDecimal(rateCode);
  meli.changePricePage(pricingElements, priceInARS, codeRate, decimals);
}

(async function firstLoadOnPage() {
  const storage = await changeFavouriteRate();
  const ratePair: RatesPair = String(storage['favourite-rate']) as RatesPair;
  await retrieveRatesAndChangePage(ratePair);
})();

async function changeFavouriteRate(ratePair: RatesPair = RatesPair.USDT_ARS) {
  let storage = await chromeExtension.getStorage('favourite-rate');
  if (!storage || !storage.hasOwnProperty('favourite-rate')) {
    await chromeExtension.setStorage('favourite-rate', ratePair);
    storage = await chromeExtension.getStorage('favourite-rate');
  }
  return storage;
}

export async function setFavouriteRate(
  ratePair: RatesPair = RatesPair.USDT_ARS
) {
  await chromeExtension.setStorage('favourite-rate', ratePair);
}

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
