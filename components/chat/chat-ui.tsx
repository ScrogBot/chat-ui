import Loading from "@/app/[locale]/loading";  
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";  
import { ChatbotUIContext } from "@/context/context";  
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools";  
import { getChatFilesByChatId } from "@/db/chat-files";  
import { getChatById } from "@/db/chats";  
import { getMessageFileItemsByMessageId } from "@/db/message-file-items";  
import { getMessagesByChatId } from "@/db/messages";  
import { getMessageImageFromStorage } from "@/db/storage/message-images";  
import { convertBlobToBase64 } from "@/lib/blob-to-b64";  
import useHotkey from "@/lib/hooks/use-hotkey";  
import { LLMID, MessageImage } from "@/types";  
import { useParams } from "next/navigation";  
import { FC, useContext, useEffect, useState } from "react";  
import { ChatHelp } from "./chat-help";  
import { useScroll } from "./chat-hooks/use-scroll";  
import { ChatInput } from "./chat-input";  
import { ChatMessages } from "./chat-messages";  
import { ChatScrollButtons } from "./chat-scroll-buttons";  
import { ChatSecondaryButtons } from "./chat-secondary-buttons";  
import { LLM_LIST } from "@/lib/models/llm/llm-list";  
import { cn } from "@/lib/utils";  
import { IconBolt, IconCirclePlus, IconPlayerStopFilled } from "path/to/icons";  
  
interface ChatUIProps {}  
  
export const ChatUI: FC<ChatUIProps> = ({}) => {  
  const params = useParams();  
  
  const {  
    setChatMessages,  
    selectedChat,  
    setSelectedChat,  
    setChatSettings,  
    setChatImages,  
    assistants,  
    setSelectedAssistant,  
    setChatFileItems,  
    setChatFiles,  
    setShowFilesDisplay,  
    setUseRetrieval,  
    setSelectedTools,  
  } = useContext(ChatbotUIContext);  
  
  const { handleNewChat, handleFocusChatInput } = useChatHandler();  
  
  const {  
    messagesStartRef,  
    messagesEndRef,  
    handleScroll,  
    scrollToBottom,  
    setIsAtBottom,  
    isAtTop,  
    isAtBottom,  
    isOverflowing,  
    scrollToTop,  
  } = useScroll();  
  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    const fetchData = async () => {  
      await fetchMessages();  
      await fetchChat();  
  
      scrollToBottom();  
      setIsAtBottom(true);  
    };  
  
    fetchData();  
  
    const images: MessageImage[] = await Promise.all(imagePromises.flat());  
    setChatImages(images);  
  
    const messageFileItemPromises = fetchedMessages.map(  
      async (message) => await getMessageFileItemsByMessageId(message.id)  
    );  
  
    const messageFileItems = await Promise.all(messageFileItemPromises);  
  
    const uniqueFileItems = messageFileItems.flatMap((item) => item.file_items);  
    setChatFileItems(uniqueFileItems);  
  
    const chatFiles = await getChatFilesByChatId(params.chatid as string);  
  
    setChatFiles(  
      chatFiles.files.map
