import axios from "axios"
import { ethers } from "ethers"


const getUsersInfos = async () => {
    const response = await axios.get('http://localhost:3001/account')
    return response.data
}

const getUserInfo = async (userid, userpw) => {
    const response = await axios.get(`http://localhost:3001/account/${userid}`)
    console.log(response, 'login')
    return response.data
}
 
const CreateAcc = async (data) => {
    const result = await getUserInfo(data.id)
    console.log(result)
    if(result.state === 201) return result
    const response = await axios.post('http://localhost:3001/account', data) 
    return response.data
}

const CreateNft = async (IpfsUri, smartAcc) => {
    console.log('GG')
    const _data = {Uri : IpfsUri, address : smartAcc}
    const {data} = await axios.post('http://localhost:3001/createnft',_data ) 
    return data
}


export {getUsersInfos, CreateAcc, getUserInfo, CreateNft}
