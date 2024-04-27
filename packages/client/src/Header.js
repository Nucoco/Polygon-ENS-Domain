import React from 'react';
import { useWeb3 } from './useWeb3';
import ethLogo from './assets/ethlogo.png';
import polygonLogo from './assets/polygonlogo.png';

const Header = () => {
  const { currentAccount, network } = useWeb3();
  return (
    <div className="header-container">
      <header>
        <div className="left">
          <p className="title">🐱‍👤 Ninja Name Service</p>
          <p className="subtitle">Your immortal API on the blockchain!</p>
        </div>
        <div className="right">
          <img alt="Network logo" className="logo" src={network.includes('Polygon') ? polygonLogo : ethLogo} />
          {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p>}
        </div>
      </header>
    </div>
  );
};

export default Header;
