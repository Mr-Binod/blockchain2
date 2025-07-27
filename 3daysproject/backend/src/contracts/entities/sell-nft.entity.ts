import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SellNftEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    userid : string;
   
    @Column()
    smartAccAddress : string;

    @Column()
    nftid : number;

    @Column()
    nftidTokenAmt : number;

    @Column()
    price : number;

    @Column()
    nftUridata : string;
}