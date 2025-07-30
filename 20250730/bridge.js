const {ethers} = require('ethers')
require("dotenv").config();


const SepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC)
const KaiaProvider = new ethers.JsonRpcProvider(process.env.KAIA_RPC)
const WS_KaiaProvider = new ethers.WebSocketProvider(process.env.KAIA_WS_RPC)

const SepoliaWallet = new ethers.Wallet(process.env.SPOLIA_PKEY, SepoliaProvider)
const KaiaWallet = new ethers.Wallet(process.env.KAIA_PKEY, KaiaProvider)

const LockABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Locked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "AccountLockValue",
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
		"name": "lock",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalValue",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "unlock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const WrappedTokenABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_relayer",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Burned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "relayer",
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
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const lockContract = new ethers.Contract(process.env.LOCK_CA, LockABI, SepoliaWallet)
const wrappedTokenContract = new ethers.Contract(process.env.WETH_KAIA_CA, WrappedTokenABI, KaiaWallet)
const wrappedTokenEvent = new ethers.Contract(process.env.WETH_KAIA_CA, WrappedTokenABI, WS_KaiaProvider)

const init = async () => {
    const SepoliaValue = await SepoliaProvider.getBalance(SepoliaWallet.address)
    const KaiaValue = await KaiaProvider.getBalance(KaiaWallet.address)

    console.log(`Sepolia : ${ethers.formatEther(SepoliaValue)}`)
    console.log(`Polygon : ${ethers.formatEther(KaiaValue)}`)

    lockContract.on('Locked', async (account,) => {
        console.log('입금 이벤트 호출')
        console.log(`계정 : ${account}`)
        console.log(`wETH : ${value}`)
        // 폴리곤 네트워크에 mint wEth
        // wETH 토큰을 생서하는 CA 는 정해

        // const balance = ethers.formatEther(value)
        await wrappedTokenContract.mint(account, value);
        console.log('zz')
    })

	wrappedTokenEvent.on('Burned', async (account, amount) => {
		console.log(account, amount)
		const transaction = await lockContract.unlock(account, amount)
		await transaction.wait();
		console.log('이더 송급 환료')
	})

	// const wrappedTokenContract2

	// const amount = ethers.parseEther()

	// // 소각을 호출
	// await wrappedTokenContract.burn(1000000);

	// 소각을 했으면
		// const transaction = await lockContract.unlock(KaiaWallet.address, 100000)
		// await transaction.wait();
		// console.log('transaction completed')
	}

	

init()

