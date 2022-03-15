import { RatesPair } from '../models/crypto';
import { Currency } from './currency';
import { JSDOM } from './jsdom';

const jsdom = new JSDOM();
const currency = new Currency();

export class Meli {
  getCurrencyDecimal(pairCode: RatesPair) {
    return currency.getCurrencyDecimals(pairCode);
  }

  async getRatesAndCurrency(rateCode: RatesPair) {
    const rates = await currency.getRates();
    const { ask } = currency.getCurrency(rates, rateCode);
    return ask;
  }

  getPriceToPay() {
    return (
      JSON.parse(
        jsdom.getElementByQuerySelector('[type="application/ld+json"]')?.text
      ).offers?.price || 0
    );
  }

  getDiscount() {
    return (
      jsdom
        .getElementByQuerySelector(
          '.andes-money-amount--previous .andes-visually-hidden'
        )
        ?.textContent?.match(/(\d+)\s+pesos/)?.[1] || 0
    );
  }

  //TODO: Nombre no se q es esto
  getDiscountElement() {
    return jsdom.getElementByQuerySelector(
      '.andes-money-amount--previous .andes-money-amount__fraction'
    );
  }

  changePricePage(
    priceToPay: any,
    priceToPayElements: any,
    priceInARS: any,
    rateCode: any,
    decimals?: any
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
