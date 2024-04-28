import React, { useEffect, useState } from 'react';
import ethLogo from './assets/ethlogo.png';
import polygonLogo from './assets/polygonlogo.png';
import twitterLogo from './assets/twitter-logo.svg';
import { CONTRACT_ADDRESS, fetchMints, mintDomain, updateDomain } from './utils/contract';
import { switchNetwork } from './utils/network';
import { connectWallet, checkIfWalletIsConnected }  from './utils/wallet';
import './styles/App.css';

const TWITTER_HANDLE = 'UNCHAIN_tech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.ninja';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [network, setNetwork] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mints, setMints] = useState([]);

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja gif"
      />
      <button
        onClick={() => connectWallet(setCurrentAccount)}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  const renderInputForm = () => {
    if (network !== 'Sepolia') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to the Sepolia</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="whats ur ninja power"
          onChange={(e) => setRecord(e.target.value)}
        />

        {editing ? (
          <div className="button-container">
            <button
              className='cta-button mint-button'
              disabled={loading}
              onClick={() => updateDomain(domain, setDomain, record, setRecord, setLoading)}
            >
              Set record
            </button>
            <button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            className='cta-button mint-button'
            disabled={loading}
            onClick={() => mintDomain(domain, setDomain, record, setRecord)}
          >
            Mint
          </button>
        )}
      </div>
    );
  };

  const renderMints = () => {
    if (currentAccount && mints.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle"> Recently minted domains!</p>
          <div className="mint-list">
            { mints.map((mint, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className='mint-row'>
                    <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                      <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                    </a>
                    { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                      <button className="edit-button" onClick={() => editRecord(mint.name)}>
                        <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                      </button>
                      :
                      null
                    }
                  </div>
            <p> {mint.record} </p>
          </div>)
          })}
        </div>
      </div>);
    }
  };

  // edit モードを設定します。
  const editRecord = (name) => {
    console.log('Editing record for', name);
    setEditing(true);
    setDomain(name);
  }

  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount, setNetwork);
  }, []);

  useEffect(() => {
    if (network === 'Sepolia') {
      fetchMints(setMints);
    }
  }, [currentAccount, network]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
            <div className="right">
              <img alt="Network logo" className="logo" src={network.includes('Polygon') ? polygonLogo : ethLogo} />
              { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
            </div>
          </header>
        </div>

        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}
        {mints && renderMints()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`built with @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;