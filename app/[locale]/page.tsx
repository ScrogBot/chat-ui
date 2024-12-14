'use client';

import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';
import { IconArrowRight } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex size-full flex-col items-center justify-center">
      {/*<div>*/}
      {/*  <ChatbotUISVG theme={theme === 'dark' ? 'dark' : 'light'} scale={0.3} />*/}
      {/*</div>*/}

      <div className="mt-2 text-4xl font-bold">
        전북대 올림피아드에 오신것을 환영합니다
      </div>
      <div className="mt-2 text-xl">
        전북대 올림피아드는 학생들의 과학적 사고력과 창의력을 증진시키기 위한
        경진대회입니다. 수학, 과학 정보 분야에서 여러분의 재능을 마음껏
        펼쳐보세요.
        <br />
        <br />
        매년 개최되는 이 대회는 전국의 우수한 인재들이 모여 실력을 겨루고 서로
        교류하는 장입니다. 여러분의 도전을 기다립니다!
      </div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href="/login"
      >
        시작하기
        <IconArrowRight className="ml-1" size={20} />
      </Link>

      <footer className="mt-10 text-center text-sm text-gray-500">
        2023 전북대학교 올림피아드. All rights reserved.
      </footer>
    </div>
  );
}
