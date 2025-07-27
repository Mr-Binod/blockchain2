import { IsString,  } from "class-validator"

export class CreateAccountDto {
    @IsString()
    id: string;

    @IsString()
    userpw: string;

    @IsString()
    email: string;

    @IsString()
    salt: string;
    
    @IsString()
    domain: string;

}
