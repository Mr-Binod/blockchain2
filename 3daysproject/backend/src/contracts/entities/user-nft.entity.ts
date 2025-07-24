import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserNftEntity {
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column()
    userid : string;

    @Column()
    nftid : number;

    @Column()
    nftidToken : number;

    @Column()
    nftUridata : string;
}
