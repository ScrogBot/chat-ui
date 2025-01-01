'use client';

import { ChatHelp } from '@/components/chat/chat-help';
import { useChatHandler } from '@/components/chat/chat-hooks/use-chat-handler';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatSettings } from '@/components/chat/chat-settings';
import { ChatUI } from '@/components/chat/chat-ui';
import { QuickSettings } from '@/components/chat/quick-settings';
import { Brand } from '@/components/ui/brand';
import { ChatbotUIContext } from '@/context/context';
import useHotkey from '@/lib/hooks/use-hotkey';
import { useTheme } from 'next-themes';
import { useContext } from 'react';
import GameResultPage from '@/app/[locale]/[workspaceid]/game/[gametype]/page';

export default function ChatPage() {
  useHotkey('o', () => handleNewChat());
  useHotkey('l', () => {
    handleFocusChatInput();
  });

  const { chatMessages } = useContext(ChatbotUIContext);

  const { handleNewChat, handleFocusChatInput } = useChatHandler();

  const { theme } = useTheme();

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <GameResultPage />
    </div>
  );
}
