import './popup.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { setFavouriteRate } from './content_script';
import { RatesPair } from './models/crypto';

const Popup = () => {
  const pairCode = [
    {
      label: 'Seleccionar',
      value: RatesPair.USDT_ARS
    },
    {
      label: RatesPair.DAI_ARS,
      value: RatesPair.DAI_ARS
    },
    {
      label: RatesPair.USDC_ARS,
      value: RatesPair.USDC_ARS
    },
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
    },
    {
      label: RatesPair.SAT_ARS,
      value: RatesPair.SAT_ARS
    }
  ];

  const handleChange = async (event: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          rate: event.target.value
        });
        setFavouriteRate(event.target.value);
      }
    });
  };

  return (
    <>
      <h1 className="title">Convertir Meli a Crypto</h1>
      <h3>Convertir a: </h3>
      <div className="select">
        <select className="select" onChange={handleChange}>
          {pairCode.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
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
