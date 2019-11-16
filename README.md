# tube2mp3-chrome
유튜브 영상을 MP3로 변환하여 다운로드하는 크롬 플러그인

1. chrome-plugin : 크롬 플러그인 프로젝트 (클라이언트)

2. server : MP3 변환 & 전송 프로젝트 (서버)
   * `server/run.sh` 파일로 서버 실행
   * `server/requirements.txt`, `gunicorn`, `ffmpeg` 설치 필수
   * `chrome-plugin/script.js` 에서 서버 아이피 수정

<br/>

![image](https://user-images.githubusercontent.com/38099251/68989358-daf0a580-0888-11ea-80f4-c0601ea75688.png)
