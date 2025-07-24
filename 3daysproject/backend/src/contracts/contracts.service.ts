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

@Injectable()
export class ContractsService {
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
      return await this.userNftEntity.save(data)
    } catch (error) {
      throw new Error('failed to create contracts')
    }
  }

  async createSell(_data: SellNftDto) {
    try {
      const result = this.sellNftEntity.create(_data)
      return await this.sellNftEntity.save(result)
    } catch (error) {
      throw new Error('failed creating sell request')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  delete(data: BuyCancelNftDto) {
    const { smartAccAddress, nftid } = data;
    try {
      this.sellNftEntity.delete({
        smartAccAddress,
        nftid
      })
    } catch (error) {
      throw new Error('Failed to delete from sellnft')
    }
  }
}
