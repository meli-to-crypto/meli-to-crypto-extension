import { RatesPair } from './models/crypto';
import { Meli } from './services/meli';

const meli = new Meli();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (msg.rate) {
    const rateCode: RatesPair = msg.rate;

    const priceInARS = await meli.getRatesAndCurrency(rateCode);

    const priceToPay = meli.getPriceToPay();

    const priceToPayElements = meli.changeDOMPricePayElement();

    const priceDiscount = meli.getDiscount();

    const priceDiscountElements = meli.getDiscountElement();

    const codeRate = meli.splitRateCode(rateCode);

    const decimals = meli.getCurrencyDecimal(rateCode);

    meli.removeSymbolAndCents();

    // Main Price
    meli.changePricePage(
      priceToPay,
      priceToPayElements,
      priceInARS,
      codeRate,
      decimals
    );

    // Discount Price
    meli.changePricePage(
      priceDiscount,
      priceDiscountElements,
      priceInARS,
      codeRate
    );
  } else {
    sendResponse('didn`t select a rate or error');
  }
});
