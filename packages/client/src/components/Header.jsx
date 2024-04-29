import ethLogo from '../assets/ethlogo.png';
import polygonLogo from '../assets/polygonlogo.png';
import { useTopContext } from '../hooks/useTopContext';

const Header = () => {
	const { network, currentAccount } = useTopContext();

	return (
		<div className="header-container">
			<header>
				<div className="left">
					<p className="title">🐱‍👤 Ninja Name Service</p>
					<p className="subtitle">Your immortal API on the blockchain!</p>
				</div>
				<div className="right">
					<img
						alt="Network logo"
						className="logo"
						src={network.includes('Polygon') ? polygonLogo : ethLogo}
					/>
          {
            currentAccount
              ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p>
              : <p> Not connected </p>
          }
				</div>
			</header>
		</div>
	);
};

export default Header;
