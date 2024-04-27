import { ethers } from 'ethers';
import contractAbi from './utils/contractABI.json';

export const connectWallet = async (setCurrentAccount) => {
  const { ethereum } = window;
  if (!ethereum) {
    alert('Get MetaMask -> https://metamask.io/');
    return;
  }
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log('Connected', accounts[0]);
  setCurrentAccount(accounts[0]);
};

export const checkIfWalletIsConnected = async (setCurrentAccount, setNetwork, networks) => {
  const { ethereum } = window;
  if (!ethereum) {
    console.log('Make sure you have MetaMask!');
    return;
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log('Found an authorized account:', account);
    setCurrentAccount(account);
  } else {
    console.log('No authorized account found');
  }

  const chainId = await ethereum.request({ method: 'eth_chainId' });
  setNetwork(networks[chainId]);

  ethereum.on('chainChanged', (_chainId) => {
    window.location.reload();
  });
};
