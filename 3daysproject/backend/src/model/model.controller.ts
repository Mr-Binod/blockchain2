import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ModelService } from './model.service';
import { IWallet } from 'src/wallet/wallet.interface';
import { where } from 'sequelize';


@Controller()
export class ModelController {
    constructor(private readonly modelService: ModelService) { }

    @Post('model')
    async createUser(@Body() body: { wallet: IWallet, Userbalance : number }) {
        const { wallet, Userbalance } = body;
        const { user, account, privateKey, publicKey } = wallet;
        console.log(wallet, 'model', user, account,  privateKey, publicKey)
        // const balance = Userbalance;
        return await this.modelService.createUser(user, account, Userbalance, privateKey, publicKey)
    }

    @Get("model/:id")
    async getUser(@Param('id') id:string ){
        console.log(id, 'id11')
        return await this.modelService.getUser(id);
    }
    @Get("models")
    async getAllusers(){
        return await this.modelService.getAllusers();
    }
    
    @Patch('model')
    async patchBalance(@Body() body : {id : number, balance : number}) {
        const {balance, id} = body;
        console.log(body, '1111')
        return await this.modelService.Update( id, balance)
    }
}
