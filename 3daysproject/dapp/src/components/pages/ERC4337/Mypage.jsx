import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userBalance } from '../../../api/ERC1155/Contract'
import styled from 'styled-components'
import loadingGif from '../../../images'
import { Link } from 'react-router-dom'
import { CheckZero, getUserInfoCreate } from '../../../api/ERC4337/NewApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'


const Wrap = styled.div`
  position: relative;
`

const Divform = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 1000; 
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
  .Tokenform {
    width: 550px;
    height: 380px;
    position: fixed;
    top: 30%; left: -50%;
    transform: translateX(-50%);
    left: 50%;
    z-index: 1000; /* above other content */
    background: rgba(0,0,0,0.03); 
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    background-color: #e7d988;
    border-radius: 15px;
    padding: 20px;
    box-sizing: border-box;
    font-size: 20px;
  }

  input {
    width: 300px;
    height: 40px;
    background-color:#fdf0e5;
    border: none;
    outline: none;
    border-radius: 5px;
    padding : 10px 20px;
    box-sizing: border-box;
    font-size: 18px;
  }

  .Divbtn{
    button {
      height: 40px;
      width: 140px;
      margin : 0 10px;
      border-radius: 5px;
      border: none;
    }
    button:hover {
      background-color: #9de7a3
    }
  }
`

const Mypage = () => {
    const [balance, setBalance] = useState(0)
    const [userNfts, setUserNfts] = useState(null)
    const [isactive, setIsactive] = useState(false)
    const [selldata, setSelldata] = useState({ userid: '', nftid: null, nftUridata: '' })

    const { userId, userinfo, loading } = useSelector((state) => state.LoginReducer)
    const Contracts = useSelector((state) => state.contractReducer)
    const sellLists = useSelector((state) => state.NftsReducer)

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["mypage"],
        queryFn: async () => {
            const data = await getUserInfoCreate(userId)
            const { data: sellnft } = await axios.get('http://localhost:3001/sellnft')
            console.log(sellnft, 'ss')
            const parsedSellnft = sellnft.message.map((el) => {
                const parsed = JSON.parse(el.nftUridata)
                el.nftUridata = parsed
                return el
            })
            console.log(parsedSellnft, data.message)
            dispatch({ type: 'nftDatas', payload: parsedSellnft })
            return data
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: true,
        retry: 3
    })

    useEffect(() => {
        const { TokenContract } = Contracts;
        (async () => {
            const balance = await TokenContract.balanceOf(userinfo.smartAcc)
            const newBalance = Math.floor(Number(ethers.formatEther(balance)))
            setBalance(newBalance)
            const { data } = await axios.get(`http://localhost:3001/user/${userId}`)
            const parsedData = data.message.map((el, i) => {
                const newNftUridata = JSON.parse(el.nftUridata)
                return { ...el, nftUridata: newNftUridata }
            })
            setUserNfts(parsedData)
        })()
    }, [Contracts, sellLists])

    const sellNft = async (e) => {
        e.preventDefault();
        setIsactive(false)
        const { NfttknAmt, uintprice } = e.target;
        console.log(NfttknAmt, uintprice, userNfts, selldata)
        const UserNftidToken = userNfts.find(el => el.nftid == selldata.nftid)
        if (uintprice.value <= 0) return alert('판매 가격을 확인해주세요')
        if (UserNftidToken.nftidToken < Number(NfttknAmt.value) || 0 >= Number(NfttknAmt.value)) return alert('판매 토큰 량 확인해주세요')
        // return
        const _data = {
            userid: selldata.userid,
            smartAccAddress: userinfo.smartAcc,
            nftid: selldata.nftid,
            nftidTokenAmt: Number(NfttknAmt.value),
            price: Number(uintprice.value),
            nftUridata: selldata.nftUridata
        }
        const { data: findOne } = await axios.get(`http://localhost:3001/sellnft/${selldata.userid}/${selldata.nftid}`)
        if (findOne.message) return alert('이미 판매중 아니템입니다 취소후 다시 시도해주세요')
        dispatch({ type: 'Loading', payload: true })
        const { data } = await axios.post('http://localhost:3001/sellnft', _data)
        // if (data) alert('NFT 판매 등록 완료되었습니다')
        const { data: contractData } = await axios.post('http://localhost:3001/contractsellnft', _data)
        if (contractData.state === 201) alert('NFT 네트워크에 기록 되었습니다다')
        CheckZero()
        await queryClient.invalidateQueries({ queryKey: ['mypage'] });
        console.log(await queryClient.invalidateQueries({ queryKey: ['mypage'] }))
        dispatch({ type: 'Loading', payload: false })

    }
    // console.log(queryClient.invalidateQueries())

    const LogoutHandler = () => {
        // navigate('/')
        dispatch({ type: 'logout' })  // This will clear userId and user too
        console.log('zz')
    }


    const MypageCancelHandler = async ({ userid, sender, nftid, nftUridata, nftidToken }) => {
        const _data = { smartAccAddress: sender, nftid }
        const stringifyData = JSON.stringify(nftUridata)
        const updataData = { userid, nftid, nftUridata : stringifyData, nftidToken }
        console.log(_data)
        const confirmed = window.confirm('판매 취소 하시겠습니까?')
        if (!confirmed) return;
        dispatch({ type: 'Loading', payload: true })
        const { data } = await axios.delete('http://localhost:3001/sellnft', { data: _data })
        const { data: PatchData } = await axios.patch('http://localhost:3001/sellnft', updataData)
        const { data: ContractRes } = await axios.delete('http://localhost:3001/contractsellnft', { data: _data })
        if (ContractRes.state = 200) alert('네트워크에 기로 되었습니다')
        dispatch({ type: 'Loading', payload: false })
        await queryClient.invalidateQueries({ queryKey: ['mypage'] });
    }
    console.log(sellLists, userId)

    return (
        <Wrap>
            <h3>Mypage</h3>
            <Link to='/main'>Main page</Link> <br /> <br />
            <Link to="/"><button onClick={LogoutHandler}>Logout</button></Link> <br /><br />
            {isactive && <Divform>
                <form action="" className='Tokenform' onSubmit={(e) => sellNft(e)}>
                    <div>
                        <h3>NFT 판매</h3>
                        {/* <label htmlFor="">판매할 토큰 량을 입력해주세요</label> <br /> */}
                        <input type="number" name='NfttknAmt' placeholder='판매 량' /> <br />
                    </div>
                    <div>
                        {/* <label htmlFor="">토큰  "한 개당"  판매 가격 </label> <br /> */}
                        <input type="number" name='uintprice' placeholder='판매 가격' /> <br />
                    </div>
                    <div className='Divbtn'>
                        <button type='button' onClick={() => {
                            setIsactive(false)
                        }} >cancel</button>
                        <button>confirm</button>
                    </div>
                </form>
            </Divform>}


            <h3>User 정보</h3>
            <div>
                아이디 : {userId} <br />
                public Key : {userinfo.UserAddress} <br />
                smartAcc Address : {userinfo.smartAcc} <br />
                user Balance : {balance ? balance : 0} BTK <br />
                White List : {(userinfo.checkWhitelist === true) ? 'true' : 'false'}
            </div>
            <div>
                <h3>My NFT Collection</h3>
                {userNfts?.map((el, i) => {
                    return (<div key={i}><img src={el.nftUridata.image} width='200px' /> <br />
                        <div>name : {el.nftUridata.name} <span>nft id : {el.nftid}</span> </div>
                        <div> balance : {el.nftidToken}</div>
                        <div>desc : {el.nftUridata.description}</div>
                        {loading ? <img src={loadingGif} width="50px" /> : <button onClick={() => {
                            setIsactive(true)
                            const stringifyNftUridata = JSON.stringify(el.nftUridata)
                            setSelldata(prev => ({ ...prev, userid: el.userid, nftid: el.nftid, nftUridata: stringifyNftUridata }));
                        }}>Sell NFT</button>}


                    </div>)
                })}
                <h3>My NFT SellList</h3>
                {sellLists.map((el, i) => {
                    if (el.userid === userId) {
                        return (
                            <div key={i}>
                                <img src={el.nftUridata.image} alt="" width='200px' />
                                <div>name : {el.nftUridata.name} <span>nft id : {el.nftid}</span> </div>
                                <div> <span>sell Amt : {el.nftidTokenAmt} </span> <span>price : {el.price}</span> </div>
                                <div style={{
                                    width: '200px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',       // prevent text wrap, if desired
                                    textOverflow: 'ellipsis',   // show "..." for overflowed text
                                }}>desc : {el.nftUridata.description}</div>
                                 {loading ? <img src={loadingGif} width="50px" /> : <button  onClick={() => {
                                // setCancelData({userid : el.userid, sender : el.smartAccAddress, nftid : el.nftid})
                                MypageCancelHandler({
                                    userid: el.userid,
                                    sender: el.smartAccAddress,
                                    nftid: el.nftid,
                                    nftUridata: el.nftUridata,
                                    nftidToken: el.nftidTokenAmt
                                })
                                return
                            }}>Cancel Sell</button>}

                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </Wrap>
    )
}

export default Mypage