import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import useNewEthers from '../../../hooks/useNewEthers'
import { getUserInfo } from '../../../api/ERC4337/NewApi'
import { ethers } from 'ethers'
import { sendEntryPoint } from '../../../api/ERC4337/SendUserOps'
import { uploadIPFS } from '../../../api/ERC4337/Ipfs'
import axios from 'axios'

const Mainpage = () => {

    const [userInfo, setUserInfo] = useState(null)
    const [userBalance, setUserBalance] = useState(null)

    const Contracts = useSelector((state) => state.contractReducer)
    const userId = useSelector((state) => state.LoginReducer.userId)
    const islogin = useSelector((state) => state.LoginReducer.State)

    const amount = ethers.parseEther("1000", 18);
    const value = ethers.parseEther("0");

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

    const createNftMutn = useMutation({
        mutationFn: async (e) => {
            e.preventDefault();
            const { TokenContract, SmartAccountContract, EntryPointContract, NftContract, signer } = Contracts;
            const { smartAcc } = userInfo;
            const formdata = new FormData();
            const File = e.target.file.files[0];
            formdata.append("file", File)
            console.log('test uploadipfs data', formdata, File)

            const IpfsUri = await uploadIPFS(formdata)

            const mintCallData = await NftContract.interface.encodeFunctionData('settokenURI', [IpfsUri, smartAcc])

            const callData = SmartAccountContract.interface.encodeFunctionData('execute',
                [NftContract.address('check this'), value, mintCallData]
            )

            const data = await sendEntryPoint(smartAcc, EntryPointContract, callData, signer)
            
            const eventData = await NftContract.on('TokenURICreated')

            

            // const NftToken = await NftContract.balanceOf(smartAcc, NftId)


            // const response = await axios.post('http://localhost:3001/')

        },
        onSuccess: () => {
            // refetch()
            queryClient.invalidateQueries(['users'])
        }
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

        const mintCallData = TokenContract.interface.encodeFunctionData('mint', [smartAcc, amount])
        const events = await EntryPointContract.on('UserOpCompleted')

        console.log('nonce', events)
        const callData = SmartAccountContract.interface.encodeFunctionData('execute',
            [process.env.REACT_APP_BING_TKN_CA, value, mintCallData]
        )
        const response = await sendEntryPoint(smartAcc, EntryPointContract, callData, signer)
        const balance = await TokenContract.balanceOf(smartAcc)
        const newBalance = ethers.formatEther(balance)
        setUserBalance(newBalance)
        console.log('response mainpage', newBalance, response)
    }

    useEffect(() => {
        if (!Contracts || !userInfo) return;
        (async () => {
            const { TokenContract } = Contracts;
            const { smartAcc } = userInfo;
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
            <h3>uploadNFT</h3>
            <form onSubmit={(e) => createNftMutn.mutate(e)}>
                <input type="file" name='file' />
                <button>submit</button>
            </form>
            <button onClick={GetCoin} >Get Coin</button>
        </div>
    )
}

export default Mainpage
