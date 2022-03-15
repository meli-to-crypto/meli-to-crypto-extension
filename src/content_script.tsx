import { Rates } from './rates';

const rates = new Rates();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  console.log('🚀 => msg', msg);
  console.log('🚀 => sender', sender);
  if (msg.rate) {
    const rate = await rates.retrieveRates();
    const { ask } = rates.retrieveCurrency(rate, msg.rate);
    rates.removeSymbolAndCents();
  } else {
    sendResponse('error');
  }
});
