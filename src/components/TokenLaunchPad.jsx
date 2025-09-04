import {
  createInitializeInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createUpdateFieldInstruction, pack } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "sonner";
export function TokenLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    uri: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  async function handleCreate() {
    if (!formData.name || !formData.symbol || !formData.uri) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const mint = Keypair.generate();

      const metadata = {
        mint: mint.publicKey,
        name: "Test Token",
        symbol: "TST",
        uri: "https://fastly.picsum.photos/id/137/200/200.jpg?hmac=qhNK8PzcRQJaCJlGEj1q5ceRIkKkfPmVuOwE5ZInXA8",
        additionalMetadata: [],
      };

      // Size of Mint Account with extensions
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);

      // Size of the Metadata Extension
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      // Minimum lamports required for Mint Account
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      });

      const initializeMetadataPointer =
        createInitializeMetadataPointerInstruction(
          mint.publicKey,
          wallet.publicKey,
          mint.publicKey,
          TOKEN_2022_PROGRAM_ID
        );

      const initializeMintInstruction = createInitializeMintInstruction(
        mint.publicKey,
        6,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      );

      const initializeMetadataInstruction = createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mint.publicKey,
        metadata: mint.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      });

      const updateMetadataFieldInstructions = createUpdateFieldInstruction({
        metadata: mint.publicKey,
        updateAuthority: wallet.publicKey,
        programId: TOKEN_2022_PROGRAM_ID,
      });

      const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMetadataPointer,
        initializeMintInstruction,
        initializeMetadataInstruction,
        updateMetadataFieldInstructions
      );
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mint);

      const signature = await wallet.sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");

      console.log(`Token mint created at ${mint.publicKey.toBase58()}`);
      toast.success(
        `Token created successfully! Mint address: ${mint.publicKey.toBase58()}`
      );
    } catch (error) {
      toast.error(`Error creating token: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Solana Token Launchpad
      </h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Token Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Enter token name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Symbol
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Enter token symbol"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Image URI
          </label>
          <input
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
            placeholder="Enter image URI"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Token"}
        </button>
      </div>
    </div>
  );
}
