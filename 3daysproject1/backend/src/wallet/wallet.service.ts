import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from "fs";
import { ec as EC } from "elliptic";
import { IWallet } from 'src/wallet/wallet.interface';
import { randomBytes } from 'crypto';


const dir = path.join(__dirname, "..", "./walletdata");
// console.log(EC, 's', dir)
const ec = new EC("secp256k1");

if (!fs.existsSync(dir)) {
    // console.log('check')
    fs.mkdirSync(dir, { recursive: true })
}

@Injectable()
export class WalletService implements IWallet {
    user: string;
    account: string;
    privateKey: string;
    publicKey: string;
    balance: number;
    // constructor(privateKey : string = "") {
    constructor() {
        // this.privateKey = privateKey || this.setPrivateKey();
        
        this.privateKey = this.setPrivateKey();
        this.publicKey = this.setPublicKey();
        this.account = this.setAccount();
        this.balance = 0;
        // if(privateKey === '') {
        //     WalletService.createWallet(this);
        // }
        if (this.user) {
            WalletService.createWallet(this);
        }
    }
    init(user : string) {
        this.user = user;
    }
    static createWallet(wallet: WalletService) {
        const filepath = path.join(dir, wallet.account);
        fs.writeFileSync(filepath, wallet.privateKey);
        console.log('created')
    }
    getWallets(): string[] {
        const Wallets: string[] = fs.readdirSync(dir);
        return Wallets;
    }
    getWallet(): string[] {
        const Wallets: string[] = fs.readdirSync(dir);
        const userWallet = Wallets.filter(el => this.account)
        // console.log(userWallet)

        return userWallet;
    }

    setPrivateKey(): string {
        return randomBytes(32).toString("hex");
    }

    setPublicKey(): string {
        const keyPair = ec.keyFromPrivate(this.privateKey)
        const newkeyPair = keyPair.getPublic().encode("hex", true)
        return newkeyPair
    }
    setAccount(): string {
        return this.publicKey.slice(26);
    }
}
