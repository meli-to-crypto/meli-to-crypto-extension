import { JSDOM } from './jsdom';

const jsdom = new JSDOM();

export class Meli {
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
}
