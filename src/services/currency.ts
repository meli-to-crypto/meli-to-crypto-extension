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

  delay(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async fetchURL(url = '', options = {}) {
    let isLoading = true;
    let output: Belo[] = [];
    let retries = 0;
    let errorMsg = '';
    const MAX_RETRIES = 6;
    while (isLoading && retries <= MAX_RETRIES) {
      try {
        const response = await fetch(url, options);
        isLoading = false;
        output = await response.json() as Belo[];
      } catch (e) {
        retries++
        console.log('Belo API didn\'t respond. Attempt number:', retries);
        // Will go -> 200,400,800,1600,3200,6400,12800 (ms).
        const exponentialRetry = ((2**retries) * 100); // https://docs.aws.amazon.com/es_es/general/latest/gr/api-retries.html
        await this.delay(exponentialRetry);
        errorMsg = JSON.stringify(e);
      }
    }
    if (isLoading) {
      alert('No se pudo consultar las cotizaciones.')
    }
    return output;
  }

  addDerivedRates(rates: Array<Belo>) {
    const btcArs = this.getCurrency(rates, RatesPair.BTC_ARS);
    
    if (!btcArs) {
      return rates;
    }

    // Prevent call by reference
    let satArs = {
      ...btcArs
    }
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
