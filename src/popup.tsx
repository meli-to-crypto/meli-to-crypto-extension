import './popup.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { getFavouriteRate, setFavouriteRate } from './content_script';
import { RatesPair, RatesPairLabel } from './models/crypto';

const Popup = () => {
  const pairCode = [
    {
      label: RatesPairLabel.DEFAULT,
      value: RatesPair.ARS_ARS
    },
    {
      label: RatesPairLabel.DAI,
      value: RatesPair.DAI_ARS
    },
    {
      label: RatesPairLabel.USDC,
      value: RatesPair.USDC_ARS
    },
    {
      label: RatesPairLabel.USDT,
      value: RatesPair.USDT_ARS
    },
    {
      label: RatesPairLabel.ETH,
      value: RatesPair.ETH_ARS
    },
    {
      label: RatesPairLabel.BTC,
      value: RatesPair.BTC_ARS
    },
    {
      label: RatesPairLabel.SAT,
      value: RatesPair.SAT_ARS
    }
  ];

  const [defaultPair, setDefaultPair] = useState<RatesPair>(RatesPair.ARS_ARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDefaultPair = async () => {
      const dP = (await getFavouriteRate()) as RatesPair;
      setDefaultPair(dP);
      setLoading(false);
    };
    getDefaultPair();
  }, []);

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
      <Box sx={{ minWidth: 120 }}>
        <h1 className="title">Meli a Crypto</h1>
        <FormControl fullWidth>
          <InputLabel>Convertir a:</InputLabel>
          {loading ? (
            <h3>Cargando...</h3>
          ) : (
            <Select
              className="select"
              onChange={handleChange}
              defaultValue={defaultPair}
            >
              {pairCode.map((option, i) => {
                return (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </FormControl>
      </Box>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
