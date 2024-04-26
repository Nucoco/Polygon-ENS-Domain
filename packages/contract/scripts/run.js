const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile: dist to contract/artifacts
  // getContractFactory関数は、デプロイをサポートするライブラリのアドレスとDomainsコントラクトの連携を行っています。
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');

  // HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。
  // そして、スクリプトの実行が完了した後、そのローカル・ネットワークを破棄します。
  // つまり、コントラクトを実行するたびに、毎回ローカルサーバーを更新するかのようにブロックチェーンが新しくなります。
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log('Contract deployed by:', owner.address);

  // コントラクト呼び出し
  const txn = await domainContract.register('doom');
  await txn.wait();

  const domainOwner = await domainContract.getAddress('doom');
  console.log('Owner of domain:', domainOwner);
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