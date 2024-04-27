import React from 'react';
import { useWeb3 } from './useWeb3';

const MintList = () => {
  const { mints, editRecord } = useWeb3();

  return (
    <div className="mint-container">
      <p className="subtitle"> Recently minted domains!</p>
      <div className="mint-list">
        {mints.map((mint, index) => (
          <div className="mint-item" key={index}>
            <div className='mint-row'>
              <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${mint.id}`} target="_blank" rel="noopener noreferrer">
                <p className="underlined">{mint.name}.ninja</p>
              </a>
              {mint.owner ? (
                <button className="edit-button" onClick={() => editRecord(mint.name)}>
                  <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                </button>
              ) : null}
            </div>
            <p> {mint.record} </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MintList;
