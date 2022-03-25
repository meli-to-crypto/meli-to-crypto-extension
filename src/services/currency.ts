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
    const rates = await this.fetchURL('https://api.belo.app/public/price', options);
    return this.addDerivedRates(rates);
  }

  async fetchURL(url = '', options = {}) {
    const response = await fetch(url, options);
    return response.json();
  }

  addDerivedRates(rates: Array<Belo>) {
    const btcArs = this.getCurrency(rates, RatesPair.BTC_ARS);
    if (!btcArs) {
      return rates;
    }

    let satArs = btcArs;
    satArs.pairCode = RatesPair.SAT_ARS;
    satArs.ask = (parseFloat(satArs.ask) / 1e8).toString();
    satArs.bid = (parseFloat(satArs.bid) / 1e8).toString();

    rates.push(satArs);
    return rates;
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
