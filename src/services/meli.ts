import { RatesPair } from '../models/crypto';
import { Currency } from './currency';
import { JSDOM } from './jsdom';

const jsdom = new JSDOM();
const currency = new Currency();

export class Meli {
  async retrieveRatesAndCurrency(rateCode: RatesPair) {
    const rates = await currency.retrieveRates();
    const { ask } = currency.retrieveCurrency(rates, rateCode);
    return ask;
  }

  retrievePriceToPay() {
    return (
      JSON.parse(
        jsdom.getElementByQuerySelector('[type="application/ld+json"]')?.text
      ).offers?.price || 0
    );
  }

  retrieveDiscount() {
    return (
      jsdom
        .getElementByQuerySelector(
          '.andes-money-amount--previous .andes-visually-hidden'
        )
        ?.textContent?.match(/(\d+)\s+pesos/)?.[1] || 0
    );
  }

  // Change DOM for Price to pay element
  changeDOMPricePayElement() {
    return jsdom.getElementByQuerySelectorAll(
      ':not(.andes-money-amount--previous) > .andes-money-amount__fraction'
    );
  }

  removeSymbolAndCents() {
    // Pesos symbol
    jsdom.removeElement('.andes-money-amount__currency-symbol');
    // Small cents
    jsdom.removeElement('.andes-money-amount__cents');
  }
}
