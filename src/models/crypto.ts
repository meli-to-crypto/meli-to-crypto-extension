export interface Belo {
  ask: string;
  bid: string;
  baseId: string;
  quoteId: string;
  pairCode: string;
  spread: string;
}

export enum Rates {
  BTC = 'BTC/',
  ETH = 'ETH',
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC'
}

export enum RatesPair {
  BTC_ARS = 'BTC/ARS',
  ETH_ARS = 'ETH/ARS',
  DAI_ARS = 'DAI/ARS',
  USDT_ARS = 'USDT/ARS',
  USDC_ARS = 'USDC/ARS',
  ETH_BTC = 'ETH/BTC',
  BTC_DAI = 'BTC/DAI',
  BTC_USDT = 'BTC/USDT',
  ETH_DAI = 'ETH/DAI',
  ETH_USDT = 'ETH/USDT',
  DAI_USDT = 'DAI/USDT',
  DAI_USDC = 'DAI/USDC',
  USDC_USDT = 'USDC/USDT'
}
