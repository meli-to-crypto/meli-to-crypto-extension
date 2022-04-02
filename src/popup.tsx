import './popup.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as crypto from '@styled-icons/crypto';

import { getFavouriteRate, setFavouriteRate } from './content_script';
import { PairCode, RatesPair, RatesPairLabel } from './models/crypto';

const Popup = () => {
  //TODO: Refactor this later to accept any dynamic attribute in the icon key value pair
  const pairCode: PairCode[] = [
    {
      label: RatesPairLabel.DEFAULT,
      value: RatesPair.ARS_ARS
    },
    {
      label: RatesPairLabel.DAI,
      value: RatesPair.DAI_ARS,
      icon: <crypto.Dai size="32" />
    },
    {
      label: RatesPairLabel.USDC,
      value: RatesPair.USDC_ARS,
      icon: <crypto.Usdc size="32" />
    },
    {
      label: RatesPairLabel.USDT,
      value: RatesPair.USDT_ARS,
      icon: <crypto.Usdt size="32" />
    },
    {
      label: RatesPairLabel.ETH,
      value: RatesPair.ETH_ARS,
      icon: <crypto.Eth size="32" />
    },
    {
      label: RatesPairLabel.BTC,
      value: RatesPair.BTC_ARS,
      icon: <crypto.Btc size="32" />
    },
    {
      label: RatesPairLabel.SAT,
      value: RatesPair.SAT_ARS,
      icon: <crypto.Btc size="32" />
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
        chrome.tabs.sendMessage(tab.id, {
          rate: userQuery
        });
        setFavouriteRate(userQuery);
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          width: 250,
          p: 1,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight={800} paddingTop="0.8em">
          Meli a Crypto
        </Typography>
        <FormControl sx={{ py: 4 }} fullWidth>
          {loading ? (
            <h3>Cargando...</h3>
          ) : (
            <Select
              onChange={handleChange}
              defaultValue={defaultPair}
              sx={{ backgroundColor: 'white' }}
            >
              {pairCode.map((option, i) => {
                return (
                  <MenuItem key={i} value={option.value}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <ListItemIcon sx={{ pl: 2 }}>{option.icon}</ListItemIcon>
                      <Typography>{option.label}</Typography>
                    </div>
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
