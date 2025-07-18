const express = require("express");
const {ethers, Wallet} = require("ethers");

const cors = require("cors")


const app = express();
app.use(cors());
app.use(express.json());


let txpool = [];

// 대남자 계정 주소
const pk = "0xfbc1960a886986637345636605e54f7f7e54d1b36f92ee1ec44c77820c444a17";
const abi = [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_CA",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "address[]",
						"name": "accounts",
						"type": "address[]"
					},
					{
						"internalType": "uint256[]",
						"name": "tokens",
						"type": "uint256[]"
					},
					{
						"internalType": "string[]",
						"name": "messages",
						"type": "string[]"
					},
					{
						"internalType": "bytes[]",
						"name": "signature",
						"type": "bytes[]"
					}
				],
				"name": "mint",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]

app.get("/txPools", (req, res) => {
    res.json(txpool)
})

// 트랜잭션 요천 대납자가 처리해줄 유저들의 트랜잭션 호출 api
app.post("/tx/create", async (req, res) => {
    const {message, signature} = req.body;
    // {address : "0x13as5fdd13saf1", token : 3}
    const senderSigner = ethers.verifyMessage(JSON.stringify(message), signature);
    // 서명 검증
    if(message.sender === senderSigner) {
        txpool.push({message, signature});
        res.json("트랜잭션 풀 생성")
    }
    else res.json("서명 검증 실패");
} )

// 대납자가 트랜잭션 처리
app.post("/metaTransaction", async (req, res) => {
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/e7468d2d517b4aa28ba51a6e589558e2")
    const wallet = new ethers.Wallet(pk, provider);
    // 컨트랙트 
    const contract = new ethers.Contract("0xF6F6a1376345E4122B7BAF9301630f079255E838", abi, provider);
    
    // 컨트랙트 지갑 서명자 추가
    const signerContract = contract.connect(wallet);

    // 컨트랙트에서 호출할 배열의 내용을 파싱
    const _txpool = txpool.reduce((acc, el) => {
        acc.address.push(el.message.sender);
        acc.data.push(el.message.data);
        acc.msg.push(JSON.stringify(el.message));
        acc.sign.push(el.signature);
        return acc;
    }, {address : [], data : [], msg : [], sign : []})

    const tx = await signerContract.mint(_txpool.address, _txpool.data, _txpool.msg, _txpool.sign)
    // 대납자가 가스비 지불
    console.log(_txpool, "txpool")
    await tx.wait();
    txpool = [];
    res.send(tx)
})

// remixd -s . -u https://remix.ethereum.org/

app.listen(3002, () => {
    console.log("server on~");
})