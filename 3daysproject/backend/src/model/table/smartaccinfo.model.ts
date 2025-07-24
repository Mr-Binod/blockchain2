import { Model } from "sequelize";
import { Column, Table } from "sequelize-typescript";


@Table
export class SmartAccInfo extends Model {

    @Column
    user : string;
    
    @Column
    UserAddress : string;

    @Column
    smartAcc : string;

    @Column
    privateKey : string;

    @Column
    checkWhitelist : boolean;

    
}