import { IsNumber, IsString } from "class-validator";

export class SellNftDto {
    @IsString()
    userid : string;

    @IsString()
    smartAccAddress : string;

    @IsNumber()
    nftid : number;

    @IsNumber() 
    nftidTokenAmt : number;

    @IsNumber() 
    price : number

    @IsString()
    nftUridata : string

}