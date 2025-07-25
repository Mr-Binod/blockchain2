import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table
export class User extends Model {
    // @PrimaryKey
    @Column
    user : string;

    @Column
    account : string;

    @Column
    balance : number;
    
    @Column
    privateKey : string;

    @Column
    publicKey : string;
}

