export class CreateBundlerDto {
    sender: string;
    nonce: bigint;
    initCode: string;
    callData: string;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preverificationGas: bigint;
    maxFeePerGas: bigint;
    maxPrioityFeePerGas: bigint;
    paymasterAndData: string;
    signature: string;
}
