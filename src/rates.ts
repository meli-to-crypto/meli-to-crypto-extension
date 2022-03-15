export class Rates {
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

  convertPrice(
    originCoin: number,
    newCoin: number,
    coin: any,
    decimals: number | undefined
  ) {
    return `${(originCoin / newCoin).toFixed(decimals)} ${coin}`;
  }
}
