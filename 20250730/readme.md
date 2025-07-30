# 브릿지 relayer burn release



AMM - oracle - uniswap - fee - slippage - expected and market rate change - slippage is for swapping (limit order sell)


> burn 과 release 의 구조
> mint 를 해서 wETH 토큰을 해당 네트워크에 발행하고 burn 을 해서 소각을하면서 해당 네트워크의 자산을 DEX에서 유동성에서 제공해주는것
> 스왑을 할때 수수료가 지불이 된다.  0.3%
> 수수료를 받아서 스왑을 진행해준다.
> lock 컨트랙트에서 burnm 을 했을때 이더를 다시 잠금 해제 해줄수도 있다 unlock



### 스왑의 구조

1. 이더리움에서 브릿지의 lock 자산을 잠금
2. 스왑할 해당 네트워크에 kaia wETH 스마트 컨트랙트에서 mint 를 호출해서 wETH 토큰을 이더량만큼 발행
3. DEX 거래소에 유동성이 확보된 DEX 거래소에 요청을 보내서 해당 wETH 토큰을 소각하고 해당 네트워크 자산을 계정을 송금


DEX 거래소 유덩성


### DEX Uniswap V2 있는 유동성 풀

> 유니스왑의 AMM 모델을 많이 사용