import axios from "axios"


const getUsersInfos = async () => {
    const response = await axios.get('http://localhost:3001/account')
    return response.data
}

const getUserInfo = async (userid) => {
    const response = await axios.get(`http://localhost:3001/account/${userid}`)
    return response.data
}
 
const CreateAcc = async (data) => {
    const result = await getUserInfo(data.id)
    console.log(result, result)
    if(result.state === 201) return result
    const response = await axios.post('http://localhost:3001/account', data) 
    return response.data
}


export {getUsersInfos, CreateAcc, getUserInfo}
