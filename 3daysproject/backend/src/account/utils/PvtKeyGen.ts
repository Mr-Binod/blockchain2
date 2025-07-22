import { keccak256, solidityPacked } from "ethers";
import { CreateAccountDto } from "../dto/create-account.dto";

export const createPvtKey = (data : CreateAccountDto) => {
    const id = `${data.domain}:${data.email}`;
    const value = solidityPacked(["string","string"], [data.salt, id]).slice(0, 64);
    const privateKey = keccak256(value).replace("0x", "").slice(0, 64);
    return `0x${privateKey}`
  }