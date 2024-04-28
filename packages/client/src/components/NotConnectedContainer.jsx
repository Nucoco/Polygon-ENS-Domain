import { connectWallet } from "../utils/wallet";

const NotConnectedContainer = ({
  features: {
    setCurrentAccount,
  }
}) => (
  <div className="connect-wallet-container">
    <img
      src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
      alt="Ninja gif"
    />
    <button
      onClick={() => connectWallet(setCurrentAccount)}
      className="cta-button connect-wallet-button"
    >
      Connect Wallet
    </button>
  </div>
);

export default NotConnectedContainer;