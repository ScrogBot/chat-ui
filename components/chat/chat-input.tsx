import { ChatbotUIContext } from '@/context/context';
import useHotkey from '@/lib/hooks/use-hotkey';
import { LLM_LIST } from '@/lib/models/llm/llm-list';
import { cn } from '@/lib/utils';
import {
  IconBolt,
  IconCirclePlus,
  IconFile,
  IconPlayerStopFilled,
  IconQuestionMark,
  IconSend,
  IconServer
} from '@tabler/icons-react';
import Image from 'next/image';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { TextareaAutosize } from '../ui/textarea-autosize';
import { ChatCommandInput } from './chat-command-input';
import { ChatFilesDisplay } from './chat-files-display';
import { useChatHandler } from './chat-hooks/use-chat-handler';
import { useChatHistoryHandler } from './chat-hooks/use-chat-history';
import { usePromptAndCommand } from './chat-hooks/use-prompt-and-command';
import { useSelectFileHandler } from './chat-hooks/use-select-file-handler';

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { t } = useTranslation();

  useHotkey('l', () => {
    handleFocusChatInput();
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const {
    isAssistantPickerOpen,
    focusAssistant,
    setFocusAssistant,
    userInput,
    chatMessages,
    isGenerating,
    selectedPreset,
    selectedAssistant,
    focusPrompt,
    setFocusPrompt,
    focusFile,
    focusTool,
    setFocusTool,
    isToolPickerOpen,
    isPromptPickerOpen,
    setIsPromptPickerOpen,
    isFilePickerOpen,
    setFocusFile,
    chatSettings,
    selectedTools,
    setSelectedTools,
    assistantImages
  } = useContext(ChatbotUIContext);

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput,
    handleSubmitMessage
  } = useChatHandler();

  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
  const [showQuestionTooltip, setShowQuestionTooltip] = useState(false);

  const { handleInputChange } = usePromptAndCommand();

  const { filesToAccept, handleSelectDeviceFile } = useSelectFileHandler();

  const {
    setNewMessageContentToNextUserMessage,
    setNewMessageContentToPreviousUserMessage
  } = useChatHistoryHandler();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      handleFocusChatInput();
    }, 200); // FIX: hacky
  }, [selectedPreset, selectedAssistant]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setIsPromptPickerOpen(false);
      handleSendMessage(userInput, chatMessages, false);
    }

    // Consolidate conditions to avoid TypeScript error
    if (
      isPromptPickerOpen ||
      isFilePickerOpen ||
      isToolPickerOpen ||
      isAssistantPickerOpen
    ) {
      if (
        event.key === 'Tab' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault();
        // Toggle focus based on picker type
        if (isPromptPickerOpen) setFocusPrompt(!focusPrompt);
        if (isFilePickerOpen) setFocusFile(!focusFile);
        if (isToolPickerOpen) setFocusTool(!focusTool);
        if (isAssistantPickerOpen) setFocusAssistant(!focusAssistant);
      }
    }

    if (event.key === 'ArrowUp' && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToPreviousUserMessage();
    }

    if (event.key === 'ArrowDown' && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToNextUserMessage();
    }

    //use shift+ctrl+up and shift+ctrl+down to navigate through chat history
    if (event.key === 'ArrowUp' && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToPreviousUserMessage();
    }

    if (event.key === 'ArrowDown' && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToNextUserMessage();
    }

    if (
      isAssistantPickerOpen &&
      (event.key === 'Tab' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      setFocusAssistant(!focusAssistant);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const imagesAllowed = LLM_LIST.find(
      llm => llm.modelId === chatSettings?.model
    )?.imageInput;

    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        if (!imagesAllowed) {
          toast.error(
            `Images are not supported for this model. Use models like GPT-4 Vision instead.`
          );
          return;
        }
        const file = item.getAsFile();
        if (!file) return;
        handleSelectDeviceFile(file);
      }
    }
  };

  const isFinetuning = chatSettings?.model === 'FineTuning_LLM';

  return (
    <>
      <div className="flex flex-col flex-wrap justify-center gap-2">
        <ChatFilesDisplay />

        {selectedTools &&
          selectedTools.map((tool, index) => (
            <div
              key={index}
              className="flex justify-center"
              onClick={() =>
                setSelectedTools(
                  selectedTools.filter(
                    selectedTool => selectedTool.id !== tool.id
                  )
                )
              }
            >
              <div className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 hover:opacity-50">
                <IconBolt size={20} />

                <div>{tool.name}</div>
              </div>
            </div>
          ))}

        {selectedAssistant && (
          <div className="border-primary mx-auto flex w-fit items-center space-x-2 rounded-lg border p-1.5">
            {selectedAssistant.image_path && (
              <Image
                className="rounded"
                src={
                  assistantImages.find(
                    img => img.path === selectedAssistant.image_path
                  )?.base64
                }
                width={28}
                height={28}
                alt={selectedAssistant.name}
              />
            )}

            <div className="text-sm font-bold">
              Talking to {selectedAssistant.name}
            </div>
          </div>
        )}
      </div>

      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
          <ChatCommandInput />
        </div>

        <>
          <IconCirclePlus
            className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
            size={32}
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Hidden input to select files from device */}
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={e => {
              if (!e.target.files) return;
              handleSelectDeviceFile(e.target.files[0]);
            }}
            accept={filesToAccept}
          />
        </>

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={t(
            // `Ask anything. Type "@" for assistants, "/" for prompts, "#" for files, and "!" for tools.`
            `Ask anything. Type '/' for prompts, '#' for files`
          )}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-20 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled
              className="hover:bg-background animate-pulse rounded bg-transparent p-1"
              onClick={handleStopMessage}
              size={30}
            />
          ) : (
            <IconSend
              className={cn(
                'bg-primary text-secondary rounded p-1',
                !userInput && 'cursor-not-allowed opacity-50'
              )}
              onClick={() => {
                if (!userInput) return;

                handleSendMessage(userInput, chatMessages, false);
              }}
              size={30}
            />
          )}
        </div>
        <div>
          <div
            className="absolute bottom-[14px] right-11 cursor-pointer hover:opacity-50"
            onMouseEnter={() => setShowQuestionTooltip(true)}
            onMouseLeave={() => setShowQuestionTooltip(false)}
          >
            <IconQuestionMark
              className={cn(
                'bg-primary text-secondary rounded p-1',
                !isFinetuning && 'cursor-not-allowed opacity-50'
              )}
              onClick={() => {
                if (!isFinetuning) return;
                alert(
                  '사용법 : Prompt 및 RAG를 구축해서 문제를 풀어주세요. \n' +
                    '아래는 테스트 문제입니다.\n' +
                    '1. Few shot에 대해 설명해줘\n' +
                    '2. RAG에 대해서 알려줘\n' +
                    '3. 빅데이터 활용방안 알려줘.\n' +
                    '\n' +
                    '최종 완료 시 오른쪽 Submit을 눌러주세요. 채점에는 약 15분이 소요됩니다.'
                );
              }}
              size={30}
            />
            {showQuestionTooltip && (
              <div className="absolute bottom-[50px] right-3 rounded bg-gray-700 p-2 text-sm text-white shadow-lg">
                도움말
              </div>
            )}
          </div>
        </div>
        <div>
          <div
            className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50"
            onMouseEnter={() => setShowSubmitTooltip(true)}
            onMouseLeave={() => setShowSubmitTooltip(false)}
          >
            {isGenerating ? (
              <IconPlayerStopFilled
                className="hover:bg-background animate-pulse rounded bg-transparent p-1"
                onClick={handleStopMessage}
                size={30}
              />
            ) : (
              <IconFile
                className={cn(
                  'bg-primary text-secondary rounded p-1',
                  (userInput || !isFinetuning) &&
                    'cursor-not-allowed opacity-50'
                )}
                onClick={() => {
                  if (!isFinetuning) return;
                  handleSubmitMessage(userInput, chatMessages, false);
                }}
                size={30}
              />
            )}
            {showSubmitTooltip && (
              <div className="absolute bottom-[50px] right-3 rounded bg-gray-700 p-2 text-sm text-white shadow-lg">
                제출
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
