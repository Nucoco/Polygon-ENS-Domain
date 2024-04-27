import React from 'react';
import { Web3Provider } from './useWeb3';
import DomainForm from './DomainForm';
import MintList from './MintList';
import Header from './Header';
import Footer from './Footer';
import './styles/App.css';

const App = () => {
  return (
    <Web3Provider>
      <div className="App">
        <Header />
        <DomainForm />
        <MintList />
        <Footer />
      </div>
    </Web3Provider>
  );
};

export default App;
