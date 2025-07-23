import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ethers, keccak256, solidityPacked } from 'ethers';
import { createPvtKey } from './utils/PvtKeyGen';
import FactoryAbi from "../abi/SmartFactory.json"

@Injectable()
export class AccountService {

  private readonly logger = new Logger('AccountService');
  private readonly provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/c36ac18d957a4f46aa6b893c058c4bbd")
  private readonly FactoryAcc = "0x469e7B537920e7893B4b51cBBe7b00548BFCb8b0";
  private readonly FactoryContract = new ethers.Contract(this.FactoryAcc, FactoryAbi.abi, this.provider )
  

  async createAcc(data: CreateAccountDto) {
    const privateKey = createPvtKey(data)
    const wallet = new ethers.Wallet(privateKey, this.provider)
    const owner = wallet.address;
    console.log("owner")
    const tx = await this.FactoryContract.createAcc(owner);
    const result = await tx.wait();

    const smartAcc = await this.FactoryContract.getAccount(owner)

    this.logger.log(`Wallet Address: ${wallet.address}`);
    this.logger.log(`Private Key :  ${wallet.privateKey}`)
    this.logger.log(`Transaction hash : ${result.hash}` )
    this.logger.log(`Smart Account : ${smartAcc}` )
    return( "smartAcc")
  }

  getAcc() {
    return('hi')
  }
}

// DeployAllModule#EntryPoint - 0xa46f8B3CEC59D6fFc20f45B5A8aF0E7Bd396Bc8F
// DeployAllModule#SmartFactory - 0x469e7B537920e7893B4b51cBBe7b00548BFCb8b0

// DeployAllModule#PayMaster - 0x563cb9a834487126cbEbdF40b002485C3adda463