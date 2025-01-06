'use client';

import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';
import { IconArrowRight } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex size-full flex-col items-center justify-center">
      {/* 헤더 */}
      <div className="mt-2 text-center text-4xl font-bold ">
        {/*<div className="mt-4 text-5xl font-extrabold text-blue-600 text-center">*/}
        2024 동계 빅데이터 캠프에 오신 것을 환영합니다!
      </div>

      {/* 설명 */}
      <div className="mt-6 max-w-3xl text-center text-lg leading-relaxed">
        전북대학교 빅데이터 혁신융합대학에서 주최하는 이번 캠프는 <br />
        <span className="font-semibold text-blue-500">빅데이터</span>와
        <span className="font-semibold text-green-500"> 생성형 AI</span>를
        활용하여 창의적 문제 해결 능력과
        <span className="font-semibold text-purple-500"> 메타인지 역량</span>을
        키우는 올림피아드를 개최합니다.
      </div>

      <div className="mt-6 max-w-3xl text-center text-lg leading-relaxed">
        올림피아드에서는{' '}
        <span className="font-semibold text-red-500">프롬프트 엔지니어링</span>,
        <span className="font-semibold text-yellow-500">
          {' '}
          할루시네이션 분석
        </span>
        , 팀 프로젝트 등을 통해
        <span className="font-semibold text-blue-500">
          {' '}
          AI와의 효과적인 협업
        </span>{' '}
        및 실무 역량을 배양하며, 참가자 간 교류와 혁신적인 아이디어 공유의 장을
        제공합니다.
      </div>

      <div className="mt-2 text-4xl font-bold">Clarkson Bot</div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href="/login"
      >
        시작하기
        <IconArrowRight className="ml-1" size={20} />
      </Link>

      <footer className="mt-10 text-center text-sm text-gray-500">
        2025 전북대학교 올림피아드. All rights reserved.
      </footer>
    </div>
  );
}
