import { FC, useContext, useEffect, useRef, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import useHotkey from "@/lib/hooks/use-hotkey";
import { LLM_LIST } from "@/lib/models/llm/llm-list";
import { cn } from "@/lib/utils";
import { IconBolt, IconCirclePlus, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { TextareaAutosize } from "../ui/textarea-autosize";
import { ChatCommandInput } from "./chat-command-input";
import { ChatFilesDisplay } from "./chat-files-display";
import { useChatHandler } from "./chat-hooks/use-chat-handler";
import { useChatHistoryHandler } from "./chat-hooks/use-chat-history";
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command";
import { useSelectFileHandler } from "./chat-hooks/use-select-file-handler";

interface ChatInputProps {
  onUserInput: (input: string) => Promise<void>;
}

export const ChatInput: FC<ChatInputProps> = ({ onUserInput }) => {
  
  const { t } = useTranslation();

  useHotkey("l", () => {
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
    assistantImages,
    setUserInput,
    pubMedArticles, // Ensure this is added to the context
  } = useContext(ChatbotUIContext);

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput
  } = useChatHandler();

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

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const query = userInput.trim();
      await onUserInput(query);
      setUserInput(""); // Clear the input after sending the message
    }

    if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToPreviousUserMessage();
    }

    if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      setNewMessageContentToNextUserMessage();
    }

    if (
      isAssistantPickerOpen &&
      (event.key === "Tab" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown")
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
      if (item.type.indexOf("image") === 0) {
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
            `Ask anything. Type @  /  #  !`
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

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled
              className="hover:bg-background animate-pulse rounded bg-transparent p-1"
              onClick={handleStopMessage}
              size={30}
            />
          ) : (
            <IconSend
              className={cn(
                "bg-primary text-secondary rounded p-1",
                !userInput && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (!userInput) return;

                handleSendMessage(userInput, chatMessages, false);
              }}
              size={30}
            />
          )}
        </div>
      </div>

      {/* Display PubMed Search Results */}
      {pubMedArticles.length > 0 && (
        <div className="mt-4">
          <h2>PubMed Search Results</h2>
          {pubMedArticles.map((article, index) => (
            <div key={index} className="article">
              <h3>{article.id}</h3> {/* Displaying the ID */}
              {/* Display other properties if available */}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default ChatInput;
