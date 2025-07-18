import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"



const useEthers = ( _privateKeys ) => {
    const [user, setUser] = useState({ account: "", balance: "0" })
    const [provider, setProvider] = useState(null);
    const [pkprovider, setPkprovider] = useState([])
    const [paymaster, setPaymaster] = useState(null);

    // 개인키로 지갑 객체 생성
    useEffect(() => {
        (async () => {
        
        if (_privateKeys) {
            // infura Provider dont use metamask
            // json rpc 톤신으로 엔트포인트 공급자 생성
            // INFURA_RPC = https://sepolia.infura.io/v3/e7468d2d517b4aa28ba51a6e589558e2
            // PRIVATE_KEY = 0xfbc1960a886986637345636605e54f7f7e54d1b36f92ee1ec44c77820c444a17

            const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/e7468d2d517b4aa28ba51a6e589558e2");
            // 여러 지갑의 비동기 처리가 일어날것
            // 병렬 처리
            // provider, signer, 
            
            const promiseWallet = _privateKeys.map(async (pk) => {
                // [promise1, promise2, ..]
                const wallet = new ethers.Wallet(pk, provider);
                const balance = await provider.getBalance(wallet);
                const balanceEth = ethers.formatEther(balance);
                return {
                    wallet, 
                    balance : balanceEth, 
                    address : wallet.address 
                }
            });

            const Paymaster = new ethers.Wallet("fbc1960a886986637345636605e54f7f7e54d1b36f92ee1ec44c77820c444a17", provider)
            
            setPaymaster(Paymaster)
            // promiseWallet 비동기 내용이 실행되는 요소들이 담기는 배열 [promise1, promise2, ...]
            // 전달한 요소들의 비동기 처리를 해서 동기적으로 모든 작업이 끝났을때
            const wallets = await Promise.all(promiseWallet)
            setPkprovider(wallets);
            setProvider(provider)
        }
    })()
    // metamask or 확장프로그램 지갑을 사용한다
    // if(window.ethereum)
    
}, [])

console.log(pkprovider, provider, paymaster, 'ss')
return {pkprovider, provider, paymaster}
}

export default useEthers
