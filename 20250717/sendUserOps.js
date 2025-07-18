const {ethers, AbiCoder, keccak256} = require("ethers");

const privateKey = "0x5bcb970d12dff785f3e3f7669057de61c2286e60416d4855d5677c7ab301f70e";
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/c36ac18d957a4f46aa6b893c058c4bbd");
const wallet = new ethers.Wallet(privateKey, provider);

const entryPointAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"name": "UserOperationHandled",
		"type": "event"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "initCode",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "callData",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "callGasLimit",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "verificationGasLimit",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "preverificationGas",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxFeePerGas",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxPrioityFeePerGas",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "paymasterAndData",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes"
					}
				],
				"internalType": "struct EntryPoint.UserOPeration[]",
				"name": "ops",
				"type": "tuple[]"
			}
		],
		"name": "handleOps",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "nonces",
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
// 1. 엔트리포인트에 요청 userOps
// 2. 엔트리포인트 검증 로직 이후에 스마트 계정의 exeute () => 시그니처
// 3. 스마트계정의 호출 함수의 시그니처 바이트코드가 필요하다

const smartAccountAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_entryPoint",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "execute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "sig",
				"type": "bytes"
			}
		],
		"name": "isValidSignature",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
// 스마트 계정 사용자가 생성한 계정
const smartAccountAddress = "0xAf2e27F9F610e3d217747a97Ca5ca08E30555dBC"; 

// 엔트리포인트 CA
const entryPointCA = "0x2E2c43EC979C9a4d18B31435bAfbB04bCcd422Dd";

const sendEntryPoint = async () => {
    // 스마트 계정 컨트랙트
    const smartAccount = new ethers.Contract(
        smartAccountAddress,
        smartAccountAbi,
        provider
    )

    const entryPoint = new ethers.Contract(
        entryPointCA,
        entryPointAbi,
        wallet
    )

    // 이더를 다른 계정에 송금
    const reciveAccount = "0x14C10036F461183e591A0b2Ca168f4f0b72b6026";

    // 전송할 금액
    const value = ethers.parseEther("0.001");

    // calldata 스마트 계정이 호출해야하는 내용
    // abi 생성한 컨트랙트의 호출 내용 즉 바이트 코드 내용을 만드는 함수
    console.log( 'calldata')
    const callData = smartAccount.interface.encodeFunctionData("execute",
        [reciveAccount, value, "0x"]
    )

    // userops 객체 만들어서 전달
    // 작업 내용 반복 금지
    const nonce = 0n;

    const userOp = {
        sender : smartAccountAddress,
        nonce,
        initCode : "0x",
        callData,
        callGasLimit : 100000n,
        verificationGasLimit : 100000n,
        preverificationGas : 21000n,
        maxFeePerGas : ethers.parseUnits("5", "gwei"), // 전체 가스 상한을 기본가스비 + 번들러 팁
        maxPrioityFeePerGas : ethers.parseUnits("2", "gwei"), // 번들러에게 주는 가스비
        paymasterAndData : "0x",
        signature : "0x"
    }

    const userOpValues = [
        userOp.sender,
        userOp.nonce,
        userOp.initCode,
        userOp.callData,
        userOp.callGasLimit,
        userOp.verificationGasLimit,
        userOp.preverificationGas,
        userOp.maxFeePerGas,
        userOp.maxPrioityFeePerGas,
        userOp.paymasterAndData,
        userOp.signature
    ]

    const userOpTypes = [
        "address",
        "uint",
        "bytes",
        "bytes",
        "uint",
        "uint",
        "uint",
        "uint",
        "uint",
        "bytes",
        "bytes"
    ]

    // abi 바이트 코드 배열 생성
    const encoded = AbiCoder.defaultAbiCoder().encode(userOpTypes, userOpValues);

    // 바이트 배열 생성 이후 해시 함수로 해시화
    const hash = ethers.keccak256(encoded);

    // 개인키로 서명
    const sign = await wallet.signMessage(ethers.getBytes(hash));

    userOp.signature = sign;

    const userOpTuple = [];
    for (const key in userOp) {
        userOpTuple.push(userOp[key]);
    }

    console.log('touple', userOpTuple);

    const transaction = await entryPoint.handleOps([userOpTuple]);
    console.log(transaction,'tt')

    const result = await transaction.wait();
    console.log("트랜잭션 해시 : ", result.hash);
}

sendEntryPoint();