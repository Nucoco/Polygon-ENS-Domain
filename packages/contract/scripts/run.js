const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile: dist to contract/artifacts
  // getContractFactory関数は、デプロイをサポートするライブラリのアドレスとDomainsコントラクトの連携を行っています。
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');

  // HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。
  // そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。
  // つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。
  const domainContract = await domainContractFactory.deploy('namespace');
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log('Contract deployed by:', owner.address);

  // コントラクト呼び出し
  let txn = await domainContract.register('doom', {
    value: hre.ethers.utils.parseEther('10.0'),
  });
  await txn.wait();

  const domainOwner = await domainContract.getAddress('doom');
  console.log('Owner of domain doom: ', domainOwner);


  // ----withdrawal test
  const getBalanceEther = async (address) => {
    const balance = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balance)
  }
  // 残高移動確認用
  const balanceLog = {
    contract: {
      before: undefined,
      after: undefined
    },
    owner: {
      before: undefined,
      after: undefined
    }
  }
  balanceLog.contract.before = await getBalanceEther(domainContract.address);
  balanceLog.owner.before  = await getBalanceEther(owner.address);

  // withdraw by not owner; should be failed
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log('Could not rob contract');
  }

  // withdraw by owner
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  // contract と owner の残高を確認
  balanceLog.contract.after = await getBalanceEther(domainContract.address);
  balanceLog.owner.after = await getBalanceEther(owner.address);

  console.log('----- Balance log -----')
  console.log(`Contract: ${balanceLog.contract.before} -> ${balanceLog.contract.after}`);
  console.log(`Owner   : ${balanceLog.owner.before} -> ${balanceLog.owner.after}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();