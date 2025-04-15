/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {useFunnel} from '@use-funnel/react-navigation-native';
import {Email} from './Email/index.tsx';
import {Password} from './Password.tsx';
import {Name} from './Name.tsx';
import {BirthYear} from './BirthYear.tsx';
import {
  이메일입력,
  비밀번호입력,
  이름입력,
  생년입력,
  // 약관동의,
  가입환영,
  관심주제선택,
} from './signUpContext.ts';
import {TermsAgreementDrawer} from './TermsAgreementDrawer.tsx';
import {Welcome} from './Welcome.tsx';
import Interest from '../Interest/index.tsx';
import {
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
} from '@/api/authApi.ts';

export const SignUp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const checkToken = async () => {
      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (accessToken && refreshToken) {
          await refreshAccessToken();
        } else {
          setIsGuest(false);
          return;
        }

        setIsGuest(true);
      } catch (e) {
        setIsGuest(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const funnel = useFunnel<{
    관심주제선택: 관심주제선택;
    이메일입력: 이메일입력;
    비밀번호입력: 비밀번호입력;
    // 이름입력: 이름입력;
    생년입력: 생년입력;
    가입환영: 가입환영;
  }>({
    id: 'signUp',
    initial: {
      step: isGuest ? '이메일입력' : '관심주제선택',
      context: {},
    },
  });

  if (isLoading) return <></>;

  return (
    <funnel.Render
      관심주제선택={({history}) => (
        <Interest onNext={() => history.push('이메일입력')} />
      )}
      이메일입력={({history}) => (
        <Email
          onNext={(email: string) => history.push('비밀번호입력', {email})}
        />
      )}
      비밀번호입력={({history}) => (
        <Password
          onNext={(password: string) => history.push('생년입력', {password})}
          onBack={context => history.push('이메일입력', context)}
        />
      )}
      // 이름입력={({history}) => (
      //   <Name
      //     onNext={(name: string) => history.push('생년입력', {name})}
      //     onBack={context => history.push('비밀번호입력', context)}
      //   />
      // )}
      생년입력={({history}) => (
        <BirthYear
          onNext={(birthYear: number) => history.push('가입환영', {birthYear})}
          onBack={context => history.push('비밀번호입력', context)}
        />
      )}
      가입환영={() => <Welcome />}
      // 약관동의={funnel.Render.overlay({
      //   render({history, close}) {
      //     return <TermsAgreementDrawer visible={true} onClose={close} />;
      //   },
      // })}
    />
  );
};
