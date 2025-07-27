import { IsNumber, IsString } from "class-validator";

export class NftUriDto {
    @IsString()
    nftid : number;

    @IsNumber()
    TotalNftidTokenAmt : number;

    @IsString()
    nftUridata : string;
}