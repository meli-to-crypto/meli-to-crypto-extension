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

  splitRateCode(rateCode: RatesPair) {
    return rateCode.split('/')[0];
  }

  parseOriginalPrice(price: string, cents: string = '0') {
    return parseFloat([price.replace('.', ''), cents].join('.'));
  }

  changePricePage(
    elements: any,
    priceInARS: any,
    rateCode: any,
    decimals?: any
  ) {
    for (let i = 0; i < elements.length; i++) {
      const price_symbol = elements[i].querySelector(
        '.andes-money-amount__currency-symbol, .price-tag-symbol, .price-symbol'
      );
      const price_fraction = elements[i].querySelector(
        '.andes-money-amount__fraction, .price-tag-fraction, .price-fraction'
      );
      const price_cents = elements[i].querySelector(
        '.andes-money-amount__cents, .price-tag-cents, .price-cents'
      );

      if (!price_symbol || !price_fraction) continue;
      // Store original ARS pricing information on each pricing element
      if (!price_symbol.getAttribute('m2c-original')) {
        elements[i].setAttribute('m2c-original', 'stored');
        price_symbol.setAttribute('m2c-original', price_symbol.innerHTML);
        price_fraction.setAttribute(
          'm2c-original',
          this.parseOriginalPrice(
            price_fraction.innerHTML,
            price_cents?.innerHTML || '0'
          )
        );
      }

      price_symbol.innerHTML = rateCode;
      price_fraction.innerHTML = currency.convertPrice(
        price_fraction.getAttribute('m2c-original'),
        priceInARS,
        decimals
      );
      price_cents ? (price_cents.innerHTML = '') : null;
    }
  }

  getPricingElements() {
    return jsdom.getElementByQuerySelectorAll(
      '.andes-money-amount, .price-tag-amount, .item-price, .item-price--old, .price-tag'
    );
  }
}
