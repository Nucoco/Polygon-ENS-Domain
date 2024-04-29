import React, { useEffect, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Mints from './components/Mints';
import NotConnectedContainer from './components/NotConnectedContainer';
import './styles/App.css';
import { fetchMints } from './utils/contract';
import { checkIfWalletIsConnected } from './utils/wallet';
import { TopContextProvider } from './context/TopContext';

export const tld = '.ninja';

const App = () => {
	// states
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mints, setMints] = useState([]);

	const states = {
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
	};

	useEffect(() => {
		checkIfWalletIsConnected(setCurrentAccount, setNetwork);
	}, []);

	useEffect(() => {
		if (network === 'Sepolia') {
			fetchMints(setMints);
		}
	}, [currentAccount, network]);

	return (
		<div className="App">
			<div className="container">
				<TopContextProvider value={states}>
					<Header />
					{currentAccount
						? <InputForm />
						: <NotConnectedContainer />
					}
					{mints && <Mints />}
					<Footer />
				</TopContextProvider>
			</div>
		</div>
	);
};

export default App;
