# Project summary
ドメインにNFTを紐づけたENSコントラクトの作成

https://github.com/unchain-tech/UNCHAIN-projects/tree/main/docs/Polygon-ENS-Domain/ja

# Refs
ガス効率を向上させる文字列->バイト変換

https://gist.github.com/AlmostEfficient/669ac250214f30347097a1aeedcdfa12

Base64 for NFT

https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832

# note
### 画像NFTも。ドメインも、資産トークンも全部トークン で、トークンとはaddressマッピングに過ぎない。


### Object.keys()のようなことが出来ないので、マッピングのキー一覧（ドメイン一覧）などは別途配列として保持しておく必要あり。
```
Counters.Counter private _tokenIds;
mapping(string => address) public domains;
mapping(uint => string) public names;

// add domain:
domains[name] = msg.sender;
names[_tokenIds.current()] = name;
_tokenIds.increment();
```


### superの書き方はきもい

```
constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
    // process
}
```

### 送金の書き方もまあまあ奇妙
```
(bool success, ) = msg.sender.call{value: amount}("");
```

### 資金回収ロジックのために、contractオーナーはpayableで保存する
```
address payable public owner;

constructor() {
    owner = payable(msg.sender);
}

function isOwner() public view returns (bool) {
    return msg.sender == owner;
}
```
### カスタムエラー
```
error Unauthorized();

if (msg.sender != domains[name]) revert Unauthorized();
```

### Metamask / ネットワーク切り替え
```
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }],
});

// error.code === 4902 は当該チェーンがメタマスクに追加されていない場合
```

### Metamask / ネットワーク追加
```
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
```

### ethers.js / コントラクト接続
```
const { ethereum } = window;

// connect to contract
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

console.log('Going to pop wallet now to pay gas...');

// ドメイン登録
let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});

// tx実行待ち=ブロック取り込み待ち
const receipt = await tx.wait();
```

