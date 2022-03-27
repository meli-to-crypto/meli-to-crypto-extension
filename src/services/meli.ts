import { RatesPair } from '../models/crypto';
import { Currency } from './currency';
import { JSDOM } from './jsdom';

const jsdom = new JSDOM();
const currency = new Currency();

export class Meli {
  PRICE_SYMBOL_SELECTOR = '.andes-money-amount__currency-symbol, .price-tag-symbol, .price-symbol'
  PRICE_FRACTION_SELECTOR = '.andes-money-amount__fraction, .price-tag-fraction, .price-fraction'
  PRICE_CENTS_SELECTOR = '.andes-money-amount__cents, .price-tag-cents, .price-cents'

  getCurrencyDecimal(pairCode: RatesPair) {
    return currency.getCurrencyDecimals(pairCode);
  }

  async getRatesAndCurrency(rateCode: RatesPair) {
    const rates = await currency.getRates();
    const result = currency.getCurrency(rates, rateCode);
    // TODO: handle error in a better way 
    return result.ask;
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
        this.PRICE_SYMBOL_SELECTOR
      );
      const price_fraction = elements[i].querySelector(
        this.PRICE_FRACTION_SELECTOR
      );
      const price_cents = elements[i].querySelector(
        this.PRICE_CENTS_SELECTOR
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
        price_fraction.setAttribute('m2c-original-string', price_fraction.innerHTML)
        price_cents?.setAttribute('m2c-original-string', price_cents.innerHTML)
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

  revertToOriginal() {
    console.log('Reverting to original prices...');
    const convertedElements = jsdom.getElementByQuerySelectorAll('[m2c-original="stored"]');
    if (convertedElements.length === 0) return;

    for (const element of convertedElements) {
      // TODO: get those 3 elements with a custom function
      const price_symbol = element.querySelector(this.PRICE_SYMBOL_SELECTOR);
      const price_fraction = element.querySelector(this.PRICE_FRACTION_SELECTOR);
      const price_cents = element.querySelector(this.PRICE_CENTS_SELECTOR);

      if (!price_symbol || !price_fraction ) continue;

      price_symbol.innerHTML = price_symbol.getAttribute('m2c-original') || ''
      price_fraction.innerHTML = price_fraction.getAttribute('m2c-original-string') || ''
      if (price_cents) {
        price_cents.innerHTML = price_cents.getAttribute('m2c-original-string') || ''
      }
    }
    
  }

  getPricingElements() {
    const elements = jsdom.getElementByQuerySelectorAll(
      '.andes-money-amount, .price-tag-amount, .item-price, .item-price--old, .price-tag'
    );
    return elements;
  }
}
