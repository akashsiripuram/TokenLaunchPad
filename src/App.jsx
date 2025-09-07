import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { TokenLaunchpad } from "./components/TokenLaunchPad";
import { Toaster } from 'sonner';

function App() {
  return (
    <ConnectionProvider endpoint={"https://api.mainnet-beta.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-row justify-between py-6">
                <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700"/>
                <WalletDisconnectButton className="!bg-red-600 hover:!bg-red-700"/>
              </div>
              <TokenLaunchpad/>
            </div>
          </div>
          <Toaster position="top-center" theme="dark" />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App