export class Rates {
  changePriceOnMeli() {
    // const priceToPay =
    //   JSON.parse(document.querySelector('[type="application/ld+json"]')?.text)
    //     .offers?.price || 0;
    // // Discount
    // const originalPrice =
    //   +document
    //     .querySelector('.andes-money-amount--previous .andes-visually-hidden')
    //     ?.textContent?.match(/(\d+)\s+pesos/)?.[1] || 0;
    // Change DOM for Price to pay element
    //   const priceToPayElements = getElementByQuerySelector(
    //     ':not(.andes-money-amount--previous) > .andes-money-amount__fraction'
    //   );
    //   changeElement(priceToPay, priceToPayElements, ask, code);
    //   // Change DOM for Discount Element
    //   if (originalPrice !== 0)
    //     changeElement(
    //       originalPrice,
    //       getElementByQuerySelector(
    //         '.andes-money-amount--previous .andes-money-amount__fraction'
    //       ),
    //       ask,
    //       code
    //     );
    // });
  }

  async retrieveRates() {
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    };
    return await this.fetchURL('https://api.belo.app/public/price', options);
  }

  async fetchURL(url = '', options = {}) {
    const response = await fetch(url, options);
    return response.json();
  }

  retrieveCurrency(rates: Array<any>, pairCode: any) {
    return rates.filter((rate) => rate.pairCode === pairCode)[0];
  }

  getElementByClassName(elementName: string) {
    return document.getElementsByClassName(elementName);
  }

  getElementByQuerySelector(elementName: any) {
    return document.querySelectorAll(elementName);
  }

  removeElement(elementName: any) {
    const element = this.getElementByQuerySelector(elementName);
    for (let i = 0; i < element.length; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
  }

  changeElement(
    originPrice: any,
    elements: string | any[],
    ask: any,
    code: any
  ) {
    chrome.storage.sync.get('decimals', ({ decimals }) => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = 'green';
        elements[i].innerHTML = this.convertPrice(
          originPrice,
          ask,
          code,
          decimals
        );
      }
    });
  }

  convertPrice(
    originCoin: number,
    newCoin: number,
    coin: any,
    decimals: number | undefined
  ) {
    return `${(originCoin / newCoin).toFixed(decimals)} ${coin}`;
  }

  removeSymbolAndCents() {
    // Pesos symbol
    this.removeElement('.andes-money-amount__currency-symbol');
    // Small cents
    this.removeElement('.andes-money-amount__cents');
  }
}
