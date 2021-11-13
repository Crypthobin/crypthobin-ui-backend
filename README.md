# 밥그릇 백엔드
밥그릇 pqc 월렛의 백엔드 코드입니다.

## 실행방법
### `docker`를 이용한 방법

1. [이곳](https://github.com/settings/tokens)에서 깃헙 토큰을 발급 받습니다.
2. `docker login ghcr.io -u <깃헙유저이름>`을 실행하고 비밀번호에 토큰을 입력합니다.
3. 다음 명령어를 입력해 백엔드를 실행합니다:   
```
docker run -it -p 3000:3000 --name backend \
  ghcr.io/crypthobin/crypthobin-ui-backend:develop
```
