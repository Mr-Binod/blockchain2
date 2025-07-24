const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAllModule", (m) => {
//   const bingtoken = m.contract("Bingtoken", [
//     "Bing Token",  // name
//     "BING"         // symbol
//   ]);

//   const bingNFT = m.contract("BingNFT");

  

//     const metaTransaction = m.contract("MetaTransaction", [bingtoken]);
//     const metaBingNFT = m.contract("MetaBingNFT", [bingNFT]);

    const payMaster = m.contract("PayMaster", ["0xf4AeB6f0666B7e5DB603Edd05C0A2D0cE7ce7d09","0x7D45612C65b4a4EdA42060c9aA1C21Eb552ED77A"])
    // const entryPoint = m.contract("EntryPoint")
    // const smartFactory = m.contract("SmartFactory", [entryPoint])
    // const smartAcc = m.contract("SmartFactory", [entryPoint])

    return { payMaster };
    // return { entryPoint, smartFactory };
    // return { bingNFT, bingtoken, metaTransaction, metaBingNFT };
  

});