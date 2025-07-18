import { useEffect, useState } from "react";
import useEthers from "./hooks/useEthers";
import { ethers } from "ethers"
import axios from "axios";
function App() {

  const { pkprovider, provider, paymaster } = useEthers({
    _privateKeys: [
      // "0xfbc1960a886986637345636605e54f7f7e54d1b36f92ee1ec44c77820c444a17",
      "8007cc0b255abbfef30119b64e9eff1f51f894762350d565738063c477ae6b4a",
      "1b9831dc1da105331a69206fed2be006b0987870d61edb791d71547bc755db58"
    ]
  })


  const [selectAccount, setSelectAccount] = useState(0);
  const [paymasterbalance, setPaymasterbalance] = useState(0);
  const [txpool, setTxpool] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [tokens, setTokens] = useState([])
  const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  useEffect(() => {
    if (!provider) return
    (async () => {
      const balance = await provider.getBalance(paymaster)
      const balanceEth = ethers.formatEther(balance)
      setPaymasterbalance(balanceEth)
    })()
    console.log(pkprovider, paymaster)
    
  }, [paymaster, provider])

  // txpool 조회하는 함수
  const getTxpoolHandler = async () => {
    const {data} = await axios.get("http://localhost:3002/txPools")
    console.log(data)
    setTxpool(data)
  }
  // 메시지 보내는 함수
  const messageHandler = async () => {
    const txMessage = {
      sender: pkprovider[selectAccount].address,
      data: tokenCount
    }
    // 검증에 필요한 서명값
    const sign = await pkprovider[selectAccount].wallet.signMessage(JSON.stringify(txMessage));
    await axios.post("http://localhost:3002/tx/create", { message: txMessage, signature: sign }, {
      headers: {
        "Contetn-Type": "application/json"
      }
    })
  }

  const metaTxHandler = async () => {
    const { data } = await axios.post("http://localhost:3002/metaTransaction");
    await getTxpoolHandler();
  }

  useEffect(() => {
    if (pkprovider.length === 0) return;
    const contract = new ethers.Contract("0x2BbaeBAE80399Cd58D96C1e225C44555842ceBBd", abi, provider
    )
    const tokens = pkprovider.map(async (e) => {
      const balance = await contract.balanceOf(e.address)
      return balance.toString();
    })
    Promise.all(tokens).then((e) => {
      setTokens(e);
    })
    console.log(tokens, 'tokens')
  }, [provider, pkprovider])

  if (!provider) return <>...loading</>
  return (<>
    <div className="App">
      <div>선택한 계정</div>
      <div>계정 : {pkprovider[selectAccount]?.address}</div>
      <div>{pkprovider[selectAccount]?.balance} ETH</div>
      <div></div>
    </div>
    <div>
      <h2>계정 목록</h2>
      <ul>
        {pkprovider?.map((el, i) => <li style={{ cursor: "pointer", color: "darkblue" }} onClick={() => setSelectAccount(i)}>
          계정 : {el.address} <br />
          잔액 : {el.balance} ETH <br />
          토큰 : {tokens[i]} BTK <br />
        </li>)}

        <li></li>
        <li></li>
      </ul>
    </div>
    <div>가스비의 대납 계정 </div>
    <div>계정 : {paymaster ? paymaster.address : ""}</div>
    <div>대납 지갑의 ETH : {paymasterbalance ? paymasterbalance : ""}</div>
    <h3>토큰 몇개 받고싶어?</h3>
    <input type="number" onChange={(e) => setTokenCount(e.target.value)} />
    <button onClick={messageHandler}>대납 신청</button>
    <h3>트랜잭션 조회</h3>
    <div>
      <ul>
        {txpool?.map(e => <li>{e.message.sender}가 토큰 {e.message.data} 갯수를 요청했다. {e.signature}</li>)}
        
        <li></li>
      </ul>
      <button onClick={getTxpoolHandler}>트랜잭션 풀 조회</button>
    </div>
    <h3>트랜잭션 풀 작업 내용 처리</h3>
    <button onClick={metaTxHandler}>작업 실행</button>
  </>
  );
}

export default App;
