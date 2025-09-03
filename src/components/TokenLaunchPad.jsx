import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export function TokenLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();
  async function handleCreate() {
    const mintKeyPair = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeyPair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mintKeyPair.publicKey,
        9,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeyPair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintKeyPair.publicKey.toBase58()}`);
   
  }
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      {/* <input
        className="inputText"
        type="text"
        name="Name"
        placeholder="Name"
        value={formData.Name}
        onChange={handleChange}
      />
      <br />
      <input
        className="inputText"
        type="text"
        name="Symbol"
        placeholder="Symbol"
        value={formData.Symbol}
        onChange={handleChange}
      />
      <br />
      <input
        className="inputText"
        type="text"
        name="ImageURL"
        placeholder="Image URL"
        value={formData.ImageURL}
        onChange={handleChange}
      />
      <br />
      <input
        className="inputText"
        type="text"
        name="InitialSupply"
        placeholder="Initial Supply"
        value={formData.InitialSupply}
        onChange={handleChange}
      />
      <br /> */}
      <button className="btn" onClick={handleCreate}>
        Create a token
      </button>
    </div>
  );
}
