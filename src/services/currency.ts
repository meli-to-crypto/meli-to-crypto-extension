import { Belo, RatesDecimal, RatesPair } from '../models/crypto';

export class Currency {
  async getRates() {
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

  getCurrency(rates: Array<Belo>, pairCode: RatesPair) {
    return rates.filter((rate) => rate.pairCode === pairCode)[0];
  }

  getCurrencyDecimals(pairCode: RatesPair) {
    return RatesDecimal[pairCode];
  }

  convertPrice(priceToPay: number, priceInARS: number, decimals?: number) {
    return `${(priceToPay / priceInARS).toFixed(decimals)}`;
  }
}
