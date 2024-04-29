import { tld } from '../App';
import { useTopContext } from '../hooks/useTopContext';
import { CONTRACT_ADDRESS } from '../utils/contract';

const Mints = () => {
	const { currentAccount, mints, setEditing, setDomain } = useTopContext();

	// edit モードを設定します。
	const editRecord = (name) => {
		console.log('Editing record for', name);
		setEditing(true);
		setDomain(name);
	};

  const mintCard = (mint, index) => {
    return (
      <div className="mint-item" key={index}>
        <div className="mint-row">
          <a
            className="link"
            href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="underlined">
              {' '}
              {mint.name}
              {tld}
              {' '}
            </p>
          </a>
          {mint.owner.toLowerCase() === currentAccount.toLowerCase()
            ? <button className="edit-button" onClick={() => editRecord(mint.name)}>
                  <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button"/>
              </button>
            : null
          }
        </div>
        <p> {mint.record} </p>
      </div>
    );
  };

	if (currentAccount && mints.length > 0) {
		return (
			<div className="mint-container">
				<p className="subtitle"> Recently minted domains!</p>
				<div className="mint-list">
					{mints.map(mintCard)}
				</div>
			</div>
		);
	}
  // 何も返さないとエラーになる
	return <></>;
};

export default Mints;
