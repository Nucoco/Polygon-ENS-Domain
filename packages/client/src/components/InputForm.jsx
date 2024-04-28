import { tld } from "../App";
import { mintDomain, updateDomain } from "../utils/contract";
import { switchNetwork } from "../utils/network";

const InputForm = ({
  features: {
    domain,
    setDomain,
    record,
    setRecord,
    loading,
    setLoading,
    editing,
    setEditing,
    network,
    setMints,
  }
}) => {
  if (network !== 'Sepolia') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to the Sepolia</p>
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="first-row">
        <input
          type="text"
          value={domain}
          placeholder="domain"
          onChange={(e) => setDomain(e.target.value)}
        />
        <p className="tld"> {tld} </p>
      </div>

      <input
        type="text"
        value={record}
        placeholder="whats ur ninja power"
        onChange={(e) => setRecord(e.target.value)}
      />

      {editing ? (
        <div className="button-container">
          <button
            className='cta-button mint-button'
            disabled={loading}
            onClick={() => updateDomain(domain, setDomain, record, setRecord, setLoading, setMints)}
          >
            Set record
          </button>
          <button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          className='cta-button mint-button'
          disabled={loading}
          onClick={() => mintDomain(domain, setDomain, record, setRecord, setMints)}
        >
          Mint
        </button>
      )}
    </div>
  );
};

export default InputForm;