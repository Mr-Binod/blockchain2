import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './table/user.model';
import { isError } from 'ethers';

@Injectable()
export class ModelService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) {  console.log(' service')}

    async createUser(user: string, 
        account: string, 
        balance: number,
        privateKey : string,
        publicKey : string
    ){
        try {
            // console.log(user, account, balance, privateKey, publicKey,'eee')
            const check = await this.userModel.create({user, account, balance, privateKey, publicKey})
            // console.log(check,'22')
             return check
        } catch (error) {
            console.log(error, '123')
        }
    }

    async getUser(id : string) {
        try {
            
            const data = await this.userModel.findOne({
                where : {user : id}
            })
            console.log(data?.dataValues, 'findone')
            const Data = data?.dataValues
            return { data : Data}
        } catch (error) {
            return ({data : error})
        }
    }
    async getAllusers() {
        try {
            const data = await this.userModel.findAll()
            const result = data.map((el) => el.dataValues)
            console.log(result)
            return result
        } catch (error) {
            console.log(isError)
        }
    }

    async Update(id : number, balance: number) {
        try {
            const data = await this.userModel.update({balance}, {where : {id}})
            return data
        } catch (error) {
            return error
        }
    }
}
