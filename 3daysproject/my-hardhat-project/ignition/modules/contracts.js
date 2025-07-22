const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAllModule", (m) => {
//   const bingtoken = m.contract("Bingtoken", [
//     "Bing Token",  // name
//     "BING"         // symbol
//   ]);

//   const bingNFT = m.contract("BingNFT");

  

//     const metaTransaction = m.contract("MetaTransaction", [bingtoken]);
//     const metaBingNFT = m.contract("MetaBingNFT", [bingNFT]);

    const payMaster = m.contract("PayMaster", ["0xa46f8B3CEC59D6fFc20f45B5A8aF0E7Bd396Bc8F","0x7D45612C65b4a4EdA42060c9aA1C21Eb552ED77A"])
    // const entryPoint = m.contract("EntryPoint")
    // const smartFactory = m.contract("SmartFactory", [entryPoint])
    // const smartAcc = m.contract("SmartFactory", [entryPoint])

    return { payMaster };
    return { entryPoint, smartFactory };
    return { bingNFT, bingtoken, metaTransaction, metaBingNFT };
  

});