const {ethers} = require("ethers");



const wallet = ethers.Wallet.createRandom();

console.log('주소 :', wallet.address)
console.log('개인키 :', wallet.privateKey)

// 메시지를 만들어서 내가 했어요 증명

const message = '나야';
const signature = wallet.signMessageSync(message);
console.log(signature);

// 너가 한게 맞나?
const recovered = ethers.verifyMessage(message, signature)
console.log(recovered)

// 공개키가 있어야 이사람이 특정이 된다. r s v 를 쪼개서 공개키를 복원하는 알고리즘 사용해서 공개키 복원

//  