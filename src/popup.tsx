import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  const pairCode = [
    {
      label: 'USDT/ARS',
      value: 'USDT'
    },
    {
      label: 'ETH/ARS',
      value: 'ETH'
    },
    {
      label: 'BTC/ARS',
      value: 'BTC'
    }
  ];

  const changeRates = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            rate: 'USDT/ARS'
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
      <select value="banana">
        {pairCode.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <button onClick={changeRates}>quiero USDT</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
