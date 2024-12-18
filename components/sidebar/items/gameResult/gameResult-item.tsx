import { ModelIcon } from '@/components/models/model-icon';
import { WithTooltip } from '@/components/ui/with-tooltip';
import { ChatbotUIContext } from '@/context/context';
import { LLM_LIST } from '@/lib/models/llm/llm-list';
import { cn } from '@/lib/utils';
import { Tables } from '@/supabase/types';
import { LLM } from '@/types';
import { IconRobotFace } from '@tabler/icons-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FC, useContext, useRef } from 'react';

interface GameResultItemProps {
  gameResult: Tables<'game_results'>;
}

export const GameResultItem: FC<GameResultItemProps> = ({ gameResult }) => {
  const {
    selectedWorkspace,
    selectedChat,
    availableLocalModels,
    assistantImages,
    availableOpenRouterModels
  } = useContext(ChatbotUIContext);

  const router = useRouter();
  const params = useParams();
  const isActive =
    params.chatid === gameResult.id || selectedChat?.id === gameResult.id;

  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!selectedWorkspace) return;
    return router.push(`/${selectedWorkspace.id}/game`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      itemRef.current?.click();
    }
  };

  const MODEL_DATA = [
    ...LLM_LIST,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ].find(llm => llm.modelId === gameResult.model) as LLM;

  const assistantImage = assistantImages.find(
    image => image.assistantId === gameResult.assistant_id
  )?.base64;

  return (
    <div
      ref={itemRef}
      className={cn(
        'hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none',
        isActive && 'bg-accent'
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {gameResult.assistant_id ? (
        assistantImage ? (
          <Image
            style={{ width: '30px', height: '30px' }}
            className="rounded"
            src={assistantImage}
            alt="Assistant image"
            width={30}
            height={30}
          />
        ) : (
          <IconRobotFace
            className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
            size={30}
          />
        )
      ) : (
        <WithTooltip
          delayDuration={200}
          display={<div>{MODEL_DATA?.modelName}</div>}
          trigger={
            <ModelIcon provider={MODEL_DATA?.provider} height={30} width={30} />
          }
        />
      )}

      <div className="ml-3 flex-1 truncate text-sm font-semibold">
        {gameResult.name}
      </div>

      <div
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={`ml-2 flex space-x-2 ${!isActive && 'w-11 opacity-0 group-hover:opacity-100'}`}
      ></div>
    </div>
  );
};
