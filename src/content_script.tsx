import { RatesPair } from './models/crypto';
import { ChromeExtension } from './services/chrome-extension';
import { Meli } from './services/meli';

const meli = new Meli();
const chromeExtension = new ChromeExtension();

async function retrieveRatesAndChangePage(rateCode: RatesPair) {
  if (rateCode === RatesPair.ARS_ARS) {
    meli.revertToOriginal();
    return;
  }
  /**
   * Cotización de la coin VS el peso. Ej. DAI/ARS -returns-> "189.03"
   */
  const priceInARS = await meli.getRatesAndCurrency(rateCode);
  const pricingElements = meli.getPricingElements();
  /**
   * Ej: "DAI"
   */
  const codeRate = meli.splitRateCode(rateCode);
  const decimals = meli.getCurrencyDecimal(rateCode);
  meli.changePricePage(pricingElements, priceInARS, codeRate, decimals);
}

(async function firstLoadOnPage() {
  // const defaultFav = await getFavouriteRate();
  // console.log('Default value:', defaultFav);
  
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

export async function getFavouriteRate(): Promise<string> {
  const defaultValue =  await chromeExtension.getStorage('favourite-rate') || '';
  return (defaultValue['favourite-rate']) ? defaultValue['favourite-rate'] : RatesPair.ARS_ARS;
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
