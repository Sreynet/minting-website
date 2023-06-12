import { useState } from 'react'
import './App.css'
import NavBar from './NavBar'
import MainMint from './MainMint'
import { CrossmintPaymentElement } from '@crossmint/client-sdk-react-ui'
import {
    ThirdwebProvider,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    ConnectWallet,
    ClaimEligibility,
} from '@thirdweb-dev/react'
import { LightMode } from '@chakra-ui/react'

/*const App = () => {
  return (
    <ThirdwebProvider activeChain="ethereum">
      <App />
    </ThirdwebProvider>
  );
};
*/

function App() {
    const [accounts, setAccounts] = useState([])

    return (
        <ThirdwebProvider
            activeChain="goerli"
            supportedWallets={[
                metamaskWallet(),
                coinbaseWallet(),
                walletConnect(),
            ]}
            autoConnect={false}
            dAppMeta={{
                name: 'Redline Collective',
                description: 'Redline Collective NFT',
                logoUrl: 'https://example.com/logo.png', //need to change
                url: 'https://example.com', //need to change
                isDarkMode: true,
            }}
        >
            <div className="overlay">
                <div className="App">
                    <div className="button">
                        <ConnectWallet
                            auth={{
                                onLogin: () => {
                                    console.log('logged in')
                                },
                            }}
                        />
                    </div>
                    <NavBar accounts={accounts} setAccounts={setAccounts} />
                    <MainMint accounts={accounts} setAccounts={setAccounts} />
                </div>
                <div className="moving-background"></div>
            </div>
        </ThirdwebProvider>
    )
}

export default App
