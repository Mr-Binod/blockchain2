import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userBalance } from '../../../api/ERC1155/Contract'
import styled from 'styled-components'
import loadingGif from '../../../images'
import { Link } from 'react-router-dom'

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
    const [count, setCount] = useState(0)
    const [selldata, setSelldata] = useState({ userid: '', nftid: null, nftUridata: '' })

    const { userId, userinfo, loading } = useSelector((state) => state.LoginReducer)
    const Contracts = useSelector((state) => state.contractReducer)
    
    const dispatch = useDispatch();
    
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
    }, [Contracts])

    const sellNft = async (e) => {
        e.preventDefault();
        setIsactive(false)
        const { NfttknAmt, uintprice } = e.target;
        console.log(NfttknAmt, uintprice, userNfts, selldata)
        const UserNftidToken = userNfts.find(el => el.nftid == selldata.nftid)

        if(UserNftidToken.nftidToken < Number(NfttknAmt.value)) return alert('판매 토큰 량 확인해주세요')

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
        dispatch({ type: 'Loading', payload: false })
        setCount(prev => prev + 1)
    }

    return (
        <Wrap>
            <h3>Mypage</h3>
            {isactive && <Divform>
                <form action="" className='Tokenform' onSubmit={(e) => sellNft(e)}>
                    <div>
                        <h3>NFT 판매</h3>
                        {/* <label htmlFor="">판매할 토큰 량을 입력해주세요</label> <br /> */}
                        <input type="number" name='NfttknAmt' placeholder='판매 량' /> <br />
                    </div>
                    <div>
                        {/* <label htmlFor="">토큰  "한 개당"  판매 가격 </label> <br /> */}
                        <input type="number" name='uintprice' placeholder='한개당 판매 가격' /> <br />
                    </div>
                    <div className='Divbtn'>
                        <button type='button' onClick={() => {
                            setIsactive(false)
                        }} >cancel</button>
                        <button>confirm</button>
                    </div>
                </form>
            </Divform>}
            
            <Link to='/main'>Main page</Link>
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
                        <div>desc : {el.nftUridata.description}</div>
                        <div> balance : {el.nftidToken}</div>
                        {loading ? <img src={loadingGif} width="50px" /> : <button onClick={() => {
                            setIsactive(true)
                            const stringifyNftUridata = JSON.stringify(el.nftUridata)
                            setSelldata(prev => ({ ...prev, userid: el.userid, nftid: el.nftid, nftUridata: stringifyNftUridata }));
                        }}>Sell NFT</button>}


                    </div>)
                })}
            </div>
        </Wrap>
    )
}

export default Mypage