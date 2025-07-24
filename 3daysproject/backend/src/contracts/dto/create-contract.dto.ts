import { IsNumber, IsString } from "class-validator";

export class CreateContractDto {
    @IsString()
    userid : string;

    @IsNumber()
    nftid : number;

    @IsNumber()
    nftidToken : number;

    @IsString()
    nftUridata : string
}
