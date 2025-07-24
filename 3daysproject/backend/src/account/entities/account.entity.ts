import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SmartAccInfoEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    user : string;
    
    @Column()
    UserAddress : string;

    @Column()
    smartAcc : string;

    @Column()
    privateKey : string;

    @Column()
    checkWhitelist : boolean;
}
