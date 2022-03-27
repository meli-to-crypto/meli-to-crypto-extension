export interface Belo {
  ask: string;
  bid: string;
  baseId: string;
  quoteId: string;
  pairCode: string;
  spread: string;
}

export const RatesDecimal = {
  'ARS/ARS': 0,
  'BTC/ARS': 5,
  'ETH/ARS': 4,
  'DAI/ARS': 2,
  'USDT/ARS': 2,
  'USDC/ARS': 2,
  'ETH/BTC': 4,
  'BTC/DAI': 2,
  'BTC/USDT': 2,
  'ETH/DAI': 2,
  'ETH/USDT': 2,
  'DAI/USDT': 2,
  'DAI/USDC': 2,
  'USDC/USDT': 2,
  'SAT/ARS': 0
};

export enum RatesPair {
  ARS_ARS = 'ARS/ARS',
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
  USDC_USDT = 'USDC/USDT',
  SAT_ARS = 'SAT/ARS'
}
