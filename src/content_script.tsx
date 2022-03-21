import { RatesPair } from './models/crypto';
import { Meli } from './services/meli';

const meli = new Meli();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (!msg.rate) {
    sendResponse('didn`t select a rate or error');
  }
  const rateCode: RatesPair = msg.rate;

  const priceInARS = await meli.getRatesAndCurrency(rateCode);

  const pricingElements = meli.getPricingElements();

  const codeRate = meli.splitRateCode(rateCode);

  const decimals = meli.getCurrencyDecimal(rateCode);

  // Main Price
  meli.changePricePage(pricingElements, priceInARS, codeRate, decimals);
});
