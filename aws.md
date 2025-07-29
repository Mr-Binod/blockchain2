```sh
mkdir myproject
cd myproject
git init
git remote add origin
git pull origin 


----


# node js 설치
# sudo super user do
# package update
sudo apt-get update

# 기본 프로그램 설치치
sudo apt-get install -y build-essential 

# 프로토콜 요청을 보내는것 제공
sudo apt-get install curl 

# nodejs package file install with version 
curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash --



# -y means accept and next and install node js
sudo apt-get install -y nodejs

# node version check
node -v

#install package-json
npm i

# after nodejs we can use node server.js

# port forwarding
> 네트워크에서 외부 포트로 요청을 보내면 재 매핑을 해서 다른 포트로 요청을 받는 구조
> 공유기나 가상 서버에서 이런것을 적용해서 사용한다.
> 예) 80 포트로 요청을 받으면 3000번 포트로 재 미핑을 시켜버린다

# 80번 포트로 요청 받으면 재매칭 리다이렉트 3000 번으로 리다이렉트해서 
# port forwording 
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000;

# CHECK PORT FORWARDING LIST
sudo iptables -t nat -L --line-numbers;

# port forwording delete with index number
sudo iptables -t nat -D PREROUTING 1


---------

### 프록시 서버 설정 nginx
> 포트 포워딩은 네트워크 장비 방홤벽의 특정 포트에서 들어오는 트래픽을 다른 포트이나 호스트로 리다이랙트 시켜주는
> 프록시 : 클라이언트와 백엔드 서버 사이에서 트래픽 중계를 맡아주는것 즉 중개서버 하나 개설

> 백엔드 -> 데이터베이스
글라이언트 -> 프록시 서버(보안 좋아지는것 엔드포인트를 속여서 감추는 역활을 할수 있다) -> 백엔드 서버


## nginx 를 사용해서 프록시 서버 설정 
> 통신을 할때 중간에서 대신 통신을 해주는 역활을 한다
> 중걔서버역활을 해주는것이 프록시 서버
> 클라이언트와 백엔드 서버 사이에서 중개 서버 역활

### 프록시 서버의 종류
1. 포워드 프록시 서버 : 클라이언트와 인터넷의 접속 제어 (클라우드 프론트)
2. 리버스 프록시 서버 : API 제어

> 리버스 프록시 서버의 요청을 받아서 처리해준다(엔드포인트를 감출수 있다)


sudo apt-get install -y nginx

sudo service nginx status;

sudo service nginx stop;
sudo service nginx start;

### 중개 서버 역활을 하는데 엔드포인트를 알아야 중개를 하겠지?

### 부동산인데 집주인이 누군데?

### 설정 파일

### 설치한 패키지는 home 작업공간
### etc

# root 경로
cd / 

# 설치한 패키지는 home  작업공간
# etc 소프트웨어가 설치되는 폴더

sites-enabled/default 파일이 있는데 이게 기본 설정값을 


sudo vi /etc/nginx/sites-available/default

sudo vi default

location {
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:3000;
    proxy_redirect off;
}


## 내용이 정상적인지 테스트
sudo nginx -t


### 테스트 완료
sudo service nginx restart;

root /bin/www/myproject # 빌드 파일 경로

location {
    try_files index.html
    proxy_redirect off;
}





ls -a    // check files and folders

```


### 도메인 
> 특정 아이피 주소에 접근할수 있는 검색어

### AWS router 53
> 도메인 등록 DNS(domain name server) routing 기능을 제공한다.
> 도메인을 관리할수 있게 레코드 값의 설정을 제공한다

### 레코드 
> DNS 레코드 도메인의 이름과 관련된 정보를 나타내는 데이터
> NS 네임서버 즉 인터넷에서 도메인을 ip 주소로 변화하는 역활을 하는 서버

### ssl 인증서
> 내가 배포하는 사이트가 안전한 사이트라는 인증서를 발습 받았느냐?
> 도메인에 요청을 보내서 안전한 도메인인지 확인을 하고 인증서를 발습을해준다
> https => 안전한 사이트를 검증받은것. 경고로 신상정보가 노출될 위험 있는 사이트입니다.
> http => https로 요청을 보내는 구조는 안된다
> https => https 로만 요청이 가능하다
> 인증서를 테스트 할수있는 인증서를 발급해주는 소프트웨어를 사용해서 cert-bot
> https 인증서를 발습 받아서 테스트할수 있는 환경을 제공한다


- cert-bot은 nginx
```sh
# 런타임 환경 설치
# snap 패키지 설치를 위한 패키지의 포멧

sudo snap install core
sudo snap install --classic certbot

certbot --version

1  sudo apt-get update
2  sudu apt-get install mysql-server
3  sudo apt-get install mysql-server
4  sudo mysql -u root -p
5  sudo vi /etc/mysql/mysql.conf.d/
6  sudo vi /etc/mysql/mysql.conf.d/mysql.cnf 
7  cd /etc/mysql/mysql.conf.d/
8  ls -a
9  sudo vi mysqld.cnf 
10  cd /home/ubuntu/
11  sudo service mysql restart

sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';


# 설치 경로 bin folder
# 실행 링크 연결 환경 변수 추가
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# cert-bot nginx 에 있는 설정파일 수정
# ssl 인증서 발급

## check the security inbound 보안 인바운드 규칙 and allow http, ssh, https
sudo certbot --nginx

memory storage increase 

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
swapon --show

top   : for checking memories

echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab



- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
ubuntu@ip-172-31-3-149:~/myproject/20250514$ cd /
ubuntu@ip-172-31-3-149:/$ cd etc
ubuntu@ip-172-31-3-149:/etc$ cd nginx
ubuntu@ip-172-31-3-149:/etc/nginx$ cd sites-enabled
ubuntu@ip-172-31-3-149:/etc/nginx/sites-enabled$ ls -a
.  ..  default
ubuntu@ip-172-31-3-149:/etc/nginx/sites-enabled$ sudo vi default


# ssl 인증서 재발급 3개월마다  https 인증
sudo certbot renew


# 3개 월마다 발급이 되는지 가상의 테스트
sudo certbot renew --dry-run

# background running server "pm2"
# 프로젝트의 커넥션 연결이 종료되어도 가상 컴퓨터 즉 서버 컴퓨터의 백그라운드에서 실행되어야하는 프로젝트 파일을 pm2 로 백그라운드 실행시켜놓고 사용자가 언제든지 서버 컴퓨터가 동작하고 있다면 페이지를 이용할수 있도록 설정

sudo npm i -g pm2
# 백크라운드에서 실행되고 있는 프로젝트 확인
pm2 list  
# 백그라운드에서 동작시킬수 있는 소프트웨어
# 실행 노드 환경에서 실행행
pm2 start 
pm2 kill
pm2 start server.js 