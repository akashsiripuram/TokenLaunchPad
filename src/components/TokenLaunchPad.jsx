import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";

export function TokenLaunchpad() {
  const [formData, setFormData] = useState({
    Name: "",
    Symbol: "",
    ImageURL: "",
    InitialSupply: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const wallet=useWallet();
  const {connection}=useConnection();
  async function handleCreate() {
    console.log("Creating token with:", formData);
    // Add your token creation logic here
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId:TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keypair.publicKey,
        6,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    transaction.feePayer=wallet.publicKey;
    const recent=(await connection.getLatestBlockhash()).blockhash;
    transaction.recentBlockhash=recent;
    transaction.partialSign(keypair);
    const res=await wallet.sendTransaction(transaction,connection);
    console.log(res);
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
      <h1>Solana Token Launchpad</h1>
      <input
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
      <br />
      <button className="btn" onClick={handleCreate}>
        Create a token
      </button>
    </div>
  );
}
