// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract WrappedToken {
    string public name = 'Wrapped ETH';
    string public symbol = 'wETH';
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Burned(address indexed from, uint256 amount);

    // relayer 만 호출할수 있도록 구성  여러명의 경우 우리 화이트리스트 작성 mapping 으로 표현
    address public relayer; // mint 호출할수 있는 주소

    constructor(address _relayer) {
        relayer = msg.sender;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer);
        _;
    }


    function mint(address to, uint256 amount) external onlyRelayer {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function burn(uint256 _amount) external {
        require(balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;

        // address(0) => 소각 0x000000... 주소로 트랜스퍼 소유권 전환 
        // 소각을 기키면 이벤트를 호출해서 relayer 에서 스왑가능을 호출
        // 이벤트 로그에 누가 ? 어디에 ? 얼마를?  transfer erc20
        // transfer 이벤트를 호출해서 기록을 해줘야한다 => 표준에 맞게 transfer(msg.sender, address(0), amount)
        emit Burned(msg.sender, _amount);

    }

}