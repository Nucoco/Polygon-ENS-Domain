import React from 'react';
import { useWeb3 } from './useWeb3';

const DomainForm = () => {
  const { domain, setDomain, record, setRecord, editing, setEditing, loading, mintDomain, updateDomain } = useWeb3();

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
  };

  const handleRecordChange = (e) => {
    setRecord(e.target.value);
  };

  return (
    <div className="form-container">
      <div className="first-row">
        <input
          type="text"
          value={domain}
          placeholder="domain"
          onChange={handleDomainChange}
        />
        <p className="tld">.ninja</p>
      </div>
      <input
        type="text"
        value={record}
        placeholder="whats ur ninja power"
        onChange={handleRecordChange}
      />
      {editing ? (
        <div className="button-container">
          <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
            Set record
          </button>
          <button className='cta-button mint-button' onClick={() => { setEditing(false); }}>
            Cancel
          </button>
        </div>
      ) : (
        <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
          Mint
        </button>
      )}
    </div>
  );
};

export default DomainForm;
