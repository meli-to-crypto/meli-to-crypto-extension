export interface Belo {
  ask: string;
  bid: string;
  baseId: string;
  quoteId: string;
  pairCode: string;
  spread: string;
}

export enum Rates {
  'BTC/ARS' = 'BTC/ARS',
  'ETH/ARS' = 'ETH/ARS',
  'DAI/ARS' = 'DAI/ARS',
  'USDT/ARS' = 'USDT/ARS',
  'USDC/ARS' = 'USDC/ARS',
  'ETH/BTC' = 'ETH/BTC',
  'BTC/DAI' = 'BTC/DAI',
  'BTC/USDT' = 'BTC/USDT',
  'ETH/DAI' = 'ETH/DAI',
  'ETH/USDT' = 'ETH/USDT',
  'DAI/USDT' = 'DAI/USDT',
  'DAI/USDC' = 'DAI/USDC',
  'USDC/USDT' = 'TRX/ARS'
}
