export const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }],
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  } else {
    alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
  }
};
