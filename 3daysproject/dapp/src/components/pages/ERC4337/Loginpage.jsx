import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect } from 'react'
import { CreateAcc, getUserInfo, getUsersInfo } from '../../../api/ERC4337/NewApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Newpage = () => {

    const queryClient = useQueryClient();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signUpHandler = useMutation({
        mutationFn: async (e) => {
            e.preventDefault();
            const { signupid } = e.target
            // console.log(signupid.value)
            const data = {
                id: signupid.value,
                email: 'bing33@gmail.com',
                salt: 'hii',
                domain: 'google'
            }
            const response = await CreateAcc(data)
            console.log(response)
            if (response.state === 200) return alert('가입 완료되었습니다 로그인 해주세요')
            alert('이미 사용되고 있는 아이디입니다다')
            signupid.value = "";
            navigate('/')
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["user"])
        }
    })

    const {isPending} = signUpHandler;

    const loginHandler = async (e) => {
        e.preventDefault();
        const { userid } = e.target;
        console.log('gg', userid.value)
        const data = await getUserInfo(userid.value)
        console.log(data, 'f')
        if (data.state !== 201) return alert('아이디를 일치하지 않습니다')
        dispatch({ type: 'setUserId', payload: userid.value })  // ✅ Set in Redux
        dispatch({ type: 'login' })
        userid.value = "";
        navigate('/main')
    }

    return (
        <div>
            {/* <button onClick={requestWhitelist.mutate} >request for whitelist</button> */}
            {/* <button onClick={getUsersInfo} >request for getUsersInfo</button> */}

            <div>Loginpage</div>
            <div> <form onSubmit={(e) => loginHandler(e)}>
                <input type="text" name='userid' />
                <button>Login</button>
            </form> <br />
                <form onSubmit={(e) => signUpHandler.mutate(e)}>
                    <input type="text" name='signupid' />
                    <button>signup</button>
                </form></div>
                {isPending && <div>pending</div> }
        </div>
    )
}

export default Newpage
