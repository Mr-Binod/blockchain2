import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NftUriEntity } from './entities/nft-uri.entity';
import { UserNftEntity } from './entities/user-nft.entity';
import { SellNftDto } from './dto/sellnft.dto';
import { SellNftEntity } from './entities/sell-nft.entity';
import { BuyCancelNftDto } from './dto/buy-cancel.dto';
import { ethers } from 'ethers';
import NftABI from '../abi/BingNFT.json'
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { NftUriDto } from './dto/nft-uri.dto';
import { createNftUriDto } from './dto/createnft.dto';
import { BuynftDto } from './dto/Buynft.dto';


@Injectable()
export class ContractsService {

  private readonly provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/c36ac18d957a4f46aa6b893c058c4bbd")
  private readonly PayMasterprivateKey = `1bb48ef643ede40a87a2b32be5d9c11a0192490d94105dc6f81c0ae102dda212`
  private readonly paymasterWallet = new ethers.Wallet(this.PayMasterprivateKey, this.provider)
  private readonly PayMasterNftContract = new ethers.Contract("0x5e903511eda543fDe22845635764Dcd4802A67A6", NftABI.abi, this.paymasterWallet)
  // private paymasterWallet: ethers.Wallet;

  constructor(
    @InjectRepository(UserNftEntity)
    private readonly userNftEntity: Repository<UserNftEntity>,

    @InjectRepository(SellNftEntity)
    private readonly sellNftEntity: Repository<SellNftEntity>,

    @InjectRepository(NftUriEntity)
    private readonly nftUriEntity: Repository<NftUriEntity>,
  ) { }
  async create(_data: CreateContractDto) {
    const { nftid, nftidToken, nftUridata } = _data;
    try {
      const result = this.nftUriEntity.create({ nftid, TotalNftidTokenAmt: nftidToken, nftUridata })
      await this.nftUriEntity.save(result)
      const data = this.userNftEntity.create(_data)
      return { state: 200, message: await this.userNftEntity.save(data) }
    } catch (error) {
      throw new Error('failed to create contracts')
    }
  }

  async ContractCreateSell(_data: SellNftDto) {
    console.log(_data)
    const { smartAccAddress: sender, nftid, nftidTokenAmt: token, price } = _data;
    console.log('GG', sender, nftid, token, price)
    const data = await this.PayMasterNftContract.SellNFT(sender, BigInt(nftid), BigInt(token), BigInt(price))
    await data.wait()
    return { state: 201, message: data }
  }

  async CancelContractNft(data: BuyCancelNftDto) {
    try {
      console.log('connected', data)
      const { smartAccAddress, nftid } = data;
      const result = await this.PayMasterNftContract.cancelSale(BigInt(nftid), smartAccAddress)
      await result.wait()
      return { state: 200, message: result }
    } catch (error) {
      throw new Error('Failed to delete from sellnft contract' + error)
    }
  }

  async ContractBuyNft(data: BuynftDto) {
    try {
      const { userid, sender, receiver, nftid, nftUridata, nftidToken, price } = data;
      const result = await this.PayMasterNftContract.BuyNFT(sender, receiver, nftid, price)
      await result.wait()
      return { state: 201, message: result }
    } catch (error) {
      return { state: 405, message: error }
    }
  }

  async createSell(_data: SellNftDto) {
    try {
      const result = this.sellNftEntity.create(_data)
      await this.sellNftEntity.save(result)
      console.log(result)
      const result2 = await this.PatchSubNft(_data)
      return { state: 200, message: result }
    } catch (error) {
      throw new Error('failed creating sell request')
    }
  }

  async getUserNfts(userid: string) {
    try {
      const data = await this.userNftEntity.find({ where: { userid } })
      console.log(data)
      return { state: 200, message: data }
      // return `This action returns a #${id} contract`;
    } catch (error) {
      return { state: 405, message: 'usernft' + error }
    }
  }

  async CreateNFT(_data: createNftUriDto) {
    // this.paymasterWallet = new ethers.Wallet(this.PayMasterprivateKey, this.provider)
    const { Uri, address } = _data;
    try {
      const data = await this.PayMasterNftContract.settokenURI(Uri, address)
      await data.wait();
      console.log('GG3', data)
      return { state: 200, message: 'successfuly minted nft' }
    } catch (error) {
      return { state: 404, message: error }
    }
  }

  async CreateNftdb(_data: NftUriDto) {
    try {
      const data = this.nftUriEntity.create(_data);
      return { state: 200, message: data }
    } catch (error) {
      return { state: 405, message: error }
    }
  }

  async createUserNft(_data: CreateContractDto) {

    try {
      console.log('GGG')
      const data = this.userNftEntity.create(_data)
      const result = await this.userNftEntity.save(data)
      return { state: 200, message: { data: result } }
    } catch (error) {
      return { state: 405, message: error }
    }
  }

  async getSellNft() {
    try {
      return { state: 200, message: await this.sellNftEntity.find() }
    } catch (error) {
      return { state: 405, message: 'getsellnft Error' + error }
    }
  }

  async findOneSellitem(userid: string, nftid: number) {
    try {
      return {
        state: 200, message: await this.sellNftEntity.findOne({
          where: {
            userid,
            nftid
          }
        })
      }
    } catch (error) {
      return { state: 405, message: 'findonesellitem error ' + error }
    }
  }

  update(id: number, _data: UpdateContractDto) {
    try {
      const data = UserNftEntity
    } catch (error) {

    }
    return `This action updates a #${id} contract`;
  }

  async delete(data: BuyCancelNftDto) {
    try {
      return { state: 200, message: await this.sellNftEntity.delete(data) }
    } catch (error) {
      throw new Error('Failed to delete from sellnft')
    }
  }


  async PatchSubNft(data: SellNftDto) {
    try {
      console.log(data)
      const { userid, nftid, nftidTokenAmt: amt } = data;
      console.log(userid, nftid, amt, 'patch')
      const result = await this.userNftEntity.decrement({ userid, nftid },
        'nftidToken',
        amt
      )
      return result;
    } catch (error) {
      throw new Error('error patching sellnft')
    }
  }



  async CancelSellNft(data: CreateContractDto) {
    const { userid, nftid, nftidToken, nftUridata } = data;
    // const newdata = { userid, nftid, nftidToken, nftUridata }
    try {
      const result = await this.userNftEntity.increment({ userid, nftid },
        'nftidToken',
        nftidToken
      )
      return { state: 202, message: result }
    } catch (error) {
      throw new Error('error patching sellnft')
    }
  }
  async UpdateNft(data: BuynftDto) {
    const { userid, nftid, nftidToken, nftUridata } = data;
    // const newdata = { userid, nftid, nftidToken, nftUridata }
    try {
      console.log(data)
      console.log(userid, nftid, nftidToken, nftUridata, 'patch')
      const result = await this.userNftEntity.increment({ userid, nftid },
        'nftidToken',
        nftidToken
      )
      if (result.affected && result.affected > 0) {
        console.log(result, 'ss')
        return { state: 202, message: result }
      }
      else {
        const result = this.userNftEntity.create({ userid, nftid, nftidToken, nftUridata })
        await this.userNftEntity.save(result)
        console.log(result, 'zz')
        return { state: 203, message: result }
      }
    } catch (error) {
      return ({state : 405, messate :'error patching sellnft' + error})
    }
  }


}
