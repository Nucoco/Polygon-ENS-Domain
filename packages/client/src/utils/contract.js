import { ethers } from 'ethers';
import contractAbi from './contractABI.json';

const CONTRACT_ADDRESS = '0xEF760bCFE917793Fefd505cf27105a56d45F8166';

const connectToContract = () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    return contract
  }
  return;
}

const calculatePrice = (domain) => {
  return domain.length === 3
      ? '0.0000005'
      : domain.length === 4
        ? '0.0000003'
        : '0.0000001';
}

const fetchMints = async (setMints) => {
  try {
    const contract = connectToContract();
    if (contract) {
      // ネームごとにレコードを取得します。マッピングの対応を理解しましょう。
      const names = await contract.getAllNames();
      const mintRecords = await Promise.all(
        names.map(
          async (name) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
          }
        )
      );

      console.log('MINTS FETCHED ', mintRecords);
      setMints(mintRecords);
    }
  } catch(error){
    console.log(error);
  }
}

const mintDomain = async (domain, setDomain, record, setRecord) => {
  domain?.length < 3 && alert('Domain must be at least 3 characters long');
  if (!domain || domain.length < 3) {
    return;
  }

  try {
    // connect to contract
    const contract = connectToContract(ethereum);
    if (contract) {
      const price = calculatePrice(domain);
      console.log('Minting domain', domain, 'with price', price);

      // ドメイン登録
      console.log('Going to pop wallet now to pay gas...');
      let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});

      // tx実行待ち=ブロック取り込み待ち
      const receipt = await tx.wait();

      // トランザクションが問題なく実行されたか確認する
      if (receipt.status === 1) {
        console.log('Domain minted! https://sepolia.etherscan.io/tx/' + tx.hash);

        // ドメインにコンテンツを紐づけ
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log('Record set! https://sepolia.etherscan.io/tx/' + tx.hash);

        // fetchMints関数実行後2秒待ちます。
        setTimeout(() => {
          fetchMints();
        }, 2000);

        setRecord('');
        setDomain('');
      } else {
        alert('Transaction failed! Please try again');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const updateDomain = async (domain, setDomain, record, setRecord, setLoading) => {
  if (!record || !domain) { return }
  setLoading(true);
  console.log('Updating domain', domain, 'with record', record);
    try {
      const contract = connectToContract();
      if (contract) {
        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log('Record set https://sepolia.etherscan.io/tx/'+tx.hash);

        fetchMints();
        setRecord('');
        setDomain('');
      }
    } catch(error) {
      console.log(error);
    }
  setLoading(false);
};

export { CONTRACT_ADDRESS, fetchMints, mintDomain, updateDomain };