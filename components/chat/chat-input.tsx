import { ChatbotUIContext } from "@/context/context";  
import useHotkey from "@/lib/hooks/use-hotkey";  
import { LLM_LIST } from "@/lib/models/llm/llm-list";  
import { cn } from "@/lib/utils";  
import { IconBolt, IconCirclePlus, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";  
import Image from "next/image";  
import { FC, useContext, useEffect, useRef, useState } from "react";  
import { useTranslation } from "react-i18next";  
import { toast } from "sonner";  
import { Input, TextareaAutosize } from "../ui";  
import { ChatCommandInput, ChatFilesDisplay } from "./";  
import { useChatHandler, usePromptAndCommand, useSelectFileHandler, useChatHistoryHandler } from "./chat-hooks";  
import { PubMedArticle } from "../pubmedService";  
  
interface ChatInputProps {}  
  
export const ChatInput: FC<ChatInputProps> = ({}) => {  
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
    searchPubMed,  
    pubMedArticles,  
    setPubMedArticles,  
    setUserInput  
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
  
      // Check if the query should trigger a PubMed search  
      const shouldSearchPubMed = query.startsWith("pubmed:");  
  
      if (shouldSearchPubMed) {  
        const searchQuery = query.replace("pubmed:", "").trim();  
        if (searchQuery) {  
          try {  
            const results = await searchPubMed(searchQuery);  
            setPubMedArticles(results.results);  
          } catch (error) {  
            toast.error("Failed to fetch PubMed articles.");  
          }  
        }  
      } else {  
        handleSendMessage(userInput, chatMessages, false);  
      }  
  
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
        event.key ===
