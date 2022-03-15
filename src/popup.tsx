import './popup.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { RatesPair } from './models/crypto';

const Popup = () => {
  const pairCode = [
    {
      label: RatesPair.USDT_ARS,
      value: RatesPair.USDT_ARS
    },
    {
      label: RatesPair.ETH_ARS,
      value: RatesPair.ETH_ARS
    },
    {
      label: RatesPair.BTC_ARS,
      value: RatesPair.BTC_ARS
    }
  ];

  const handleChange = async (event: any) => {
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
      <div className="select">
        <select onChange={handleChange}>
          {pairCode.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
