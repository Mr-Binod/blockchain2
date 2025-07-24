import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import useNewEthers from '../../../hooks/useNewEthers'
import { getUserInfo } from '../../../api/ERC4337/NewApi'
import { ethers } from 'ethers'
import { sendEntryPoint } from '../../../api/ERC4337/SendUserOps'

const Mainpage = () => {

    const [userInfo, setUserInfo] = useState(null)
    const [userBalance, setUserBalance] = useState(null)

    const Contracts = useSelector((state) => state.contractReducer)
    const userId = useSelector((state) => state.LoginReducer.userId)
    const islogin = useSelector((state) => state.LoginReducer.State)

    const queryClient = useQueryClient();
    const dispatch = useDispatch()

    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const data = await getUserInfo(userId)
            setUserInfo(data.message)
            return data
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: true,
        retry: 3
    })

    const CallHookFn = () => {
        const result = useNewEthers(userInfo.privateKey, userInfo.smartAcc)
        dispatch({ type: 'Contracts', payload: result })
        console.log(result, 'result', userInfo)
        console.log(Contracts)
    }

    const GetCoin = async () => {
        // if(!Contracts) return;
        const { TokenContract, SmartAccountContract, EntryPointContract, signer } = Contracts;
        const { smartAcc } = userInfo;
        const amount = ethers.parseEther("1000", 18);
        const value = ethers.parseEther("0");
        console.log(TokenContract, SmartAccountContract, '44',)
        const mintCallData = TokenContract.interface.encodeFunctionData('mint', [smartAcc, amount])
        const events = await EntryPointContract.on('UserOpCompleted')
        const nonce = await EntryPointContract.nonces(smartAcc)
        console.log(nonce, 'nonce', events)
        const callData = SmartAccountContract.interface.encodeFunctionData('execute',
            [process.env.REACT_APP_BING_TKN_CA, value, mintCallData]
        )
        const response = await sendEntryPoint(smartAcc, nonce, callData, signer)
        const balance = await TokenContract.balanceOf(smartAcc)
        const newBalance = ethers.formatEther(balance)
        setUserBalance(newBalance)
        console.log('response mainpage', newBalance, response)
    }

    useEffect(() => {
        if(!Contracts || !userInfo) return;
        (async () => {
            const { TokenContract } = Contracts;
            const {smartAcc} = userInfo;
            const balance = await TokenContract.balanceOf(smartAcc)
            const newBalance = ethers.formatEther(balance)
            setUserBalance(newBalance)
        })()
    }, [Contracts])

    useEffect(() => {
        if (userInfo) CallHookFn()
    }, [userInfo])

    return (
        <div>
            <div>
                아이디 : {userId} <br />
                public Key : {userInfo?.UserAddress} <br />
                smartAcc Address : {userInfo?.smartAcc} <br />
                user Balance : {userBalance ? userBalance : 0} BTK <br />
                White List : {(userInfo?.checkWhitelist === true) ? 'true' : 'false'}
            </div>
            <button onClick={GetCoin} >Get Coin</button>
        </div>
    )
}

export default Mainpage
