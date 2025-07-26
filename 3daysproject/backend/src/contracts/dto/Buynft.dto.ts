import { IsNumber, IsString } from "class-validator";

export class BuynftDto {
    @IsString()
    userid : string;
    
    @IsString()
    sender : string;

    @IsString()
    receiver : string;

    @IsNumber()
    nftid : number;

    @IsNumber()
    nftidToken : number;

    @IsString()
    price : string
    
    @IsString()
    nftUridata : string
}
