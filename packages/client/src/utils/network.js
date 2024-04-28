const networks = {
  "0x1": "Mainnet",
  "0x3": "Ropsten",
  "0x2a": "Kovan",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
  "0xaa36a7": "Sepolia",
  "0x61": "BSC Testnet",
  "0x38": "BSC Mainnet",
  "0x89": "Polygon Mainnet",
  "0x13881": "Polygon Mumbai Testnet",
  "0xa86a": "AVAX Mainnet",
}

const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      // このエラーコードは当該チェーンがメタマスクに追加されていない場合です。
      // その場合、ユーザーに追加するよう促します。
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  } else {
    // window.ethereum が見つからない場合メタマスクのインストールを促します。
    alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
  }
};

export { networks, switchNetwork };