const {expect} = require("chai");
// chai 테스트할때 조건 검증 메서드를 제공하는 라이브러리

// ethers 
const {ethers} = require("hardhat");

describe('project test', () => {
  let owner;
  let address;

  beforeEach(async () => {
    // console.log(await ethers.getSigners())
    [owner, address] = await ethers.getSigners();
    console.log(owner)
  })
})

// remixd -s . -u https://remix.ethereum.org