import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NftUriEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    nftid : number;

    @Column()
    TotalNftidTokenAmt : number;

    @Column()
    nftUridata : string;
}
