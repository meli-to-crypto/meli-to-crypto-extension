import './popup.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { getFavouriteRate, setFavouriteRate } from './content_script';
import { RatesPair } from './models/crypto';

const Popup = () => {
  const pairCode = [
    {
      label: 'Por defecto (ARS)',
      value: RatesPair.ARS_ARS
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

  const [defaultPair, setDefaultPair] = useState<RatesPair>(RatesPair.ARS_ARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDefaultPair = async() => {
      const dP = await getFavouriteRate() as RatesPair;
      setDefaultPair(dP)
      setLoading(false);
    }
    getDefaultPair()
  }, [])
  
  
  const handleChange = async (event: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        const userQuery = event.target.value;
        // console.log('New query:', userQuery);
        chrome.tabs.sendMessage(tab.id, {
          rate: userQuery
        });
        setFavouriteRate(userQuery);
      }
    });
  };

  return (
    <>
      <h1 className="title">Convertir Meli a Crypto</h1>
      <h3>Convertir a: </h3>
      <div className="select">
        {
          loading ?
          <h3>Cargando...</h3>
          :
          <select className="select" onChange={handleChange} defaultValue={defaultPair}>
            {pairCode.map((option, i) => {
              return (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              )
            })}
          </select>
          
        }
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
