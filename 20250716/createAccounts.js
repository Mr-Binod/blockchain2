const {ethers, keccak256, toUtf8Bytes, solidityPacked} = require('ethers')



// remixd -s . -u https://remix.ethereum.org/

// 0xe590A7209bA648cF227dA74c35260a8ec70793DE

// 소셜 => web3Auth => 소셜로그인하면 값ㅇ르 가지고 비밀키를 생성
// 개인키를 만들어서 사용
// web3Auth => 도메인, salt  oauth, naver, google

const createPrivateKey = (email, salt, domain) => {
    const id = `${domain}:${email}`; // 이메일을 사용하는 해당 사이트와 이메일의 내용

    // 키의 길이를 제안하고 salt를 합해서 해시 문자열로 변환
    // 개인키로 사용하기 위해서 길이를 고정길이로 자른다
    const value = solidityPacked(["string", "string"], [salt, id]).slice(0, 64);

    // 개인키의 해시 문자열 생성
    const privateKey = keccak256(value).replace("0x", "").slice(0, 64); 
    return `0x${privateKey}`
}

const email = "123@gmail.com";
const privateKey = createPrivateKey(email, "soon", "google");

const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/e7468d2d517b4aa28ba51a6e589558e2")

const wallet = new ethers.Wallet(privateKey, provider);

(async () => {
    const balance = await provider.getBalance(wallet)
    const newbalance = ethers.formatEther(balance) 
    console.log("잔액", newbalance);
})()

console.log("주소", wallet.address);

console.log("개인키", wallet.privateKey);

const ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "createAccount",
		"outputs": [
			{
				"internalType": "address",
				"name": "smartAccount",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
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
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getAccount",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const CA = "0xe590A7209bA648cF227dA74c35260a8ec70793DE"

const factory = new ethers.Contract(CA, ABI, wallet)

const createSmartAccount = async () => {
    const owner = wallet.address;
    const transaction = await factory.createAccount(owner);
    const result = await transaction.wait();
    console.log("tx hash : ", result.hash  )

    // smart account inquire
    const smartAccount = await factory.getAccount(owner);
    console.log("smart account", smartAccount)
}
createSmartAccount();