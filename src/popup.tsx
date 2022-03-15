import React from 'react';
import ReactDOM from 'react-dom';

import { Rates, RatesPair } from './models/crypto';

const Popup = () => {
  const pairCode = [
    {
      label: RatesPair.USDT_ARS,
      value: Rates.USDT
    },
    {
      label: RatesPair.ETH_ARS,
      value: Rates.ETH
    },
    {
      label: RatesPair.BTC_ARS,
      value: Rates.BTC
    }
  ];

  const handleChange = async (event: any) => {
    console.log('🚀 => handleChange => event', event);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            rate: event.target.value
          },
          async (msg) => {
            console.log('result message:', msg);
          }
        );
      }
    });
  };

  return (
    <>
      <select onChange={handleChange}>
        {pairCode.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
