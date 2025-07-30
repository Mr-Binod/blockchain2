// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "./WrappedToken.sol";

contract DEX {
    address public owner;
    uint256 public wETH;    // wETH 토큰의 량 풀
    uint256 public Kaia; // 이 컨트랙트 있는 자산의 량 풀

    WrappedToken public wrappedToken;

    // wETH의 주소를 받아서
    constructor(address _wETH) {
        wrappedToken = WrappedToken(_wETH);
        owner = msg.sender;
    } 

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // 펀딩을 받아서 유동성을 확보 => LP 보상 토큰
    // 유동성 공급
    // 거래소 참여자를 받아 => 최초에 받을건지 => 화이트 리스트 추가
    function addLiquidity(uint wETHAmount) external payable {
        // wrappedToken transferFrom(msg.sender, address(this), wETHAmount)
        wETH += wETHAmount;
        Kaia += msg.value;
        // require(condition);
    }

    // 스왑 wETH -> Kaia
    function swapWEthToKaia(uint256 wETHAmount) external {
        require(Kaia >= wETHAmount);
        require(wETHAmount > 0);
        // wrappedToken transferFrom(msg.sender, address(this), wETHAmount)
        // transfer the token to owner

        uint256 balance = getAmountFee(wETHAmount, Kaia, wETH);

        wETH -= wETHAmount;
        Kaia += balance;

        payable(msg.sender).transfer(balance);

    }

    function swapKaiaToWEth() external payable {
        require(msg.value > 0);

        uint256 wETHValue = getAmountFee(msg.value, Kaia, wETH);
        wETH += wETHValue;
        Kaia -= msg.value;

        // wrappedToken transferFrom(address(this), wETH)

    }


    // AMM의 모델 수수료 계산 수식 스왑의 량을 얼마를 받아야하는지 계산
    function getAmountFee(uint256 amount, uint256 _Kaia, uint _wETH) public pure returns(uint256) {
        uint256 amountFee = amount * 997;  //0.3
        uint256 ator = amountFee * _wETH;
        uint temp = (_Kaia * 1000) + amountFee;
        return ator / temp;
    }
    

}