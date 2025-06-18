// 프로젝트의 root 경로에 config.js라는 파일을 생성하였다.
import Reactotron from 'reactotron-react-native';
import { Platform } from 'react-native';

if (__DEV__) {
  Reactotron.configure({
      name: 'BITE App', // 앱 이름 설정
      host: 'localhost', // iOS 시뮬레이터의 경우 localhost
      port: 9090, // 기본 포트
    }) // controls connection & communication settings
    .useReactNative({
      asyncStorage: false, // AsyncStorage 로깅 비활성화 (필요시)
      networking: {
        ignoreUrls: /symbolicate|logs/, // 특정 URL 무시
      },
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    }) // add all built-in react native plugins
    .connect(); // let's connect!

  console.tron = Reactotron;
  console.log('Reactotron 설정 완료');
}
