import { WalletModalProvider,WalletMultiButton,WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletProvider,ConnectionProvider } from "@solana/wallet-adapter-react";
import { TokenLaunchpad } from "./components/TokenLaunchPad";
function App() {
  
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-row justify-between px-4 min-w-screen">
            <WalletMultiButton/>
            <WalletDisconnectButton/>
          </div>
          
          <TokenLaunchpad/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
