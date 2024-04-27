import { useState, useContext, createContext, useEffect } from 'react';
import { ethers } from 'ethers';
import contractAbi from './utils/contractABI.json';
import { connectWallet, checkIfWalletIsConnected } from './wallet';
import { switchNetwork } from './network';
import { networks } from './utils/networks';

const CONTRACT_ADDRESS = '0xEF760bCFE917793Fefd505cf27105a56d45F8166';
const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [network, setNetwork] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mints, setMints] = useState([]);

  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount, setNetwork, networks);
  }, []);

  const mintDomain = async () => {
    if (!domain) {
      return;
    }
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long');
      return;
    }

    const price =
      domain.length === 3
        ? '0.0000005'
        : domain.length === 4
          ? '0.0000003'
          : '0.0000001';
    console.log('Minting domain', domain, 'with price', price);

    try {
      const { ethereum } = window;
      if (ethereum) {
        // connect to contract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        console.log('Going to pop wallet now to pay gas...');

        // ドメイン登録
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

  const updateDomain = async () => {
    if (!record || !domain) { return }
    setLoading(true);
    console.log('Updating domain', domain, 'with record', record);
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

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
  }

  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        const names = await contract.getAllNames();

        // ネームごとにレコードを取得します。マッピングの対応を理解しましょう。
        const mintRecords = await Promise.all(names.map(async (name) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        }));

        console.log('MINTS FETCHED ', mintRecords);
        setMints(mintRecords);
      }
    } catch(error){
      console.log(error);
    }
  }

  const editRecord = (name) => {
    console.log('Editing record for', name);
    setEditing(true);
    setDomain(name);
    // レコードの取得はここで行うかもしれません
  };

  return (
    <Web3Context.Provider value={{
      currentAccount,
      setCurrentAccount,
      domain,
      setDomain,
      record,
      setRecord,
      network,
      setNetwork,
      editing,
      setEditing,
      loading,
      setLoading,
      mints,
      setMints,
      connectWallet: () => connectWallet(setCurrentAccount),
      switchNetwork,
      checkIfWalletIsConnected: () => checkIfWalletIsConnected(setCurrentAccount, setNetwork, networks),
      mintDomain,
      updateDomain,
      fetchMints,
      editRecord
    }}>
      {children}
    </Web3Context.Provider>
  );
};
