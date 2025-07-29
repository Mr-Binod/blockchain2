const {ethers} = require('ethers')
require("dotenv").config();


const SepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC)
const PolygonProvider = new ethers.JsonRpcProvider(process.env.KAIA_RPC)

const SepoliaWallet = new ethers.Wallet(process.env.SPOLIA_PKEY, SepoliaProvider)
const KaiaWallet = new ethers.Wallet(process.env.KAIA_PKEY, PolygonProvider)

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

const lockContract = new ethers.Contract(process.env.LOCK_CA, LockABI, SepoliaProvider)
const wrappedTokenContract = new ethers.Contract(process.env.WETH_KAIA_CA, WrappedTokenABI, KaiaWallet)

const init = async () => {
    const SepoliaValue = await SepoliaProvider.getBalance(SepoliaWallet.address)
    const KaiaValue = await PolygonProvider.getBalance(KaiaWallet.address)

    console.log(`Sepolia : ${ethers.formatEther(SepoliaValue)}`)
    console.log(`Polygon : ${ethers.formatEther(KaiaValue)}`)

    lockContract.on('Locked', async (account, value) => {
        console.log('입금 이벤트 호출')
        console.log(`계정 : ${account}`)
        console.log(`wETH : ${value}`)
        // 폴리곤 네트워크에 mint wEth
        // wETH 토큰을 생서하는 CA 는 정해

        // const balance = ethers.formatEther(value)
        await wrappedTokenContract.mint(account, value);
        console.log('zz')
    })
}

init()

