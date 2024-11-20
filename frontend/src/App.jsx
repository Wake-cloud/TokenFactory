import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenType, setTokenType] = useState('ERC20'); // Default is ERC20
  const [creationFee, setCreationFee] = useState('');
  const [error, setError] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const contractAddressOnPolygon = '0x1DB1bF7996aE29D655C0C9a77c9F2497EC05E1ce'; // Replace with the TokenFactory contract address
  const contractABI = [ {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "name": "ERC20Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "name": "ERC721Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "name": "createERC20",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "name": "createERC721",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creationFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
      }
    ],
    "name": "setCreationFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ... (rest of the ABI, same as your original code)
  ];

  // Using the correct provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);  // Correct instantiation
  const contract = new ethers.Contract(contractAddressOnPolygon, contractABI, provider);

  // Fetching the creation fee on initial load
  useEffect(() => {
    const fetchCreationFee = async () => {
      try {
        const fee = await contract.creationFee();
        // Ensure fee is a valid number/string
        setCreationFee(ethers.utils.formatEther(fee)); // Format the fee from wei to ether
      } catch (err) {
        console.error(err);
        setError('Failed to get creation fee');
      }
    };

    fetchCreationFee();
  }, [contract]); // Fetch once on component mount

  const connectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
      setError('Failed to connect wallet');
    }
  };

  const createToken = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      setError('Please connect your wallet first.');
      return;
    }
  
    const name = e.target.name.value;
    const symbol = e.target.symbol.value;
    const supplyInput = e.target.supply.value;
    const description = e.target.description.value;
    const imageUrl = e.target.imageUrl.value;
  
    // Ensure supply is not empty and is a valid number
    if (!supplyInput || isNaN(supplyInput) || Number(supplyInput) <= 0) {
      setError('Please enter a valid token supply (positive number)');
      return;
    }
  
    // Convert supply input to a valid unit (18 decimals)
    const supply = ethers.utils.parseUnits(supplyInput, 0);
  
    // Ensure creationFee is properly set and is not empty
    if (!creationFee || isNaN(Number(creationFee))) {
      setError('Invalid creation fee.');
      return;
    }
  
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
  
      let tx;
      if (tokenType === 'ERC20') {
        tx = await contractWithSigner.createERC20(name, symbol, supply, description, imageUrl, {
          value: ethers.utils.parseEther(creationFee), // Use parsed creation fee
        });
      } else {
        tx = await contractWithSigner.createERC721(name, symbol, description, imageUrl, {
          value: ethers.utils.parseEther(creationFee), // Use parsed creation fee
        });
      }
  
      console.log('Transaction sent! Waiting for confirmation...');
      const receipt = await tx.wait();
  
      // Debugging: Log the full receipt to check the structure of events
      console.log('Transaction Receipt:', receipt);
  
      let tokenAddress;
      if (receipt.events && receipt.events.length > 0) {
        const event = receipt.events.find(event => event.event === 'ERC20Created' || event.event === 'ERC721Created');
        if (event) {
          tokenAddress = event.args.tokenAddress;
          console.log('Token created! Contract Address:', tokenAddress);
        }
      }
  
      if (!tokenAddress && receipt.contractAddress) {
        tokenAddress = receipt.contractAddress;
        console.log('Token created! Contract Address (from receipt):', tokenAddress);
      }
  
      if (tokenAddress) {
        setContractAddress(tokenAddress);
      } else {
        setError('Token address not found in transaction receipt.');
      }
    } catch (err) {
      console.error(err);
      setError('Error creating token');
    }
  };

  return (
    <div>
      <h1>Create Your Token</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        {walletAddress && <p>Connected wallet: {walletAddress}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={createToken}>
          <div>
            <label>Token Type</label>
            <select onChange={(e) => setTokenType(e.target.value)} value={tokenType}>
              <option value="ERC20">ERC20</option>
              <option value="ERC721">ERC721</option>
            </select>
          </div>
          <div>
            <label>Name</label>
            <input type="text" name="name" required />
          </div>
          <div>
            <label>Symbol</label>
            <input type="text" name="symbol" required />
          </div>
          <div>
            <label>Supply</label>
            <input type="number" name="supply" required />
          </div>
          <div>
            <label>Description</label>
            <input type="text" name="description" required />
          </div>
          <div>
            <label>Image URL</label>
            <input type="text" name="imageUrl" required />
          </div>
          <button type="submit">Create Token</button>
        </form>
        {contractAddress && <p>Token Created! View it in your wallet: {contractAddress}</p>}
      </div>
    </div>
  );
};

export default App;
