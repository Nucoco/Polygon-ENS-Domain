import { networks } from "./network";

const connectWallet = async (setCurrentAccount) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Get MetaMask -> https://metamask.io/');
      return;
    }
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    console.log('Connected', accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
};

const checkIfWalletIsConnected = async (setCurrentAccount, setNetwork) => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log('Make sure you have MetaMask!');
    return;
  } else {
    console.log('We have the ethereum object', ethereum);
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log('Found an authorized account:', account);
    setCurrentAccount(account);
  } else {
    console.log('No authorized account found');
  }

  // ユーザーのネットワークのチェーンIDをチェックします。
  const chainId = await ethereum.request({ method: 'eth_chainId' });

  console.log('chainId: ', chainId);
  console.log('networks: ', networks[chainId]);

  setNetwork(networks[chainId]);

  /**
   * これ、今は動かなくて、ポーリングしなきゃらしい。
   */
  ethereum.on('chainChanged', (_chainId) => {
    window.location.reload();
  });
};

export { connectWallet, checkIfWalletIsConnected };
