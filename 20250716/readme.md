# erc 4337  Account


> 이더리움의 계정 EOA CA
> EOA : externally owned account
> CA : contract address, smart account


### 스마트 컨트랙트 계정
> EOA는 개인키로 서명 스마트 코드에 제어를 받아서 메시지를 처리한다
> EOA는 이더리움을 전송을 할수 있고 스마트 계정은 이더를 전송은 할수 있지만 코드 실행이 필요하다
> 서명을 직접 처리할수 있는 EOA와 서명을 직접 처리할수 없는 스마트 계정
> 가스 수수료는 EOA가 지불을 할수 있고 EOA가 서명후 실행을 시켜줘야 수수료를 지불해줘야 스카트계정은 코드를 실행할수 있다
> 사용자가 로직을 정의해서 사용할수 있다 EOA 는 불가능하고 스마트 계정은 가능하다.
> 지갑으로 표현 했을때 로직적인 부분을 확장할수 있다. => 추상화는 강조하고 싶은 특징을 남기고 다 지우는것. => 현실에 있는 사물적인 표현을 단순하게 만드는것 => 삼성 노트북 엘지 맥북 => 노트북

> UX적인 추상화 개인키를 몰라도 중요하지 않고 


### 기존의 트랜잭션의 형태의 한계
> 모든 트랜잭션은 서명이 필요하다
> 컨트랙트는 트랜잭션을 만들수 없다 왜 서명을 못만드니까 개인키가 없기떄문에 => 메시지를 만들수 있다
> 스마트 계정은 구현이 복잡하고 표준이 정해져있지 않지만 사용자에게는 계정을 추상화해서 개인키의 지식이 없더라도 사용할수 있는 제공할수 있다
> 문제점 해결 핵심 요소 상위 계층에서 트랜잭션의 내용을 트랜잭셔ㅛㄴ 풀에 담아서 처리하고나서 이더리움 네이티브 EVM 트랜잭션 풀에서 처리한다


### Account Abstraction 등장 배견
> EOA 와 스마트 컩트랙트의 로직적인 부분을 같이 사용하자
> 사용자가 직접 지갑의 로직을 정의할수 있게 하자
> 새로운 인증의 방식을 도입 하고싶다. 개인키를 가지고 서명을해서 트랜잭션을 발생시키는 확장프로그램지갑 등 이외에
> 생체 인식 지갑 생성이라던지 소셜로그인 지갑 생성
> 지갑이 트랜잭션의 내용을 구현할수 있게 추상화

> L1의 프로토콜을 수정하지 않고 계정을 추상화하는개념을 탄생
> entrypoint, userops, bundler
> 스마트 계정의 서명을 처리하기위해서 ECDSA => secp256k1
> 이더리움의 서명 방식을 그대로 사용하면서 개인키 -> 공개키 -> 가스비(대납) -> 계정 생성(스마트 계정) 
> 서명은 그 사람이 개인키를 복원해서 만들고 서명값을 생성해서 => 목적성이 달라진 서명의 형태
> 내가 그일을 했어요. 스마트 계정을 가지고 있는 사용자는 서명을 만들어서 검증 => 수수료는 지불 X
> 번들러에 useops들을 모아서 entrypoint 로 보내서 트랜잿연 처리 => 대납자가 트랜잭션 서명을 만들어준다 => 가스비 지불

> 스마트 계정의 서명의 목적은 EVM의 서명 검증이 아닌 => 본인인증 

> 소셜로 로그인을 진행한다 할때 create2 => 컨트랙트를 배포하기 정에 주소의 값ㅇ르 계산할수 있다면 어떨까? => 메모리 영역 접근
```js
CA = keccak256(0xff + sender ++ salt ++ keccak256(bytecode)) => 이 해시문자열은 CA 라는 게 예측이 된다 => 생성하는 컨트랙트에 미리 이더를 충전한다던지 토큰 소유자로 만들어야한다던지  
배포가스비를 내지않고 미리 로직을 구성할수 있다

```


### EOA 생성

```js
// createRandom 랜덤한 값으로 개인키를 생성해준다
// 개인키 생성 방식을 생체 혹은 소셜
const walelt = ethers.Wallet.createRandom();
// 생성된 지갑의 주소

console.log(wallet.address);
console.log(wallet.privateKey);

```


### 중요한 요소
1. 스마트 계정의 생성구조 => 개인키 생성 컨트랙트 배포
2. 스마트 계정에서 자겁을 보내는 서명값의 복원
3. 개납과 대리 호출의 로직

> 개인키 분실, 개인키 복원 , paymaster 가 대신 가스비 부담을 해야한다

### userOperation 
1. sender
2. nonce
3. initCode
4. callData
5. callGasLimit
6. verificationGasLimit


> 이 메시지를 해시화 직렬화 => 서명을 만들고 
> 이 메시지랑 서명을 보내서 공개키 복원 => 서명 검증
> 대납자가 지불을 해서 트랜잭션 처리

### smart account 생성
> 컨트랙트가 계정의 역활을 한다
> 계정 추상화 => 검증 로직 => 직접 검증 로직 만들어서
> 사용자는 서명을 만들어서 사용

1. 스마트 컨트랙트 (스마트 계정) 로직 작성
2. 스마트 컨트랙트 팩토리 (스마트 계정 공장)
3. 스마트 계정은 주인만 호출할수 있는 구조를 내부적으로 가지고 있는 컨트랙트
4. entrypoint 주소로 호출된 내용을 실행할수 있도록 구성


### 스마트 계정의 주요 속성 
1. 소유자의 주소
2. 엔트리 포인트 주소
3. 서명 검증 로직 
4. 외부 호출 call


modifier works as a middleware and used for resuable conditions for verification

assembly lowlevel language for wiriting gas efficient codes 

execute and isvalidsignature are the encessary functions in smart account for verifying the sender and sending the values and data to sendto contract