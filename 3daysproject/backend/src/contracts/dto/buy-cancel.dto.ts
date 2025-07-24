import { IsNumber, IsString } from "class-validator";

export class BuyCancelNftDto {

    @IsString()
    smartAccAddress : string;

    @IsNumber()
    nftid : number;

}