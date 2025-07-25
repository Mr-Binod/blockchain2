const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAllModule", (m) => {
  // const bingtoken = m.contract("Bingtoken", [
  //   "Bing Token",  // name
  //   "BING"         // symbol
  // ]);

  const bingNFT = m.contract("BingNFT");

  

    // const metaTransaction = m.contract("MetaTransaction", [bingtoken]);
    // const metaBingNFT = m.contract("MetaBingNFT", [bingNFT]);
    // return { bingNFT, bingtoken, metaTransaction, metaBingNFT };
    return { bingNFT};
  

});