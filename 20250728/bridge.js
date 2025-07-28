const {ethers} = require('ethers')
require("dotenv").config();


const SepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC)
const PolygonProvider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC)

const SepoliaWallet = new ethers.Wallet(process.env.SPOLIA_PKEY, )
const PolygonWallet = new ethers.Wallet(process.env.POLYGON_AMOY_PKEY)


const init = async () => {
    const SepoliaValue = await SepoliaProvider.getBalance(SepoliaWallet.address)
    const PolygonValue = await PolygonProvider.getBalance(PolygonWallet.address)

    console.log(`Sepolia : ${ethers.formatEther(SepoliaValue)}`)
    console.log(`Polygon : ${ethers.formatEther(PolygonValue)}`)
}

init()

